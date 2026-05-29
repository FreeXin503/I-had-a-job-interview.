import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class AgentService {
  private agentApiUrl: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.agentApiUrl =
      this.configService.get<string>('AGENT_API_URL') ||
      'http://localhost:8000';
  }

  async generateFirstQuestion(params: any): Promise<any> {
    const response: AxiosResponse = await firstValueFrom(
      this.httpService.post(
        `${this.agentApiUrl}/api/agent/generate-first-question`,
        params,
      ),
    );
    return response.data;
  }

  async generateNextQuestion(params: any): Promise<any> {
    const response: AxiosResponse = await firstValueFrom(
      this.httpService.post(
        `${this.agentApiUrl}/api/agent/generate-next-question`,
        params,
      ),
    );
    return response.data;
  }

  async analyzeAnswer(params: any): Promise<any> {
    const response: AxiosResponse = await firstValueFrom(
      this.httpService.post(
        `${this.agentApiUrl}/api/agent/analyze-answer`,
        params,
      ),
    );
    return response.data;
  }

  async generateReport(params: any): Promise<any> {
    const response: AxiosResponse = await firstValueFrom(
      this.httpService.post(
        `${this.agentApiUrl}/api/agent/generate-report`,
        params,
      ),
    );
    return response.data;
  }
}
