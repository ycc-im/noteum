import { IsString, IsOptional, MinLength } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  content: string;

  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  tags?: string;
}

export class UpdateNoteDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  tags?: string;
}

export class GetNoteDto {
  @IsString()
  id: string;
}

export class GetUserNotesDto {
  @IsString()
  userId: string;
}

export class NoteResponseDto {
  id: string;
  title: string;
  content: string;
  userId: string;
  tags?: string;
  createdAt: Date;
  updatedAt: Date;
}
