import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    console.log('1>>>>>>>>>>>>>>>>>>>>>>>>>');
    const isUserExist = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    console.log('2>>>>>>>>>>>>>>>>>>>>>>>>>');
    if (isUserExist) throw new BadRequestException('This email already exists');
    console.log('3>>>>>>>>>>>>>>>>>>>>>>>>>');
    if (!createUserDto.password)
      throw new BadRequestException('Password required');

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.save({
      email: createUserDto.email,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      password: hashedPassword,
    });

    return user;
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { email: email } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
