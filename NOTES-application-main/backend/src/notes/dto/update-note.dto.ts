import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateNoteDto {

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsBoolean()
  pinned?: boolean;

}