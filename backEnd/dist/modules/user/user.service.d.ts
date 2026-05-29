import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    getUserInfo(userId: string): Promise<{
        id: string;
        username: string;
        nickname: string;
        avatar: string;
        pointsBalance: number;
        mockInterviewCount: number;
        resumeOptimizationCount: number;
    }>;
    getUserStats(userId: string): Promise<{
        pointsBalance: number;
        mockInterviewCount: number;
        resumeOptimizationCount: number;
    }>;
    updatePoints(userId: string, points: number): Promise<number>;
    incrementMockInterviewCount(userId: string): Promise<void>;
}
