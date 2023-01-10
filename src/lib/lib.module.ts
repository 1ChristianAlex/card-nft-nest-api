import { Module } from '@nestjs/common';
import SaveFileService from './file/saveFile.service';
import PasswordHash from './passwordHash/passwordHash.service';

@Module({
  providers: [SaveFileService, PasswordHash],
  exports: [SaveFileService, PasswordHash],
})
class CommonLib {}

export default CommonLib;
