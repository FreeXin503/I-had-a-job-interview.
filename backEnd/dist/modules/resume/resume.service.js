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
exports.ResumeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const resume_entity_1 = require("./entities/resume.entity");
const fs = require("fs");
const path = require("path");
let ResumeService = class ResumeService {
    constructor(resumeRepository) {
        this.resumeRepository = resumeRepository;
    }
    async uploadResume(userId, file) {
        const uploadDir = path.join(process.cwd(), 'uploads', 'resumes');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        const fileName = `${Date.now()}_${file.originalname}`;
        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, file.buffer);
        const resume = this.resumeRepository.create({
            userId,
            fileName: file.originalname,
            filePath: fileName,
            fileSize: file.size,
            mimeType: file.mimetype,
        });
        await this.resumeRepository.save(resume);
        return {
            fileId: resume.id,
            fileName: resume.fileName,
        };
    }
    async getResumeList(userId) {
        const resumes = await this.resumeRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
        return resumes.map((resume) => ({
            id: resume.id,
            fileName: resume.fileName,
            fileSize: resume.fileSize,
            createdAt: resume.createdAt,
        }));
    }
};
exports.ResumeService = ResumeService;
exports.ResumeService = ResumeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(resume_entity_1.Resume)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ResumeService);
//# sourceMappingURL=resume.service.js.map