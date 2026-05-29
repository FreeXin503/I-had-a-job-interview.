"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const interview_entity_1 = require("./entities/interview.entity");
const interview_question_entity_1 = require("./entities/interview-question.entity");
const interview_answer_entity_1 = require("./entities/interview-answer.entity");
const agent_service_1 = require("../agent/agent.service");
let InterviewService = class InterviewService {
    constructor(interviewRepository, questionRepository, answerRepository, agentService) {
        this.interviewRepository = interviewRepository;
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
        this.agentService = agentService;
    }
    async createInterview(userId, dto) {
        const interview = this.interviewRepository.create({
            userId,
            experience: dto.experience,
            style: dto.style,
            jobTitle: dto.jobTitle,
            resumeMode: dto.resumeMode,
            resumeFileId: dto.resumeFileId,
            status: 'pending',
        });
        return await this.interviewRepository.save(interview);
    }
    async startInterview(interviewId) {
        const interview = await this.interviewRepository.findOne({
            where: { id: interviewId },
        });
        if (!interview) {
            throw new common_1.NotFoundException('面试会话不存在');
        }
        interview.status = 'in_progress';
        interview.startTime = new Date();
        await this.interviewRepository.save(interview);
        const firstQuestion = await this.agentService.generateFirstQuestion({
            experience: interview.experience,
            style: interview.style,
            jobTitle: interview.jobTitle,
            resumeFileId: interview.resumeFileId,
        });
        const question = this.questionRepository.create({
            interviewId: interview.id,
            questionText: firstQuestion.text,
            questionOrder: 1,
            questionType: 'opening',
        });
        await this.questionRepository.save(question);
        return {
            interviewId: interview.id,
            question: firstQuestion,
        };
    }
    async getNextQuestion(interviewId) {
        const interview = await this.interviewRepository.findOne({
            where: { id: interviewId },
            relations: ['questions', 'answers'],
        });
        if (!interview) {
            throw new common_1.NotFoundException('面试会话不存在');
        }
        const currentQuestionCount = interview.questions.length;
        const nextQuestion = await this.agentService.generateNextQuestion({
            interviewId: interview.id,
            previousQuestions: interview.questions,
            previousAnswers: interview.answers,
            experience: interview.experience,
            style: interview.style,
            jobTitle: interview.jobTitle,
        });
        const question = this.questionRepository.create({
            interviewId: interview.id,
            questionText: nextQuestion.text,
            questionOrder: currentQuestionCount + 1,
            questionType: nextQuestion.type || 'follow_up',
        });
        await this.questionRepository.save(question);
        return nextQuestion;
    }
    async submitAnswer(interviewId, dto) {
        const interview = await this.interviewRepository.findOne({
            where: { id: interviewId },
        });
        if (!interview) {
            throw new common_1.NotFoundException('面试会话不存在');
        }
        const answer = this.answerRepository.create({
            interviewId: interview.id,
            questionId: dto.questionId,
            answerText: dto.answerText,
            audioUrl: dto.audioUrl,
            duration: dto.duration,
        });
        await this.answerRepository.save(answer);
        const analysis = await this.agentService.analyzeAnswer({
            questionId: dto.questionId,
            answerText: dto.answerText,
            jobTitle: interview.jobTitle,
        });
        return {
            answerId: answer.id,
            analysis,
        };
    }
    async endInterview(interviewId) {
        const interview = await this.interviewRepository.findOne({
            where: { id: interviewId },
            relations: ['questions', 'answers'],
        });
        if (!interview) {
            throw new common_1.NotFoundException('面试会话不存在');
        }
        interview.status = 'completed';
        interview.endTime = new Date();
        const duration = Math.floor((interview.endTime.getTime() - interview.startTime.getTime()) / 1000);
        interview.duration = duration;
        const report = await this.agentService.generateReport({
            interviewId: interview.id,
            questions: interview.questions,
            answers: interview.answers,
            jobTitle: interview.jobTitle,
            experience: interview.experience,
            style: interview.style,
        });
        interview.score = report.score;
        interview.rating = report.rating;
        interview.reportData = JSON.stringify(report);
        await this.interviewRepository.save(interview);
        return report;
    }
    async getReport(interviewId) {
        const interview = await this.interviewRepository.findOne({
            where: { id: interviewId },
            relations: ['questions', 'answers'],
        });
        if (!interview) {
            throw new common_1.NotFoundException('面试会话不存在');
        }
        if (!interview.reportData) {
            throw new common_1.NotFoundException('面试报告不存在');
        }
        return JSON.parse(interview.reportData);
    }
    async getRecentInterviews(userId, limit = 10) {
        const interviews = await this.interviewRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
            take: limit,
        });
        return interviews.map((interview) => ({
            id: interview.id,
            jobTitle: interview.jobTitle,
            experience: interview.experience,
            style: interview.style,
            score: interview.score,
            rating: interview.rating,
            duration: interview.duration,
            status: interview.status,
            date: interview.createdAt,
        }));
    }
    async getInterview(interviewId) {
        const interview = await this.interviewRepository.findOne({
            where: { id: interviewId },
            relations: ['questions', 'answers'],
        });
        if (!interview) {
            throw new common_1.NotFoundException('面试会话不存在');
        }
        return interview;
    }
};
exports.InterviewService = InterviewService;
exports.InterviewService = InterviewService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(interview_entity_1.Interview)),
    __param(1, (0, typeorm_1.InjectRepository)(interview_question_entity_1.InterviewQuestion)),
    __param(2, (0, typeorm_1.InjectRepository)(interview_answer_entity_1.InterviewAnswer)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        agent_service_1.AgentService])
], InterviewService);
//# sourceMappingURL=interview.service.js.map