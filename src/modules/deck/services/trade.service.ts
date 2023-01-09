import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CardEntity from 'src/modules/card/entities/card.entity';
import { CardValueTrade } from 'src/modules/card/services/card.model';
import DeckService from 'src/modules/deck/services/deck.service';
import { In, Repository } from 'typeorm';

@Injectable()
class TradeService {
  constructor(
    @InjectRepository(CardEntity)
    private cardRepository: Repository<CardEntity>,
    private deckService: DeckService,
  ) {}

  async tradeCards(cardOne: CardValueTrade, cardTradeTwo: CardValueTrade) {
    const [cardsDbOne, cardsDbTwo] = await Promise.all([
      this.getCardByIdWithUser(cardOne.cardListIds),
      this.getCardByIdWithUser(cardTradeTwo.cardListIds),
    ]);

    await Promise.all([
      this.updateCardListWithNewUser(cardsDbOne, cardTradeTwo.userId),
      this.updateCardListWithNewUser(cardsDbTwo, cardOne.userId),
    ]);

    await Promise.all([
      this.increaseWalletTrade(cardOne, cardTradeTwo),
      this.decreaseWalletTrade(cardOne, cardTradeTwo),
    ]);

    const allCardsId: number[] = [];

    cardsDbOne.forEach((item) => {
      allCardsId.push(item.id);
    });

    cardsDbTwo.forEach((item) => {
      allCardsId.push(item.id);
    });

    await this.cardRepository.increment({ id: In(allCardsId) }, 'wallet', 25);
  }

  private decreaseWalletTrade(
    cardOne: CardValueTrade,
    cardTradeTwo: CardValueTrade,
  ) {
    return Promise.all([
      this.deckService.changeDeckWallet(cardOne.userId, cardOne.value, false),
      this.deckService.changeDeckWallet(
        cardTradeTwo.userId,
        cardTradeTwo.value,
        false,
      ),
    ]);
  }

  private increaseWalletTrade(
    cardOne: CardValueTrade,
    cardTradeTwo: CardValueTrade,
  ) {
    return Promise.all([
      this.deckService.changeDeckWallet(
        cardOne.userId,
        cardTradeTwo.value,
        true,
      ),
      this.deckService.changeDeckWallet(
        cardTradeTwo.userId,
        cardOne.value,
        true,
      ),
    ]);
  }

  private async updateCardListWithNewUser(
    cardsDbOne: CardEntity[],
    newUserId: number,
  ) {
    await this.cardRepository.update(
      { id: In(cardsDbOne.map((item) => item.id)) },
      { user: { id: newUserId } },
    );
  }

  private async getCardByIdWithUser(
    cardListIds: number[],
  ): Promise<CardEntity[]> {
    if (!cardListIds.length) {
      return [];
    }
    return this.cardRepository.find({
      where: { id: In(cardListIds) },
    });
  }

  async giveCard(cardGived: CardValueTrade, userIdToGive: number) {
    await this.cardRepository.update(
      { id: In(cardGived.cardListIds) },
      { wallet: { user: { id: userIdToGive } } },
    );
  }
}

export default TradeService;
