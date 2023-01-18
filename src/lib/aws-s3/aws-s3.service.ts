import { Injectable, Logger } from '@nestjs/common';
import {
  CreateBucketCommand,
  S3Client,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

@Injectable()
class AwsS3Service {
  private readonly REGION = 'sa-east-1';

  private readonly s3Client = new S3Client({ region: this.REGION });

  private readonly BUCKET_NAME = 'card-nft-bucket';

  async createBucket(): Promise<void> {
    try {
      await this.s3Client.send(
        new CreateBucketCommand({ Bucket: this.BUCKET_NAME }),
      );
    } catch (error) {
      const logger = new Logger(AwsS3Service.name);
      logger.debug(error.message);
    }
  }

  async uploadImageToBucket(data: Buffer, mimetype: string): Promise<string> {
    const ext = mimetype.split('/').at(-1);
    const fileName = `${randomUUID()}.${ext}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.BUCKET_NAME,
        Key: fileName,
        Body: data,
        ContentType: `image/${ext}`,
      }),
    );

    const imageSrc = this.getImageFromAws(fileName);

    return imageSrc;
  }

  getImageFromAws(fileName: string): string {
    return `https://${this.BUCKET_NAME}.s3.${this.REGION}.amazonaws.com/${fileName}`;
  }
}

export default AwsS3Service;
