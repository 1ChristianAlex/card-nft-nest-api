import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import SaveFileService from 'src/lib/file/saveFile.service';
import ThumbnailService from '../services/thumbnail.service';
import { ThumbnailInputDto } from './thumbnail.dto';

@Controller('card/thumbnail')
class ThumbnailController {
  constructor(
    private saveFileService: SaveFileService,
    private thumbService: ThumbnailService,
  ) {}
  @Post('upload')
  @UseInterceptors(FileInterceptor('thumbnail'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: Math.pow(1024, 2) * 2 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() body: ThumbnailInputDto,
  ) {
    const filePath = await this.saveFileService.saveFile(
      file.buffer,
      file.mimetype,
    );

    this.thumbService.registerImage(
      filePath,
      parseInt(body.cardId),
      body.description,
    );
  }
}

export default ThumbnailController;
