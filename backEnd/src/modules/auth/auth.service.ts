import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { username, password, nickname } = registerDto;

    // 检查用户是否已存在
    const existingUser = await this.userRepository.findOne({
      where: { username },
    });

    if (existingUser) {
      throw new UnauthorizedException('用户名已存在');
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      nickname: nickname || username,
      pointsBalance: 20, // 新用户赠送20积分
    });

    await this.userRepository.save(user);

    // 生成token
    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        pointsBalance: user.pointsBalance,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    // 查找用户
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 生成token
    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        pointsBalance: user.pointsBalance,
      },
    };
  }

  async wechatLogin(code: string) {
    // TODO: 实现微信登录逻辑
    // 1. 使用code换取openid
    // 2. 查找或创建用户
    // 3. 生成token

    // 临时实现：创建测试用户
    let user = await this.userRepository.findOne({
      where: { openid: 'test_openid' },
    });

    if (!user) {
      user = this.userRepository.create({
        openid: 'test_openid',
        nickname: '微信用户',
        pointsBalance: 20,
      });
      await this.userRepository.save(user);
    }

    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user.id,
        nickname: user.nickname,
        pointsBalance: user.pointsBalance,
      },
    };
  }

  private generateToken(user: User): string {
    const payload = { userId: user.id, username: user.username };
    return this.jwtService.sign(payload);
  }

  async validateUser(userId: string): Promise<User> {
    return await this.userRepository.findOne({ where: { id: userId } });
  }
}
