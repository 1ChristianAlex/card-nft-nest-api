import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CardEntity from 'src/modules/card/entities/card.entity';
import { CardValueTrade } from 'src/modules/card/services/card.model';
import DeckService from 'src/modules/deck/services/deck.service';
import { In, Repository } from 'typeorm';
import {
  TransactionStatus,
  TransactionType,
} from '../entities/transactions.entity';
import { IncreaseWalletParams } from './deck.model';
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
      const walletOne = new IncreaseWalletParams(
        cardGived.deckId,
        cardGived.value,
      );
      const walletTwo = new IncreaseWalletParams(deckIdToGive, 0);

      await Promise.all([
        this.increaseWalletTrade(walletOne, walletTwo),
        this.decreaseWalletTrade(walletOne, walletTwo),
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
  ): Promise<void> {
    const selfDeck = await this.deckService.getDeckById(cardTradeSelf.deckId);

    await this.registerRequestTransaction(
      selfDeck.user.id,
      cardTradeSelf,
      cardTradeTarget,
    );
  }

  async doTrade(transactionId: number) {
    await this.transactionService.updateTransaction(
      transactionId,
      TransactionStatus.ACCEPT,
    );

    const [selfCardValueTrade, targetCardValueTrade] =
      await this.transactionService.getTransactionToTrade(transactionId);

    await this.tradeCards(selfCardValueTrade, targetCardValueTrade);
  }

  async declineTrade(transactionId: number) {
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

    const walletSelf = new IncreaseWalletParams(
      cardTradeSelf.deckId,
      cardTradeSelf.value,
    );
    const walletTarget = new IncreaseWalletParams(
      cardTradeTarget.deckId,
      cardTradeTarget.value,
    );

    await Promise.all([
      this.increaseWalletTrade(walletSelf, walletTarget),
      this.decreaseWalletTrade(walletSelf, walletTarget),
    ]);

    const allCardsId = [...cardsDbTarget, ...cardsDbSelf].map(({ id }) => id);

    await this.cardRepository.increment({ id: In(allCardsId) }, 'price', 25);
  }

  private async registerRequestTransaction(
    selfUserId: number,
    cardTradeSelf: CardValueTrade,
    cardTradeTarget: CardValueTrade,
  ): Promise<void> {
    const transaction = await this.transactionService.registerTransaction(
      selfUserId,
      new CardValueTrade(
        cardTradeSelf.deckId,
        cardTradeSelf.cardListIds,
        cardTradeSelf.value,
      ),
      TransactionType.TRADE,
      TransactionStatus.REQUEST,
      null,
    );

    await this.transactionService.registerTransaction(
      selfUserId,
      new CardValueTrade(
        cardTradeTarget.deckId,
        cardTradeTarget.cardListIds,
        cardTradeTarget.value,
      ),
      TransactionType.TRADE,
      TransactionStatus.REQUEST,
      transaction.id,
    );
  }

  private async decreaseWalletTrade(
    cardOne: IncreaseWalletParams,
    cardTradeTwo: IncreaseWalletParams,
  ): Promise<void> {
    await Promise.all([
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

  private async increaseWalletTrade(
    cardOne: IncreaseWalletParams,
    cardTradeTwo: IncreaseWalletParams,
  ): Promise<void> {
    await Promise.all([
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
