import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        code: number;
        message: string;
        data: {
            token: string;
            user: {
                id: string;
                username: string;
                nickname: string;
                pointsBalance: number;
            };
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        code: number;
        message: string;
        data: {
            token: string;
            user: {
                id: string;
                username: string;
                nickname: string;
                pointsBalance: number;
            };
        };
    }>;
    wechatLogin(body: {
        code: string;
    }): Promise<{
        code: number;
        message: string;
        data: {
            token: string;
            user: {
                id: string;
                nickname: string;
                pointsBalance: number;
            };
        };
    }>;
}
