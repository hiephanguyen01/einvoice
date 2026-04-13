import { PERMISSION, ROLE } from '@common/constants';
import { Prop } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseSchema, createSchema } from './base.schema';

export class Role extends BaseSchema {
  @Prop({ type: String, enum: ROLE, default: ROLE.ACCOUNTANT })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: [String], enum: PERMISSION, default: [] })
  permissions: string[];
}

export const RoleName = Role.name;

export const RoleSchema = createSchema(Role);

export type roleModel = Model<Role>;

export const RoleDestination = {
  name: RoleName,
  schema: RoleSchema,
};
