import { Repository } from 'typeorm';
import { Resume } from './entities/resume.entity';
export declare class ResumeService {
    private resumeRepository;
    constructor(resumeRepository: Repository<Resume>);
    uploadResume(userId: string, file: Express.Multer.File): Promise<{
        fileId: string;
        fileName: string;
    }>;
    getResumeList(userId: string): Promise<{
        id: string;
        fileName: string;
        fileSize: number;
        createdAt: Date;
    }[]>;
}
