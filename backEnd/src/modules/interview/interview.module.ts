import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterviewController } from './interview.controller';
import { InterviewService } from './interview.service';
import { TtsService } from './tts.service';
import { Interview } from './entities/interview.entity';
import { InterviewQuestion } from './entities/interview-question.entity';
import { InterviewAnswer } from './entities/interview-answer.entity';
import { AgentModule } from '../agent/agent.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Interview, InterviewQuestion, InterviewAnswer]),
    AgentModule,
  ],
  controllers: [InterviewController],
  providers: [InterviewService, TtsService],
  exports: [InterviewService],
})
export class InterviewModule {}
