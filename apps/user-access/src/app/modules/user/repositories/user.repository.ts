import { User, UserModel } from '@common/schemas';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserRepository {
  constructor(@InjectModel('User') private readonly userModel: UserModel) {}

  async create(data: Partial<User>): Promise<User> {
    const createdUser = new this.userModel(data);
    return createdUser.save();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  getByUserId(userId: string): Promise<User | null> {
    return this.userModel.findOne({ userId }).populate('roles').exec();
  }

  getByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async exists(email: string): Promise<boolean> {
    const result = await this.userModel.exists({ email });
    return !!result;
  }
}
