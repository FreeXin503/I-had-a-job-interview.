import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [AgentController],
  providers: [AgentService],
  exports: [AgentService],
})
export class AgentModule {}
