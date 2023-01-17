import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CardEntity from 'src/modules/card/entities/card.entity';
import { CardValueTrade } from 'src/modules/card/services/card.model';
import DeckService from 'src/modules/deck/services/deck.service';
import { In, Repository } from 'typeorm';
import TransactionEntity, {
  TransactionStatus,
  TransactionType,
} from '../entities/transactions.entity';
import { IncreaseCoinsParams } from './deck.model';
import TransactionService from './transaction.service';

@Injectable()
class TradeService {
  constructor(
    @InjectRepository(CardEntity)
    private cardRepository: Repository<CardEntity>,
    private deckService: DeckService,
    private transactionService: TransactionService,
  ) {}

  async giveCard(
    cardGived: CardValueTrade,
    deckIdToGive: number,
  ): Promise<void> {
    if (!!cardGived.cardListIds?.length) {
      await this.cardRepository.update(
        { id: In(cardGived.cardListIds) },
        { deck: { id: deckIdToGive } },
      );
    }

    if (cardGived.value) {
      const coinsOne = new IncreaseCoinsParams(
        cardGived.deckId,
        cardGived.value,
      );
      const coinsTwo = new IncreaseCoinsParams(deckIdToGive, 0);

      await Promise.all([
        this.increaseCoinsTrade(coinsOne, coinsTwo),
        this.decreaseCoinsTrade(coinsOne, coinsTwo),
      ]);
    }

    const targetDeck = await this.deckService.getDeckById(cardGived.deckId);

    await this.transactionService.registerTransaction(
      targetDeck.user.id,
      new CardValueTrade(deckIdToGive, cardGived.cardListIds, cardGived.value),
      TransactionType.GIVE,
      TransactionStatus.ACCEPT,
      null,
    );
  }

  async requestTrade(
    cardTradeSelf: CardValueTrade,
    cardTradeTarget: CardValueTrade,
    transactionType = TransactionType.TRADE,
  ): Promise<TransactionEntity> {
    const selfDeck = await this.deckService.getDeckById(cardTradeSelf.deckId);

    return await this.registerRequestTransaction(
      selfDeck.user.id,
      cardTradeSelf,
      cardTradeTarget,
      transactionType,
    );
  }

  async doTrade(transactionId: number): Promise<void> {
    await this.transactionService.updateTransaction(
      transactionId,
      TransactionStatus.ACCEPT,
    );

    const [selfCardValueTrade, targetCardValueTrade] =
      await this.transactionService.getTransactionToTrade(transactionId);

    await this.tradeCards(selfCardValueTrade, targetCardValueTrade);
  }

  async declineTrade(transactionId: number): Promise<void> {
    await this.transactionService.updateTransaction(
      transactionId,
      TransactionStatus.DENIED,
    );
  }

  async tradeCards(
    cardTradeSelf: CardValueTrade,
    cardTradeTarget: CardValueTrade,
  ): Promise<void> {
    const [cardsDbSelf, cardsDbTarget] = await Promise.all([
      this.getCardById(cardTradeSelf.cardListIds),
      this.getCardById(cardTradeTarget.cardListIds),
    ]);

    await Promise.all([
      this.updateDeckCardList(cardsDbSelf, cardTradeTarget.deckId),
      this.updateDeckCardList(cardsDbTarget, cardTradeSelf.deckId),
    ]);

    const coinsSelf = new IncreaseCoinsParams(
      cardTradeSelf.deckId,
      cardTradeSelf.value,
    );
    const coinsTarget = new IncreaseCoinsParams(
      cardTradeTarget.deckId,
      cardTradeTarget.value,
    );

    await Promise.all([
      this.increaseCoinsTrade(coinsSelf, coinsTarget),
      this.decreaseCoinsTrade(coinsSelf, coinsTarget),
    ]);

    const allCardsId = [...cardsDbTarget, ...cardsDbSelf].map(({ id }) => id);

    await this.cardRepository.increment({ id: In(allCardsId) }, 'price', 25);
  }

  async registerRequestTransaction(
    selfUserId: number,
    cardTradeSelf: CardValueTrade,
    cardTradeTarget: CardValueTrade,
    transactionType = TransactionType.TRADE,
  ): Promise<TransactionEntity> {
    const selfTransaction = await this.transactionService.registerTransaction(
      selfUserId,
      new CardValueTrade(
        cardTradeSelf.deckId,
        cardTradeSelf.cardListIds,
        cardTradeSelf.value,
      ),
      transactionType,
      TransactionStatus.REQUEST,
      null,
    );

    const targetTransaction = await this.transactionService.registerTransaction(
      selfUserId,
      new CardValueTrade(
        cardTradeTarget.deckId,
        cardTradeTarget.cardListIds,
        cardTradeTarget.value,
      ),
      transactionType,
      TransactionStatus.REQUEST,
      selfTransaction.id,
    );

    return targetTransaction;
  }

  private async decreaseCoinsTrade(
    cardOne: IncreaseCoinsParams,
    cardTradeTwo: IncreaseCoinsParams,
  ): Promise<void> {
    await Promise.all([
      this.deckService.changeDeckCoins(
        cardOne.deckId,
        cardOne.coinsValue,
        false,
      ),
      this.deckService.changeDeckCoins(
        cardTradeTwo.deckId,
        cardTradeTwo.coinsValue,
        false,
      ),
    ]);
  }

  private async increaseCoinsTrade(
    cardOne: IncreaseCoinsParams,
    cardTradeTwo: IncreaseCoinsParams,
  ): Promise<void> {
    await Promise.all([
      this.deckService.changeDeckCoins(
        cardOne.deckId,
        cardTradeTwo.coinsValue,
        true,
      ),
      this.deckService.changeDeckCoins(
        cardTradeTwo.deckId,
        cardOne.coinsValue,
        true,
      ),
    ]);
  }

  private async updateDeckCardList(
    cardsDbOne: CardEntity[],
    newDeckId: number,
  ): Promise<void> {
    if (!!cardsDbOne?.length) {
      await this.cardRepository.update(
        { id: In(cardsDbOne.map((item) => item.id)) },
        { deck: { id: newDeckId } },
      );
    }
  }

  private async getCardById(cardListIds: number[]): Promise<CardEntity[]> {
    if (!cardListIds.length) {
      return [];
    }
    return this.cardRepository.find({
      where: { id: In(cardListIds) },
    });
  }
}

export default TradeService;
