import { ResumeService } from './resume.service';
export declare class ResumeController {
    private resumeService;
    constructor(resumeService: ResumeService);
    uploadResume(req: any, file: Express.Multer.File): Promise<{
        code: number;
        message: string;
        data: {
            fileId: string;
            fileName: string;
        };
    }>;
    getResumeList(req: any): Promise<{
        code: number;
        message: string;
        data: {
            id: string;
            fileName: string;
            fileSize: number;
            createdAt: Date;
        }[];
    }>;
}
