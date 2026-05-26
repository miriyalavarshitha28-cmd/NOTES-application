import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('settings')
export class Settings {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  userId!: string;

  @Column({ default: 'English' })
  language!: string;

  @Column({ default: true })
  notifications!: boolean;

  @Column({ default: 'dark' })
  theme!: string;

  @Column({ default: 'On' })
  autosave!: string;

  @Column({ default: 'Standard' })
  privacy!: string;

  @Column({ default: true })
  reminderEmails!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

}
