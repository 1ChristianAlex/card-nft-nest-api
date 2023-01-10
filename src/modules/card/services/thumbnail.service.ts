import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CardEntity from '../entities/card.entity';
import ThumbsEntity from '../entities/thumbs.entity';

@Injectable()
class ThumbnailService {
  constructor(
    @InjectRepository(CardEntity)
    private cardRepository: Repository<CardEntity>,
    @InjectRepository(ThumbsEntity)
    private thumbRepository: Repository<ThumbsEntity>,
  ) {}

  async registerImage(imagePath: string, cardId: number, description: string) {
    await this.thumbRepository.insert(
      new ThumbsEntity({ card: { id: cardId }, description, path: imagePath }),
    );
  }
}

export default ThumbnailService;
