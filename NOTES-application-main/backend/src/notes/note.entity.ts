import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  date!: string;

  @Column({ default: false })
  pinned!: boolean;
}