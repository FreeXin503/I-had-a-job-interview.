import { Interview } from './interview.entity';
export declare class InterviewAnswer {
    id: string;
    interviewId: string;
    questionId: string;
    answerText: string;
    audioUrl: string;
    duration: number;
    analysis: string;
    interview: Interview;
    createdAt: Date;
}
