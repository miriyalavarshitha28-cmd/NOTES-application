import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('notes')
export class Note {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column()
  title!: string;

  @Column('text')
  body!: string;

  @UpdateDateColumn()
  date!: Date;

  @Column({ default: false })
  pinned!: boolean;
}