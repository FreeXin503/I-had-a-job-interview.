import { InterviewQuestion } from './interview-question.entity';
import { InterviewAnswer } from './interview-answer.entity';
export declare class Interview {
    id: string;
    userId: string;
    experience: string;
    style: string;
    jobTitle: string;
    resumeMode: string;
    resumeFileId: string;
    status: string;
    startTime: Date;
    endTime: Date;
    duration: number;
    score: number;
    rating: string;
    reportData: string;
    questions: InterviewQuestion[];
    answers: InterviewAnswer[];
    createdAt: Date;
    updatedAt: Date;
}
