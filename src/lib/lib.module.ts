import { Module } from '@nestjs/common';
import AwsS3Service from './aws-s3/aws-s3.service';
import SaveFileService from './file/saveFile.service';
import PasswordHash from './passwordHash/passwordHash.service';

@Module({
  providers: [SaveFileService, PasswordHash, AwsS3Service],
  exports: [SaveFileService, PasswordHash, AwsS3Service],
})
class CommonLib {}

export default CommonLib;
