import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class SearchUserDTO {
  @ApiPropertyOptional({ description: 'Nome ou parte do nome do usuário', example: 'Maria' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Email exato do usuário', example: 'maria@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;
}
