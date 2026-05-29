import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AgentService } from './agent.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [AgentService],
  exports: [AgentService],
})
export class AgentModule {}
