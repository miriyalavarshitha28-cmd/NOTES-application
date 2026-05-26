import { IsNotEmpty } from 'class-validator';
export class CreateNoteDto {
  @IsNotEmpty()
  userId!: string;

  @IsNotEmpty()
  title!: string;

  @IsNotEmpty()
  body!: string;

  @IsNotEmpty()
  date!: string;

  pinned?: boolean;
}