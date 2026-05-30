import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { InterviewService } from './interview.service';
import { TtsService } from './tts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';

@Controller('interview')
export class InterviewController {
  constructor(
    private readonly interviewService: InterviewService,
    private readonly ttsService: TtsService,
  ) {}

  /**
   * 上传用户录音文件，返回模拟识别文字
   */
  @Post('upload-audio')
  @UseInterceptors(FileInterceptor('audio'))
  async uploadAudio(
    @UploadedFile() file: Express.Multer.File,
    @Body('duration') duration: number,
    @Request() req: any,
    @Body('history') historyStr?: string,
  ) {
    const uploadDir = path.join(process.cwd(), 'public', 'audio');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const originalName = file ? file.originalname : 'voice.wav';
    const fileName = `user_${Date.now()}_${originalName}`;
    
    let recognizedText = '';

    if (file && file.buffer) {
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, file.buffer);

      try {
        const formData = new FormData();
        const blob = new Blob([file.buffer as any], { type: file.mimetype });
        formData.append('audio_file', blob, originalName);

        const response = await axios.post('http://localhost:8000/api/agent/speech-to-text', formData);
        if (response.data && response.data.code === 200 && response.data.data.text) {
          recognizedText = response.data.data.text;
          console.log(`[ASR 成功] 识别结果: "${recognizedText}"`);
        }
      } catch (err) {
        console.error('[ASR 失败] 调用 Python Agent 失败，改用模拟回答:', err.message);
      }
    }

    // 如果 ASR 失败，才使用模拟文本降级，保证流程绝对不挂掉
    if (!recognizedText) {
      const mockTexts = [
        '您好！我叫李明，有两年前端开发经验，熟悉 Vue、React 和微信小程序。',
        '我做过一个 SaaS 管理后台，将首屏加载时间从 5 秒优化到了 1.2 秒。',
        '最大的挑战是复杂状态管理，通过引入 Pinia 拆分模块解决了数据流混乱。',
        '我非常重视团队协作，曾主动整理技术对比文档解决选型分歧。',
        '我希望三年内成为资深前端工程师，专注性能优化 and 工程化方向。',
        '我对贵公司 AI 产品非常感兴趣，希望在这里持续成长并创造价值。',
        '我想了解团队的技术栈 and 新人成长路径，谢谢！',
      ];
      const idx = Math.floor(Date.now() / 1000) % mockTexts.length;
      recognizedText = mockTexts[idx];
    }

    // 调用 Python Agent 大模型进行“思考与追问反馈”
    let nextQuestion = '';
    let previousAnswersLength = 0;
    try {
      const previousQuestions = [];
      const previousAnswers = [];

      if (historyStr) {
        try {
          const dialogues = JSON.parse(historyStr);
          dialogues.forEach((d: any) => {
            if (d.type === 'ai') {
              previousQuestions.push({ questionText: d.text });
            } else if (d.type === 'user') {
              previousAnswers.push({ answerText: d.text });
            }
          });
        } catch (e) {
          console.error('解析历史对话失败:', e);
        }
      }

      // 将本次的回答追加进历史中，供 AI 面试官思考
      previousAnswers.push({ answerText: recognizedText });
      previousAnswersLength = previousAnswers.length;

      console.log(`[AI 思考中] 正在调用 DeepSeek-V4-Flash 生成下个问题...`);
      const nextQuestionResponse = await axios.post('http://localhost:8000/api/agent/generate-next-question', {
        experience: '2年经验',
        style: 'standard',
        jobTitle: '前端开发工程师',
        previousQuestions,
        previousAnswers,
      });

      if (nextQuestionResponse.data && nextQuestionResponse.data.code === 200 && nextQuestionResponse.data.data.text) {
        nextQuestion = nextQuestionResponse.data.data.text;
        // 去除任何 markdown 星号标记
        nextQuestion = nextQuestion.replace(/\*/g, '');
        console.log(`[AI 思考完成] 生成的新问题: "${nextQuestion}"`);
      }
    } catch (err) {
      console.error('[AI 思考失败] 调用 Python Agent 生成下一题失败:', err.message);
    }

    // 思考失败时的兜底（从原先硬编码的问题库里取下一道）
    if (!nextQuestion) {
      const AI_QUESTIONS = [
        '请介绍一下您做过的印象最深的项目经验。',
        '您在工作中遇到过最大的技术挑战是什么？如何解决的？',
        '您如何看待团队合作？有没有和同事产生分歧的经历，如何处理的？',
        '您对未来三到五年的职业规划是怎样的？',
        '您为什么想加入我们公司？对我们有什么了解？',
        '您有什么问题想问我们吗？'
      ];
      nextQuestion = AI_QUESTIONS[previousAnswersLength % AI_QUESTIONS.length];
    }

    // 动态提取手机请求过来的真实主机地址与协议 (如 http://10.148.148.74:3000)
    const host = req.headers.host || 'localhost:3000';
    const protocol = req.secure ? 'https' : 'http';
    const requestHost = `${protocol}://${host}`;

