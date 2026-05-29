import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class AgentService {
    private httpService;
    private configService;
    private agentApiUrl;
    constructor(httpService: HttpService, configService: ConfigService);
    generateFirstQuestion(params: any): Promise<any>;
    generateNextQuestion(params: any): Promise<any>;
    analyzeAnswer(params: any): Promise<any>;
    generateReport(params: any): Promise<any>;
}
