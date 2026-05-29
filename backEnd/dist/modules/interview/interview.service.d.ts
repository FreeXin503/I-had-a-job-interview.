import { Repository } from 'typeorm';
import { Interview } from './entities/interview.entity';
import { InterviewQuestion } from './entities/interview-question.entity';
import { InterviewAnswer } from './entities/interview-answer.entity';
import { AgentService } from '../agent/agent.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
export declare class InterviewService {
    private interviewRepository;
    private questionRepository;
    private answerRepository;
    private agentService;
    constructor(interviewRepository: Repository<Interview>, questionRepository: Repository<InterviewQuestion>, answerRepository: Repository<InterviewAnswer>, agentService: AgentService);
    createInterview(userId: string, dto: CreateInterviewDto): Promise<Interview>;
    startInterview(interviewId: string): Promise<{
        interviewId: string;
        question: any;
    }>;
    getNextQuestion(interviewId: string): Promise<any>;
    submitAnswer(interviewId: string, dto: SubmitAnswerDto): Promise<{
        answerId: string;
        analysis: any;
    }>;
    endInterview(interviewId: string): Promise<any>;
    getReport(interviewId: string): Promise<any>;
    getRecentInterviews(userId: string, limit?: number): Promise<{
        id: string;
        jobTitle: string;
        experience: string;
        style: string;
        score: number;
        rating: string;
        duration: number;
        status: string;
        date: Date;
    }[]>;
    getInterview(interviewId: string): Promise<Interview>;
}
