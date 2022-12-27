import { User } from '../services/user.model';
import { IsEmail, IsNotEmpty, IsNumber, MinLength } from 'class-validator';

class UserOutputDto {
  constructor(user: UserOutputDto) {
    Object.assign(this, user);
  }

  public id: number;
  public name: string;
  public lastName: string;
  public email: string;
  public role: number;

  static adapterUserToDto(user: User) {
    return new UserOutputDto({
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    });
  }
}

class UserInputDto {
  constructor(user: UserInputDto) {
    Object.assign(this, user);
  }

  @IsNotEmpty()
  public name: string;

  @IsNotEmpty()
  public lastName: string;

  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsNotEmpty()
  @IsNumber()
  public role: number;

  @IsNotEmpty()
  @MinLength(6)
  public password: string;

  static adapterDtoToUser(user: UserInputDto): User {
    return new User({
      id: null,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      password: user.password,
    });
  }
}

export { UserOutputDto, UserInputDto };
