import { Role, RoleName, roleModel } from '@common/schemas';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RoleRepository {
  constructor(@InjectModel(RoleName) private readonly roleModel: roleModel) {}

  async getAll(): Promise<Role[]> {
    return await this.roleModel.find().exec();
  }

  async getById(id: string): Promise<Role | null> {
    return this.roleModel.findById(id).exec();
  }

  async getName(name: string): Promise<Role | null> {
    return this.roleModel.findOne({ name }).exec();
  }
}
