import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Interview } from './interview.entity';

@Entity('interview_answers')
export class InterviewAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  interviewId: string;

  @Column()
  questionId: string;

  @Column({ type: 'text' })
  answerText: string;

  @Column({ nullable: true })
  audioUrl: string;

  @Column({ nullable: true })
  duration: number;

  @Column({ type: 'text', nullable: true })
  analysis: string;

  @ManyToOne(() => Interview, (interview) => interview.answers)
  @JoinColumn({ name: 'interviewId' })
  interview: Interview;

  @CreateDateColumn()
  createdAt: Date;
}
