import { Injectable } from '@nestjs/common';
import { hash, genSalt, compare } from 'bcrypt';

@Injectable()
class PasswordHash {
  async genHash(password: string): Promise<string> {
    const salt = await genSalt();

    const hashed = await hash(password, salt);

    return hashed;
  }

  async compareHash(hash: string, password: string): Promise<boolean> {
    return compare(password, hash);
  }
}

export default PasswordHash;
