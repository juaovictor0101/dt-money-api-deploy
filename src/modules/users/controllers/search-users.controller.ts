import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { SearchUserDTO } from '../dto/search-user.dto';
import { SearchUsersService } from '../services/search-users.service';

@ApiTags('users')
@Controller('users')
export class SearchUsersController {
  constructor(private readonly searchUsersService: SearchUsersService) {}

  @Get('/search')
  @ApiOperation({ summary: 'Buscar usuários por nome ou email' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Usuários encontrados com sucesso.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Informe nome ou email para buscar.' })
  @ApiQuery({ name: 'name', required: false, description: 'Nome ou parte do nome do usuário', example: 'Maria' })
  @ApiQuery({ name: 'email', required: false, description: 'Email exato do usuário', example: 'maria@example.com' })
  async searchUsers(@Query() filters: SearchUserDTO, @Res() res: Response) {
    const users = await this.searchUsersService.execute(filters);
    return res.status(HttpStatus.OK).json(users);
  }
}
