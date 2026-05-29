import { InterviewService } from './interview.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
export declare class InterviewController {
    private readonly interviewService;
    constructor(interviewService: InterviewService);
    createInterview(req: any, createInterviewDto: CreateInterviewDto): Promise<{
        code: number;
        message: string;
        data: import("./entities/interview.entity").Interview;
    }>;
    startInterview(id: string): Promise<{
        code: number;
        message: string;
        data: {
            interviewId: string;
            question: any;
        };
    }>;
    getNextQuestion(id: string): Promise<{
        code: number;
        message: string;
        data: any;
    }>;
    submitAnswer(id: string, submitAnswerDto: SubmitAnswerDto): Promise<{
        code: number;
        message: string;
        data: {
            answerId: string;
            analysis: any;
        };
    }>;
    endInterview(id: string): Promise<{
        code: number;
        message: string;
        data: any;
    }>;
    getReport(id: string): Promise<{
        code: number;
        message: string;
        data: any;
    }>;
    getRecentInterviews(req: any, limit?: number): Promise<{
        code: number;
        message: string;
        data: {
            id: string;
            jobTitle: string;
            experience: string;
            style: string;
            score: number;
            rating: string;
            duration: number;
            status: string;
            date: Date;
        }[];
    }>;
    getInterview(id: string): Promise<{
        code: number;
        message: string;
        data: import("./entities/interview.entity").Interview;
    }>;
}
