import { Interview } from './interview.entity';
export declare class InterviewQuestion {
    id: string;
    interviewId: string;
    questionText: string;
    questionOrder: number;
    questionType: string;
    audioUrl: string;
    interview: Interview;
    createdAt: Date;
}
