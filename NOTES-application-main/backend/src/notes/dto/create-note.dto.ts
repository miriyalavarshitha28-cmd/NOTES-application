import { IsNotEmpty } from 'class-validator';

export class CreateNoteDto {
  @IsNotEmpty()
  userId!: string;

  @IsNotEmpty()
  text!: string;

  @IsNotEmpty()
  date!: string;

  pinned?: boolean;
}
