import {
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResumeService } from './resume.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('resume')
@UseGuards(JwtAuthGuard)
export class ResumeController {
  constructor(private resumeService: ResumeService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadResume(@Request() req, @UploadedFile() file: Express.Multer.File) {
    const userId = req.user.userId;
    const result = await this.resumeService.uploadResume(userId, file);
    return {
      code: 200,
      message: '上传成功',
      data: result,
    };
  }

  @Get('list')
  async getResumeList(@Request() req) {
    const userId = req.user.userId;
    const resumes = await this.resumeService.getResumeList(userId);
    return {
      code: 200,
      message: '获取成功',
      data: resumes,
    };
  }
}
