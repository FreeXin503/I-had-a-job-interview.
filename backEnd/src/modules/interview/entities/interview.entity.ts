import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { InterviewQuestion } from './interview-question.entity';
import { InterviewAnswer } from './interview-answer.entity';

@Entity('interviews')
export class Interview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  experience: string;

  @Column()
  style: string;

  @Column()
  jobTitle: string;

  @Column()
  resumeMode: string;

  @Column({ nullable: true })
  resumeFileId: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ type: 'datetime', nullable: true })
  startTime: Date;

  @Column({ type: 'datetime', nullable: true })
  endTime: Date;

  @Column({ nullable: true })
  duration: number;

  @Column({ nullable: true })
  score: number;

  @Column({ nullable: true })
  rating: string;

  @Column({ type: 'text', nullable: true })
  reportData: string;

  @OneToMany(() => InterviewQuestion, (question) => question.interview)
  questions: InterviewQuestion[];

  @OneToMany(() => InterviewAnswer, (answer) => answer.interview)
  answers: InterviewAnswer[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
