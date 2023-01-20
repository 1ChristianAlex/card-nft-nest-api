import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import DeckService from './deck.service';

@Injectable()
class DeckCronService {
  constructor(private deckService: DeckService) {}

  private readonly logger = new Logger(DeckCronService.name);

  @Cron(CronExpression.EVERY_HOUR)
  async handleCronGamble(): Promise<void> {
    this.logger.debug('Called every hour');
    await this.deckService.refreshAllGambles();

    this.logger.debug('Gambles reseted');
  }

  @Cron(CronExpression.EVERY_3_HOURS)
  async handleCronClaim(): Promise<void> {
    this.logger.debug('Called every 3 hours');
    await this.deckService.resetClaim();

    this.logger.debug('Claim reset reseted');
  }
}

export default DeckCronService;
