import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { UniversalEdgeTTS } from 'edge-tts-universal';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TtsService implements OnModuleInit {
  private readonly logger = new Logger(TtsService.name);

  onModuleInit() {
    this.logger.log('TTS Service initialized, starting automated disk cleanup job...');
    // Run cleanup immediately on startup
    this.cleanOldAudioFiles();
    // Then run every 30 minutes
    setInterval(() => {
      this.cleanOldAudioFiles();
    }, 30 * 60 * 1000);
  }

  private cleanOldAudioFiles() {
    try {
      const publicDir = path.join(process.cwd(), 'public', 'audio');
      if (!fs.existsSync(publicDir)) {
        return;
      }

      const files = fs.readdirSync(publicDir);
      const now = Date.now();
      const oneHourAgo = now - 60 * 60 * 1000; // 1 hour

      let deletedCount = 0;

      for (const file of files) {
        if (file.endsWith('.mp3') || file.endsWith('.wav')) {
          const filePath = path.join(publicDir, file);
          try {
            const stats = fs.statSync(filePath);
            if (stats.mtimeMs < oneHourAgo) {
              fs.unlinkSync(filePath);
              deletedCount++;
            }
          } catch (e) {
            this.logger.error(`Failed to clean file ${file}:`, e);
          }
        }
      }

      if (deletedCount > 0) {
        this.logger.log(`[Disk Cleanup] Cleaned up ${deletedCount} temporary audio files (older than 1 hour).`);
      }
    } catch (error) {
      this.logger.error('[Disk Cleanup] Failed to run audio files cleanup:', error);
    }
  }

  /**
   * 将文字转为语音，并返回静态文件的URL
   * @param text 要转语音的文字
   * @param questionId 问题唯一ID，用作文件名
   * @param gender 性别 ('male' 或 'female')
   * @param style 面试风格 ('standard', 'gentle', 'stress', 'random')
   */
  async generateSpeech(
    text: string,
    questionId: string,
    gender: string = 'female',
    style: string = 'standard',
  ): Promise<string> {
    try {
      let voiceName = 'zh-CN-XiaoxiaoNeural';
      let prosodyOptions: any = {};

      if (gender === 'male') {
        // 男生选项：调校为饱满、沉稳且具有极强呼吸感的声线
        switch (style) {
          case 'gentle': // 温和男声 (云希：提高语速，温暖和蔼)
            voiceName = 'zh-CN-YunxiNeural';
            prosodyOptions = { rate: '+6%', pitch: '+1Hz' };
            break;
          case 'stress': // 压力男声 (云阳：严厉快速，压迫感强)
            voiceName = 'zh-CN-YunyangNeural';
            prosodyOptions = { rate: '+16%', pitch: '-3Hz' };
            break;
          case 'random': // 随机
            const maleStyles = ['standard', 'gentle', 'stress'];
            const chosenMaleStyle = maleStyles[Math.floor(Math.random() * maleStyles.length)];
            return this.generateSpeech(text, questionId, gender, chosenMaleStyle);
          case 'standard': // 标准男声 (云希：标准职场，干练快速)
          default:
            voiceName = 'zh-CN-YunxiNeural';
            prosodyOptions = { rate: '+10%', pitch: '+0Hz' };
            break;
        }
      } else {
        // 女生选项：调校为极具情感波动、温婉生动的职场HR声线
        switch (style) {
          case 'gentle': // 温和女声 (晓晓：轻柔鼓励，语速适中偏快)
            voiceName = 'zh-CN-XiaoxiaoNeural';
            prosodyOptions = { rate: '+6%', pitch: '+2Hz' };
            break;
          case 'stress': // 压力女声 (晓辰：理智冷静，高强压快速提问)
            voiceName = 'zh-CN-XiaochenNeural';
            prosodyOptions = { rate: '+16%', pitch: '-2Hz' };
            break;
          case 'random': // 随机
            const femaleStyles = ['standard', 'gentle', 'stress'];
            const chosenFemaleStyle = femaleStyles[Math.floor(Math.random() * femaleStyles.length)];
            return this.generateSpeech(text, questionId, gender, chosenFemaleStyle);
          case 'standard': // 标准女声 (晓晓：沉稳大方，干练流畅快速)
          default:
            voiceName = 'zh-CN-XiaoxiaoNeural';
            prosodyOptions = { rate: '+10%', pitch: '+1Hz' };
            break;
        }
      }

      this.logger.log(`开始语音合成: voice=${voiceName}, gender=${gender}, style=${style}, prosody=${JSON.stringify(prosodyOptions)}, textLength=${text.length}`);

      // 2. 调用 edge-tts-universal
      const tts = new UniversalEdgeTTS(text, voiceName, prosodyOptions);
      const audioBuffer = await tts.synthesize();

      // 将 Blob 转换为 Buffer 以写入本地文件系统
      const arrayBuffer = await audioBuffer.audio.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // 3. 确定并创建音频保存目录 (public/audio)
      const publicDir = path.join(process.cwd(), 'public', 'audio');
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }

      // 保存为 MP3
      const fileName = `question_${questionId}.mp3`;
      const filePath = path.join(publicDir, fileName);
      fs.writeFileSync(filePath, buffer);

      this.logger.log(`语音合成成功: ${filePath}`);

      // 4. 返回绝对/相对访问路径
      const host = process.env.HOST || 'http://localhost:3000';
      return `${host}/public/audio/${fileName}`;
    } catch (error) {
      this.logger.error('语音合成失败:', error);
      return ''; // 失败时不影响主业务流程，只返回空链接
    }
  }
}
