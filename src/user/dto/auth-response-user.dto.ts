import { User } from '../entities/user.entity';

export class AuthResponseUserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(model: User) {
    this.id = model.id;
    this.email = model.email;
    this.firstName = model.firstName;
    this.lastName = model.lastName;
    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
  }
}
