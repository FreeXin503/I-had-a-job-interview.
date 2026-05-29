import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        token: string;
        user: {
            id: string;
            username: string;
            nickname: string;
            pointsBalance: number;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        token: string;
        user: {
            id: string;
            username: string;
            nickname: string;
            pointsBalance: number;
        };
    }>;
    wechatLogin(code: string): Promise<{
        token: string;
        user: {
            id: string;
            nickname: string;
            pointsBalance: number;
        };
    }>;
    private generateToken;
    validateUser(userId: string): Promise<User>;
}
