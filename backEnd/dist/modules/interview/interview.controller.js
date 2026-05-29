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
exports.InterviewController = void 0;
const common_1 = require("@nestjs/common");
const interview_service_1 = require("./interview.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const create_interview_dto_1 = require("./dto/create-interview.dto");
const submit_answer_dto_1 = require("./dto/submit-answer.dto");
let InterviewController = class InterviewController {
    constructor(interviewService) {
        this.interviewService = interviewService;
    }
    async createInterview(req, createInterviewDto) {
        const userId = req.user.userId;
        const interview = await this.interviewService.createInterview(userId, createInterviewDto);
        return {
            code: 200,
            message: '面试会话创建成功',
            data: interview,
        };
    }
    async startInterview(id) {
        const result = await this.interviewService.startInterview(id);
        return {
            code: 200,
            message: '面试开始',
            data: result,
        };
    }
    async getNextQuestion(id) {
        const question = await this.interviewService.getNextQuestion(id);
        return {
            code: 200,
            message: '获取问题成功',
            data: question,
        };
    }
    async submitAnswer(id, submitAnswerDto) {
        const result = await this.interviewService.submitAnswer(id, submitAnswerDto);
        return {
            code: 200,
            message: '答案提交成功',
            data: result,
        };
    }
    async endInterview(id) {
        const report = await this.interviewService.endInterview(id);
        return {
            code: 200,
            message: '面试结束',
            data: report,
        };
    }
    async getReport(id) {
        const report = await this.interviewService.getReport(id);
        return {
            code: 200,
            message: '获取报告成功',
            data: report,
        };
    }
    async getRecentInterviews(req, limit = 10) {
        const userId = req.user.userId;
        const interviews = await this.interviewService.getRecentInterviews(userId, limit);
        return {
            code: 200,
            message: '获取成功',
            data: interviews,
        };
    }
    async getInterview(id) {
        const interview = await this.interviewService.getInterview(id);
        return {
            code: 200,
            message: '获取成功',
            data: interview,
        };
    }
};
exports.InterviewController = InterviewController;
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_interview_dto_1.CreateInterviewDto]),
    __metadata("design:returntype", Promise)
], InterviewController.prototype, "createInterview", null);
__decorate([
    (0, common_1.Post)(':id/start'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InterviewController.prototype, "startInterview", null);
__decorate([
    (0, common_1.Get)(':id/next-question'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InterviewController.prototype, "getNextQuestion", null);
__decorate([
    (0, common_1.Post)(':id/submit-answer'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, submit_answer_dto_1.SubmitAnswerDto]),
    __metadata("design:returntype", Promise)
], InterviewController.prototype, "submitAnswer", null);
__decorate([
    (0, common_1.Post)(':id/end'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InterviewController.prototype, "endInterview", null);
__decorate([
    (0, common_1.Get)(':id/report'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InterviewController.prototype, "getReport", null);
__decorate([
    (0, common_1.Get)('recent'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], InterviewController.prototype, "getRecentInterviews", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InterviewController.prototype, "getInterview", null);
exports.InterviewController = InterviewController = __decorate([
    (0, common_1.Controller)('interview'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [interview_service_1.InterviewService])
], InterviewController);
//# sourceMappingURL=interview.controller.js.map