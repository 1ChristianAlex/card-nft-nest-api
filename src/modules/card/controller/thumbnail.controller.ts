import {
  Body,
  Controller,
  FileTypeValidator,
  HttpException,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import AwsS3Service from 'src/lib/aws-s3/aws-s3.service';
import ThumbnailService from '../services/thumbnail.service';
import { ThumbnailInputDto, ThumbnailPositionInputDto } from './thumbnail.dto';

@Controller('card/thumbnail')
class ThumbnailController {
  constructor(
    private awsS3Service: AwsS3Service,
    private thumbService: ThumbnailService,
  ) {}
  @Post('upload')
  @UseInterceptors(FileInterceptor('thumbnail'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: Math.pow(1024, 2) }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() body: ThumbnailInputDto,
  ): Promise<void> {
    try {
      const filePath = await this.awsS3Service.uploadImageToBucket(
        file.buffer,
        file.mimetype,
      );

      await this.thumbService.registerImage(
        filePath,
        parseInt(body.cardId),
        body.description,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put('position')
  async changeThumbsPostion(
    @Body() body: ThumbnailPositionInputDto,
  ): Promise<void> {
    try {
      await this.thumbService.changePosition(body.thumbId, body.position);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

export default ThumbnailController;