    return {
      text: recognizedText,
      nextQuestion: nextQuestion,
      audioUrl: `${requestHost}/public/audio/${fileName}`,
      duration: duration ? Number(duration) : 5000,
    };
  }

  /**
   * 文字转语音 TTS（无需登录，供面试页直接调用）
   */
  @Post('tts')
  async tts(
    @Body('text') text: string,
    @Body('gender') gender: string,
    @Body('style') style: string,
    @Request() req: any,
  ) {
    if (!text) return { audioUrl: '' };
    // 去除任何 markdown 星号标记，使 TTS 合成文本最干净
    const cleanText = text.replace(/\*/g, '');
    const questionId = `tts_${Date.now()}`;
    const audioUrl = await this.ttsService.generateSpeech(
      cleanText,
      questionId,
      gender || 'female',
      style || 'standard',
    );

    // 动态提取手机请求过来的真实主机地址与协议 (如 http://10.148.148.74:3000)
    const host = req.headers.host || 'localhost:3000';
    const protocol = req.secure ? 'https' : 'http';
    const requestHost = `${protocol}://${host}`;

    // 将后台写死的 http://localhost:3000 动态替换为手机请求所在的局域网 IP 主机地址
    const dynamicAudioUrl = audioUrl.replace('http://localhost:3000', requestHost);

    return { audioUrl: dynamicAudioUrl || '' };
  }

  /**
   * 语音识别 (智能对话模拟)
   */
  @Post('recognize')
  async recognize(
    @Body('audioUrl') audioUrl: string,
    @Body('interviewId') interviewId: string,
  ) {
    let text = '我拥有三年的前端开发经验，熟练掌握 Vue、React 以及小程序开发。';
    try {
      if (interviewId && interviewId !== 'test') {
        const interview = await this.interviewService.getInterview(interviewId);
        if (interview && interview.questions) {
          const answeredCount = interview.questions.filter(q => q.audioUrl).length;
          
          const mockAnswers = [
            '我拥有三年的前端开发经验，熟练掌握 Vue、React 以及小程序开发。',
            '在上一家公司，我主要负责核心业务组件的开发和性能优化，使页面加载速度提升了30%。',
            '我对前端工程化有深入的理解，熟悉 Webpack 和 Vite 的配置与优化。',
            '在团队协作中，我善于沟通，能够快速理解需求并高效产出高质量代码。'
          ];
          
          text = mockAnswers[answeredCount % mockAnswers.length];
        }
      }
    } catch (e) {
      console.error('获取面试次数出错，使用降级默认回复', e);
    }

    return {
      text: text,
    };
  }

  /**
   * 创建面试会话
   */
  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createInterview(
    @Request() req,
    @Body() createInterviewDto: CreateInterviewDto,
  ) {
    const userId = req.user.userId;
    const interview = await this.interviewService.createInterview(
      userId,
      createInterviewDto,
    );
    return {
      code: 200,
      message: '面试会话创建成功',
      data: interview,
    };
  }

  /**
   * 开始面试
   */
  @Post(':id/start')
  @UseGuards(JwtAuthGuard)
  async startInterview(@Param('id') id: string) {
    const result = await this.interviewService.startInterview(id);
    return {
      code: 200,
      message: '面试开始',
      data: result,
    };
  }

  /**
   * 获取下一个问题
   */
  @Get(':id/next-question')
  @UseGuards(JwtAuthGuard)
  async getNextQuestion(@Param('id') id: string) {
    const question = await this.interviewService.getNextQuestion(id);
    return {
      code: 200,
      message: '获取问题成功',
      data: question,
    };
  }

  /**
   * 提交答案
   */
  @Post(':id/submit-answer')
  @UseGuards(JwtAuthGuard)
  async submitAnswer(
    @Param('id') id: string,
    @Body() submitAnswerDto: SubmitAnswerDto,
  ) {
    const result = await this.interviewService.submitAnswer(id, submitAnswerDto);
    return {
      code: 200,
      message: '答案提交成功',
      data: result,
    };
  }

  /**
   * 结束面试
   */
  @Post(':id/end')
  @UseGuards(JwtAuthGuard)
  async endInterview(@Param('id') id: string) {
    const report = await this.interviewService.endInterview(id);
    return {
      code: 200,
      message: '面试结束',
      data: report,
    };
  }

  /**
   * 获取面试报告
   */
  @Get(':id/report')
  @UseGuards(JwtAuthGuard)
  async getReport(@Param('id') id: string) {
    const report = await this.interviewService.getReport(id);
    return {
      code: 200,
      message: '获取报告成功',
      data: report,
    };
  }

  /**
   * 获取最近面试记录
   */
  @Get('recent')
  @UseGuards(JwtAuthGuard)
  async getRecentInterviews(@Request() req, @Query('limit') limit: number = 10) {
    const userId = req.user.userId;
    const interviews = await this.interviewService.getRecentInterviews(
      userId,
      limit,
    );
    return {
      code: 200,
      message: '获取成功',
      data: interviews,
    };
  }

  /**
   * 获取面试详情
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getInterview(@Param('id') id: string) {
    const interview = await this.interviewService.getInterview(id);
    return {
      code: 200,
      message: '获取成功',
      data: interview,
    };
  }
}
