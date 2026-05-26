import { IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateNoteDto {

  @IsNotEmpty()
  userId!: string;

  @IsNotEmpty()
  title!: string;

  @IsNotEmpty()
  body!: string;

  @IsOptional()
  @IsBoolean()
  pinned?: boolean;

}