import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('agent')
export class AgentController {
  @Post('speech-to-text')
  @UseInterceptors(FileInterceptor('audio'))
  async speechToText(@UploadedFile() file: Express.Multer.File) {
    const uploadDir = path.join(process.cwd(), 'public', 'audio');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const originalName = file ? file.originalname : 'voice.mp3';
    const fileName = `user_${Date.now()}_${originalName}`;
    
    if (file && file.buffer) {
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, file.buffer);
    }

    return {
      code: 200,
      message: '转换成功',
      data: {
        text: '我拥有三年的前端开发经验，熟练掌握 Vue、React 以及小程序开发。',
      },
    };
  }
}
