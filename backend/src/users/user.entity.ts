import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  username?: string;

  @Column({ nullable: true })
  plan?: string;

  @Column({ nullable: true })
  joined?: string;

  @Column({ nullable: true })
  favoriteColor?: string;

}
