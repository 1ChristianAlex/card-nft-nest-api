import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CardEntity from 'src/modules/card/entities/card.entity';
import { CardValueTrade } from 'src/modules/card/services/card.model';
import DeckService from 'src/modules/deck/services/deck.service';
import { In, Repository } from 'typeorm';
import { IncreaseWalletParams } from './deck.model';

@Injectable()
class TradeService {
  constructor(
    @InjectRepository(CardEntity)
    private cardRepository: Repository<CardEntity>,
    private deckService: DeckService,
  ) {}

  async giveCard(cardGived: CardValueTrade, userIdToGive: number) {
    await this.cardRepository.update(
      { id: In(cardGived.cardListIds) },
      { deck: { user: { id: userIdToGive } } },
    );
  }

  async tradeCards(cardOne: CardValueTrade, cardTradeTwo: CardValueTrade) {
    const [cardsDbOne, cardsDbTwo] = await Promise.all([
      this.getCardByIdWithUser(cardOne.cardListIds),
      this.getCardByIdWithUser(cardTradeTwo.cardListIds),
    ]);

    await Promise.all([
      this.updateCardListWithNewUser(cardsDbOne, cardTradeTwo.deckId),
      this.updateCardListWithNewUser(cardsDbTwo, cardOne.deckId),
    ]);

    const walletOne = new IncreaseWalletParams(cardOne.deckId, cardOne.value);
    const walletTwo = new IncreaseWalletParams(
      cardTradeTwo.deckId,
      cardTradeTwo.value,
    );

    await Promise.all([
      this.increaseWalletTrade(walletOne, walletTwo),
      this.decreaseWalletTrade(walletOne, walletTwo),
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
    cardOne: IncreaseWalletParams,
    cardTradeTwo: IncreaseWalletParams,
  ) {
    return Promise.all([
      this.deckService.changeDeckWallet(
        cardOne.deckId,
        cardOne.walletValue,
        false,
      ),
      this.deckService.changeDeckWallet(
        cardTradeTwo.deckId,
        cardTradeTwo.walletValue,
        false,
      ),
    ]);
  }

  private increaseWalletTrade(
    cardOne: IncreaseWalletParams,
    cardTradeTwo: IncreaseWalletParams,
  ) {
    return Promise.all([
      this.deckService.changeDeckWallet(
        cardOne.deckId,
        cardTradeTwo.walletValue,
        true,
      ),
      this.deckService.changeDeckWallet(
        cardTradeTwo.deckId,
        cardOne.walletValue,
        true,
      ),
    ]);
  }

  private async updateCardListWithNewUser(
    cardsDbOne: CardEntity[],
    newDeckId: number,
  ) {
    if (!!cardsDbOne?.length) {
      await this.cardRepository.update(
        { id: In(cardsDbOne.map((item) => item.id)) },
        { deck: { id: newDeckId } },
      );
    }
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
}

export default TradeService;
