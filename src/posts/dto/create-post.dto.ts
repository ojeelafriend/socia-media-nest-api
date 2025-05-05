import { IsString, IsUUID, IsBoolean } from 'class-validator';

export class CreatePostDto {
  @IsUUID()
  authorId: string;

  @IsString()
  content: string;

  @IsBoolean()
  writtenByAI?: boolean;
}
