import { RolesModel, UserModel } from '../services/user.model';
import { IsEmail, IsNotEmpty, IsNumber, MinLength } from 'class-validator';

class UserOutputDto {
  constructor(user: UserOutputDto) {
    Object.assign(this, user);
  }

  public id: number;
  public name: string;
  public lastName: string;
  public email: string;
  public isActive: boolean;

  public role: RolesModel;

  static fromModel(user: UserModel): UserOutputDto {
    return new UserOutputDto({
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
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

  @IsNumber()
  public role = 3;

  @IsNotEmpty()
  @MinLength(6)
  public password: string;

  static toModel(user: UserInputDto): UserModel {
    return new UserModel({
      id: null,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      role: new RolesModel({ id: user.role }),
      password: user.password,
      isActive: true,
    });
  }
}

export { UserOutputDto, UserInputDto };
