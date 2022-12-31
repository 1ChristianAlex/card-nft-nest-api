import PasswordHash from '../../lib/passwordHash/passwordHash.service';
import RolesEntity from '../../modules/user/entities/roles.entity';
import UserEntity from '../../modules/user/entities/user.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';
import TierEntity from '../../modules/card/entities/tier.entity';
import WalletEntity from '../../modules/card/entities/wallet.entity';
import CardStatusEntity from '../../modules/card/entities/cardStatus.entity';

export class initalSeed2672241522331 implements MigrationInterface {
  private readonly adminRole = new RolesEntity('Admin');

  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.insertRoles(queryRunner);

    await this.insertAdminUser(queryRunner);

    await this.insertTiers(queryRunner);

    await queryRunner.manager.save(
      WalletEntity,
      new WalletEntity({ nextGamble: new Date(), user: { id: 1 } }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await this.deleteAdminUser(queryRunner);

    await this.deleteAllRoles(queryRunner);

    await this.deleteAllTiers(queryRunner);
  }

  private async insertTiers(queryRunner: QueryRunner) {
    const cardStatus = [
      new CardStatusEntity({ name: 'Free' }),
      new CardStatusEntity({ name: 'In Gamble' }),
      new CardStatusEntity({ name: 'Claimed' }),
    ];

    await queryRunner.manager.save(CardStatusEntity, cardStatus);

    const tiers = [
      new TierEntity('Silver', 'Silver Tier Card', 1),
      new TierEntity('Gold', 'Gold Tier Card', 2),
      new TierEntity('Platinum', 'Platinum Tier Card', 3),
    ];

    await queryRunner.manager.save(TierEntity, tiers);
  }

  private async insertAdminUser(queryRunner: QueryRunner) {
    const adminRole = await queryRunner.manager.findOneBy(RolesEntity, {
      description: this.adminRole.description,
    });

    const adminUser = new UserEntity({
      email: 'christianalexbh@hotmail.com',
      lastName: 'Alexsander',
      name: 'Christian',
      password: await new PasswordHash().genHash('123456789'),
      role: adminRole,
    });

    await queryRunner.manager.save(UserEntity, adminUser);
  }

  private async insertRoles(queryRunner: QueryRunner) {
    const roles = [
      this.adminRole,
      new RolesEntity('Manager'),
      new RolesEntity('Player'),
    ];

    await queryRunner.manager.save(RolesEntity, roles);
  }

  private async deleteAllTiers(queryRunner: QueryRunner) {
    const allTiers = await queryRunner.manager.find(TierEntity);

    await queryRunner.manager.delete(TierEntity, allTiers);
  }

  private async deleteAllRoles(queryRunner: QueryRunner) {
    const allRole = await queryRunner.manager.find(RolesEntity);

    await queryRunner.manager.delete(RolesEntity, allRole);
  }

  private async deleteAdminUser(queryRunner: QueryRunner) {
    const admin = await queryRunner.manager.findOneBy(UserEntity, {
      role: { description: this.adminRole.description },
    });

    await queryRunner.manager.delete(UserEntity, admin);
  }
}
