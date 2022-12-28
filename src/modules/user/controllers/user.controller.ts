import {
  Controller,
  Get,
  Param,
  HttpStatus,
  HttpException,
  ParseIntPipe,
  Body,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/services/jwt-auth.guard';
import UserDecorator from '../services/user.decorator';
import UserService from '../services/user.service';
import { UserInputDto, UserOutputDto } from './user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
class UserController {
  constructor(private _userService: UserService) {}

  @Get('/')
  async findAll(
    @UserDecorator() currentUser: UserInputDto,
  ): Promise<UserOutputDto[]> {
    console.log(currentUser);

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
  async createUser(
    @Body() userInput: UserInputDto,
    @UserDecorator() userToken: UserOutputDto,
  ): Promise<UserOutputDto> {
    if (
      (userToken.role.id !== 1 && userInput.role === 1) ||
      (![1, 2].includes(userToken.role.id) && userInput.role === 2)
    ) {
      throw new Error('User has no correct privileges');
    }

    const user = UserInputDto.adapterDtoToUser(userInput);

    return UserOutputDto.adapterUserToDto(
      await this._userService.createNewUser(user),
    );
  }
}

export default UserController;
