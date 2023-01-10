import { Injectable } from '@nestjs/common';
import { writeFile } from 'fs/promises';
import { resolve, join } from 'path';
import { randomUUID } from 'crypto';

@Injectable()
class SaveFileService {
  async saveFile(buffer: Buffer, mimetype: string) {
    const imageName = `${randomUUID()}.${mimetype.split('/').at(-1)}`;
    const dirPath = resolve(join(process.cwd(), 'src', 'media', imageName));

    await writeFile(dirPath, buffer);

    return dirPath;
  }
}

export default SaveFileService;
