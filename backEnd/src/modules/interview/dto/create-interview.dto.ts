import { IsString, IsOptional } from 'class-validator';

export class CreateInterviewDto {
  @IsString()
  experience: string;

  @IsString()
  style: string;

  @IsOptional()
  @IsString()
  voiceGender?: string;

  @IsString()
  jobTitle: string;

  @IsString()
  resumeMode: string;

  @IsOptional()
  @IsString()
  resumeFileId?: string;
}
