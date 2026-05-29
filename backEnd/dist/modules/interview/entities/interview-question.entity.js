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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewQuestion = void 0;
const typeorm_1 = require("typeorm");
const interview_entity_1 = require("./interview.entity");
let InterviewQuestion = class InterviewQuestion {
};
exports.InterviewQuestion = InterviewQuestion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], InterviewQuestion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], InterviewQuestion.prototype, "interviewId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], InterviewQuestion.prototype, "questionText", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], InterviewQuestion.prototype, "questionOrder", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], InterviewQuestion.prototype, "questionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], InterviewQuestion.prototype, "audioUrl", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => interview_entity_1.Interview, (interview) => interview.questions),
    (0, typeorm_1.JoinColumn)({ name: 'interviewId' }),
    __metadata("design:type", interview_entity_1.Interview)
], InterviewQuestion.prototype, "interview", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], InterviewQuestion.prototype, "createdAt", void 0);
exports.InterviewQuestion = InterviewQuestion = __decorate([
    (0, typeorm_1.Entity)('interview_questions')
], InterviewQuestion);
//# sourceMappingURL=interview-question.entity.js.map