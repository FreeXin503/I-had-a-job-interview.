import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('info')
  async getUserInfo(@Request() req) {
    const userId = req.user.userId;
    const user = await this.userService.getUserInfo(userId);
    return {
      code: 200,
      message: '获取成功',
      data: user,
    };
  }

  @Get('stats')
  async getUserStats(@Request() req) {
    const userId = req.user.userId;
    const stats = await this.userService.getUserStats(userId);
    return {
      code: 200,
      message: '获取成功',
      data: stats,
    };
  }
}
