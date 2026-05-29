import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { InterviewModule } from './modules/interview/interview.module';
import { ResumeModule } from './modules/resume/resume.module';
import { AgentModule } from './modules/agent/agent.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'ai_interview',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // 生产环境应设为false
      logging: true,
    }),
    AuthModule,
    UserModule,
    InterviewModule,
    ResumeModule,
    AgentModule,
  ],
})
export class AppModule {}
