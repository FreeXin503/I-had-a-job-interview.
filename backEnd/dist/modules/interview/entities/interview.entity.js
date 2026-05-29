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
exports.Interview = void 0;
const typeorm_1 = require("typeorm");
const interview_question_entity_1 = require("./interview-question.entity");
const interview_answer_entity_1 = require("./interview-answer.entity");
let Interview = class Interview {
};
exports.Interview = Interview;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Interview.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Interview.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Interview.prototype, "experience", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Interview.prototype, "style", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Interview.prototype, "jobTitle", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Interview.prototype, "resumeMode", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Interview.prototype, "resumeFileId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'pending' }),
    __metadata("design:type", String)
], Interview.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Interview.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Interview.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Interview.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Interview.prototype, "score", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Interview.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Interview.prototype, "reportData", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => interview_question_entity_1.InterviewQuestion, (question) => question.interview),
    __metadata("design:type", Array)
], Interview.prototype, "questions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => interview_answer_entity_1.InterviewAnswer, (answer) => answer.interview),
    __metadata("design:type", Array)
], Interview.prototype, "answers", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Interview.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Interview.prototype, "updatedAt", void 0);
exports.Interview = Interview = __decorate([
    (0, typeorm_1.Entity)('interviews')
], Interview);
//# sourceMappingURL=interview.entity.js.map