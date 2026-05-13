import { Body, Controller, HttpStatus, Param, Put, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { UpdateUserDTO } from '../dto/update-user.dto';
import { UpdateUserService } from '../services/update-user.service';

@ApiTags('users')
@Controller('users')
export class UpdateUserController {
  constructor(private readonly updateUserService: UpdateUserService) {}

  @Put('/:id')
  @ApiOperation({ summary: 'Atualizar um usuário' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Usuário atualizado com sucesso.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dados de entrada inválidos.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Usuário não encontrado.' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Email já cadastrado.' })
  @ApiBody({ type: UpdateUserDTO, description: 'Dados para atualização do usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário a ser atualizado', example: '123e4567-e89b-12d3-a456-426614174000' })
  async updateUser(@Param('id') id: string, @Body() data: UpdateUserDTO, @Res() res: Response) {
    const user = await this.updateUserService.execute(id, data);
    return res.status(HttpStatus.OK).json(user);
  }
}
