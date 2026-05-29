import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resume } from './entities/resume.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ResumeService {
  constructor(
    @InjectRepository(Resume)
    private resumeRepository: Repository<Resume>,
  ) {}

  async uploadResume(userId: string, file: Express.Multer.File) {
    // 保存文件
    const uploadDir = path.join(process.cwd(), 'uploads', 'resumes');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}_${file.originalname}`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, file.buffer);

    // 保存到数据库
    const resume = this.resumeRepository.create({
      userId,
      fileName: file.originalname,
      filePath: fileName,
      fileSize: file.size,
      mimeType: file.mimetype,
    });

    await this.resumeRepository.save(resume);

    return {
      fileId: resume.id,
      fileName: resume.fileName,
    };
  }

  async getResumeList(userId: string) {
    const resumes = await this.resumeRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    return resumes.map((resume) => ({
      id: resume.id,
      fileName: resume.fileName,
      fileSize: resume.fileSize,
      createdAt: resume.createdAt,
    }));
  }
}
