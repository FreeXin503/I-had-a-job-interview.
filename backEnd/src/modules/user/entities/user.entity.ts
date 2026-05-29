import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  openid: string;

  @Column({ default: '用户' })
  nickname: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: 20 })
  pointsBalance: number;

  @Column({ default: 0 })
  mockInterviewCount: number;

  @Column({ default: 0 })
  resumeOptimizationCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
