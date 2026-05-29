import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { InterviewService } from './interview.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';

@Controller('interview')
@UseGuards(JwtAuthGuard)
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  /**
   * 创建面试会话
   */
  @Post('create')
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
  async getInterview(@Param('id') id: string) {
    const interview = await this.interviewService.getInterview(id);
    return {
      code: 200,
      message: '获取成功',
      data: interview,
    };
  }
}
