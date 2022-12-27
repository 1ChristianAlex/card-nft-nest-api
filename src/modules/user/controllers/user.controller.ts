import {
  Controller,
  Get,
  Param,
  HttpStatus,
  HttpException,
  ParseIntPipe,
  Body,
  Post,
} from '@nestjs/common';
import UserService from '../services/user.service';
import { UserInputDto, UserOutputDto } from './user.dto';

@Controller('users')
class UserController {
  constructor(private _userService: UserService) {}

  @Get('/')
  async findAll(): Promise<UserOutputDto[]> {
    const userList = await this._userService.getAllUser();

    return userList.map(UserOutputDto.adapterUserToDto);
  }

  @Get('/:id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserOutputDto> {
    try {
      const user = await this._userService.getUserById(id);

      return UserOutputDto.adapterUserToDto(user);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Post()
  async createUser(@Body() userInput: UserInputDto): Promise<UserOutputDto> {
    console.log(userInput);

    const user = UserInputDto.adapterDtoToUser(userInput);

    return UserOutputDto.adapterUserToDto(
      await this._userService.createNewUser(user),
    );
  }
}

export default UserController;
