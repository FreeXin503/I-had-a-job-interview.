import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USERNAME', 'root'),
        password: configService.get<string>('DB_PASSWORD', '123456'),
        database: configService.get<string>('DB_DATABASE', 'ai_interview'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // 生产环境应设为false
        logging: true,
      }),
    }),
    AuthModule,
    UserModule,
    InterviewModule,
    ResumeModule,
    AgentModule,
  ],
})
export class AppModule {}
