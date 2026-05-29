import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Interview } from './interview.entity';

@Entity('interview_questions')
export class InterviewQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  interviewId: string;

  @Column({ type: 'text' })
  questionText: string;

  @Column()
  questionOrder: number;

  @Column()
  questionType: string;

  @Column({ nullable: true })
  audioUrl: string;

  @ManyToOne(() => Interview, (interview) => interview.questions)
  @JoinColumn({ name: 'interviewId' })
  interview: Interview;

  @CreateDateColumn()
  createdAt: Date;
}
