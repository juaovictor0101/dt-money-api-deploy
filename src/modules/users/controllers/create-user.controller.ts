import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { CreateUserDTO } from '../dto/create-user.dto';
import { CreateUserService } from '../services/create-user.service';

@ApiTags('users')
@Controller('users')
export class CreateUserController {
  constructor(private readonly createUserService: CreateUserService) {}

  @Post('')
  @ApiOperation({ summary: 'Criar um novo usuário' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Usuário criado com sucesso.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dados de entrada inválidos.' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Email já cadastrado.' })
  @ApiBody({ type: CreateUserDTO, description: 'Dados para criação do usuário' })
  async createUser(@Body() data: CreateUserDTO, @Res() res: Response) {
    const user = await this.createUserService.execute(data);
    return res.status(HttpStatus.CREATED).json(user);
  }
}
