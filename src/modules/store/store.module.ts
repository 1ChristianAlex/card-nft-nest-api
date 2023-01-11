import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import StoreEntity from './entities/store.entity';
import StoreService from './services/store.service';

@Module({
  providers: [StoreService],
  imports: [TypeOrmModule.forFeature([StoreEntity])],
})
class StoreModule {}

export default StoreModule;
