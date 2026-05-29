import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUserInfo(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      avatar: user.avatar,
      pointsBalance: user.pointsBalance,
      mockInterviewCount: user.mockInterviewCount,
      resumeOptimizationCount: user.resumeOptimizationCount,
    };
  }

  async getUserStats(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return {
      pointsBalance: user.pointsBalance,
      mockInterviewCount: user.mockInterviewCount,
      resumeOptimizationCount: user.resumeOptimizationCount,
    };
  }

  async updatePoints(userId: string, points: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    user.pointsBalance += points;
    await this.userRepository.save(user);

    return user.pointsBalance;
  }

  async incrementMockInterviewCount(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    user.mockInterviewCount += 1;
    await this.userRepository.save(user);
  }
}
