import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({ description: 'Nome do usuário', example: 'Maria Silva' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Email do usuário', example: 'maria@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Senha do usuário', example: 'strongPassword123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;
}
