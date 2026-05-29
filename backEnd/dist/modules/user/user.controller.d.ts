import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getUserInfo(req: any): Promise<{
        code: number;
        message: string;
        data: {
            id: string;
            username: string;
            nickname: string;
            avatar: string;
            pointsBalance: number;
            mockInterviewCount: number;
            resumeOptimizationCount: number;
        };
    }>;
    getUserStats(req: any): Promise<{
        code: number;
        message: string;
        data: {
            pointsBalance: number;
            mockInterviewCount: number;
            resumeOptimizationCount: number;
        };
    }>;
}
