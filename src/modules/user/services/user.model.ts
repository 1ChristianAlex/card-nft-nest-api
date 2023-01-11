import RolesEntity from '../entities/roles.entity';
import UserEntity from '../entities/user.entity';

enum ROLES_ID {
  ADMIN = 1,
  MANAGER = 2,
  PLAYER = 3,
}

class RolesModel {
  constructor(user: Partial<RolesModel>) {
    Object.assign(this, user);
  }

  public id: number;

  public description: string;

  static fromEntity(rolesEntity: RolesEntity) {
    return new RolesModel({
      id: rolesEntity.id,
      description: rolesEntity.description,
    });
  }
}

class UserModel {
  constructor(user: UserModel) {
    Object.assign(this, user);
  }

  public id: number;
  public name: string;
  public lastName: string;
  public email: string;
  public password: string;
  public isActive: boolean;
  public updatedDate?: Date;

  public createAt?: Date;
  public role?: RolesModel;

  static fromEntity(userEntity: UserEntity) {
    return new UserModel({
      id: userEntity.id,
      name: userEntity.name,
      lastName: userEntity.lastName,
      email: userEntity.email,
      password: userEntity.password,
      isActive: userEntity.isActive,
      updatedDate: userEntity.updatedDate,
      createAt: userEntity.createAt,
      role: userEntity.role ? RolesModel.fromEntity(userEntity.role) : null,
    });
  }
}

export { UserModel, RolesModel, ROLES_ID };
