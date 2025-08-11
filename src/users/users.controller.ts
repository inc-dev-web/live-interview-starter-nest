import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    throw new InternalServerErrorException('Not implemented');
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<UserDto> {
    throw new InternalServerErrorException('Not implemented');
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    throw new InternalServerErrorException('Not implemented');
  }

  @Post(':userId/friends/:friendId')
  @HttpCode(HttpStatus.CREATED)
  async addFriend(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Param('friendId', new ParseUUIDPipe()) friendId: string,
  ): Promise<void> {
    throw new InternalServerErrorException('Not implemented');
  }

  @Delete(':userId/friends/:friendId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeFriend(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Param('friendId', new ParseUUIDPipe()) friendId: string,
  ): Promise<void> {
    throw new InternalServerErrorException('Not implemented');
  }
}