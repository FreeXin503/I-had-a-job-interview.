import { IsString, IsOptional, IsNumber } from 'class-validator';

export class SubmitAnswerDto {
  @IsString()
  questionId: string;

  @IsString()
  answerText: string;

  @IsOptional()
  @IsString()
  audioUrl?: string;

  @IsOptional()
  @IsNumber()
  duration?: number;
}
