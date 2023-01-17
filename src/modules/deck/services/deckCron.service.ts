import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import DeckService from './deck.service';

@Injectable()
class DeckCronService {
  constructor(private deckService: DeckService) {}

  private readonly logger = new Logger(DeckCronService.name);

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron(): Promise<void> {
    this.logger.debug('Called every hour');
    await this.deckService.refreshAllGumbles();

    this.logger.debug('Gumbles reseted');
  }
}

export default DeckCronService;
