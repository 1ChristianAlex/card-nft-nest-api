import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CardEntity from 'src/modules/card/entities/card.entity';
import { CardValueTrade } from 'src/modules/card/services/card.model';
import { TransactionType } from 'src/modules/deck/entities/transactions.entity';
import DeckService from 'src/modules/deck/services/deck.service';
import TradeService from 'src/modules/deck/services/trade.service';
import { Repository, IsNull } from 'typeorm';
import StoreEntity from '../entities/store.entity';
import { StoreModel } from './store.model';

@Injectable()
class StoreService {
  constructor(
    @InjectRepository(StoreEntity)
    private storeRepository: Repository<StoreEntity>,
    @InjectRepository(CardEntity)
    private cardRepository: Repository<CardEntity>,
    private tradeService: TradeService,
    private deckService: DeckService,
  ) {}

  async registerCardInStore(storeItem: StoreModel): Promise<void> {
    const card = await this.cardRepository
      .findOneOrFail({
        where: {
          id: storeItem.card.id,
          deck: { user: { id: storeItem.user.id } },
        },
        relations: { deck: { user: true } },
      })
      .catch(() => {
        throw new Error('Card must belong user to be set in market');
      });

    const alreadyInStore = await this.storeRepository.findOne({
      where: { card: { id: card.id }, transaction: IsNull() },
    });

    if (alreadyInStore) {
      throw new Error('Card already in market');
    }

    await this.storeRepository.insert(
      new StoreEntity({
        card: { id: card.id },
        price: storeItem.price,
        transaction: null,
        user: { id: card.deck.user.id },
      }),
    );
  }

  async purchaseCardInStore(storeId: number, userId: number): Promise<void> {
    const storeItem = await this.storeRepository.findOneOrFail({
      where: { id: storeId, transaction: IsNull() },
      relations: { card: { deck: true }, user: true },
    });

    if (storeItem.user.id === userId) {
      throw new Error('User cant buy is own card');
    }

    const deckTarget = await this.deckService.getUserDeck(userId);

    if (deckTarget.coins < storeItem.price) {
      throw new Error('User has not enought money');
    }

    const transaction = await this.tradeService.requestTrade(
      new CardValueTrade(storeItem.card.deck.id, [storeItem.card.id], 0),
      new CardValueTrade(deckTarget.id, [], storeItem.price),
      TransactionType.MARKET,
    );

    await this.tradeService.doTrade(transaction.id);
    await this.storeRepository.update(
      { id: storeItem.id },
      { transaction: { id: transaction.id } },
    );
  }
}

export default StoreService;
