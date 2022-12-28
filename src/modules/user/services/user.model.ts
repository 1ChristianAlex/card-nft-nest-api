import RolesEntity from '../entities/roles.entity';
import UserEntity from '../entities/user.entity';

enum ROLES_ID {
  ADMIN = 1,
  MANAGER = 2,
  PLAYER = 3,
}

class Roles {
  constructor(user: Partial<Roles>) {
    Object.assign(this, user);
  }

  public id: number;

  public description: string;

  static adapterEntityToModel(rolesEntity: RolesEntity) {
    return new Roles({
      id: rolesEntity.id,
      description: rolesEntity.description,
    });
  }
}

class User {
  constructor(user: User) {
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
  public role?: Roles;

  static adapterEntityToModel(userEntity: UserEntity) {
    return new User({
      id: userEntity.id,
      name: userEntity.name,
      lastName: userEntity.lastName,
      email: userEntity.email,
      password: userEntity.password,
      isActive: userEntity.isActive,
      updatedDate: userEntity.updatedDate,
      createAt: userEntity.createAt,
      role: userEntity.role
        ? Roles.adapterEntityToModel(userEntity.role)
        : null,
    });
  }
}

export { User, Roles, ROLES_ID };
