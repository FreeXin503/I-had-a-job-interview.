import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interview } from './entities/interview.entity';
import { InterviewQuestion } from './entities/interview-question.entity';
import { InterviewAnswer } from './entities/interview-answer.entity';
import { AgentService } from '../agent/agent.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';

@Injectable()
export class InterviewService {
  constructor(
    @InjectRepository(Interview)
    private interviewRepository: Repository<Interview>,
    @InjectRepository(InterviewQuestion)
    private questionRepository: Repository<InterviewQuestion>,
    @InjectRepository(InterviewAnswer)
    private answerRepository: Repository<InterviewAnswer>,
    private agentService: AgentService,
  ) {}

  /**
   * 创建面试会话
   */
  async createInterview(userId: string, dto: CreateInterviewDto) {
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

  /**
   * 开始面试
   */
  async startInterview(interviewId: string) {
    const interview = await this.interviewRepository.findOne({
      where: { id: interviewId },
    });

    if (!interview) {
      throw new NotFoundException('面试会话不存在');
    }

    // 更新状态
    interview.status = 'in_progress';
    interview.startTime = new Date();
    await this.interviewRepository.save(interview);

    // 生成第一个问题
    const firstQuestion = await this.agentService.generateFirstQuestion({
      experience: interview.experience,
      style: interview.style,
      jobTitle: interview.jobTitle,
      resumeFileId: interview.resumeFileId,
    });

    // 保存问题
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

  /**
   * 获取下一个问题
   */
  async getNextQuestion(interviewId: string) {
    const interview = await this.interviewRepository.findOne({
      where: { id: interviewId },
      relations: ['questions', 'answers'],
    });

    if (!interview) {
      throw new NotFoundException('面试会话不存在');
    }

    // 获取当前问题数量
    const currentQuestionCount = interview.questions.length;

    // 生成下一个问题
    const nextQuestion = await this.agentService.generateNextQuestion({
      interviewId: interview.id,
      previousQuestions: interview.questions,
      previousAnswers: interview.answers,
      experience: interview.experience,
      style: interview.style,
      jobTitle: interview.jobTitle,
    });

    // 保存问题
    const question = this.questionRepository.create({
      interviewId: interview.id,
      questionText: nextQuestion.text,
      questionOrder: currentQuestionCount + 1,
      questionType: nextQuestion.type || 'follow_up',
    });
    await this.questionRepository.save(question);

    return nextQuestion;
  }

  /**
   * 提交答案
   */
  async submitAnswer(interviewId: string, dto: SubmitAnswerDto) {
    const interview = await this.interviewRepository.findOne({
      where: { id: interviewId },
    });

    if (!interview) {
      throw new NotFoundException('面试会话不存在');
    }

    // 保存答案
    const answer = this.answerRepository.create({
      interviewId: interview.id,
      questionId: dto.questionId,
      answerText: dto.answerText,
      audioUrl: dto.audioUrl,
      duration: dto.duration,
    });
    await this.answerRepository.save(answer);

    // 分析答案
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

  /**
   * 结束面试
   */
  async endInterview(interviewId: string) {
    const interview = await this.interviewRepository.findOne({
      where: { id: interviewId },
      relations: ['questions', 'answers'],
    });

    if (!interview) {
      throw new NotFoundException('面试会话不存在');
    }

    // 更新状态
    interview.status = 'completed';
    interview.endTime = new Date();

    // 计算面试时长
    const duration = Math.floor(
      (interview.endTime.getTime() - interview.startTime.getTime()) / 1000,
    );
    interview.duration = duration;

    // 生成面试报告
    const report = await this.agentService.generateReport({
      interviewId: interview.id,
      questions: interview.questions,
      answers: interview.answers,
      jobTitle: interview.jobTitle,
      experience: interview.experience,
      style: interview.style,
    });

    // 保存评分
    interview.score = report.score;
    interview.rating = report.rating;
    interview.reportData = JSON.stringify(report);

    await this.interviewRepository.save(interview);

    return report;
  }

  /**
   * 获取面试报告
   */
  async getReport(interviewId: string) {
    const interview = await this.interviewRepository.findOne({
      where: { id: interviewId },
      relations: ['questions', 'answers'],
    });

    if (!interview) {
      throw new NotFoundException('面试会话不存在');
    }

    if (!interview.reportData) {
      throw new NotFoundException('面试报告不存在');
    }

    return JSON.parse(interview.reportData);
  }

  /**
   * 获取最近面试记录
   */
  async getRecentInterviews(userId: string, limit: number = 10) {
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

  /**
   * 获取面试详情
   */
  async getInterview(interviewId: string) {
    const interview = await this.interviewRepository.findOne({
      where: { id: interviewId },
      relations: ['questions', 'answers'],
    });

    if (!interview) {
      throw new NotFoundException('面试会话不存在');
    }

    return interview;
  }
}
