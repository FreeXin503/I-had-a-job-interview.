import { IsString, IsOptional } from 'class-validator';

export class CreateInterviewDto {
  @IsString()
  experience: string;

  @IsString()
  style: string;

  @IsString()
  jobTitle: string;

  @IsString()
  resumeMode: string;

  @IsOptional()
  @IsString()
  resumeFileId?: string;
}
