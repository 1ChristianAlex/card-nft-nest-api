import { IsNotEmpty, IsEmail } from 'class-validator';
import { UserOutputDto } from 'src/modules/user/controllers/user.dto';

class LoginInputDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

class LoginOutputDto {
  constructor(public user: UserOutputDto, public token: string) {}
}

export { LoginInputDto, LoginOutputDto };
