class User {
  constructor(user: User) {
    Object.assign(this, user);
  }

  public id: number;
  public name: string;
  public lastName: string;
  public email: string;
  public role: number;
  public password: string;
}

export { User };
