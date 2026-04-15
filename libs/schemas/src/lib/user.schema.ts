import { Prop, Schema } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseSchema, createSchema } from './base.schema';

@Schema({ collection: 'users', timestamps: true })
export class User extends BaseSchema {
  @Prop({ type: String })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: String, required: true, unique: true })
  userId: string;

  @Prop({ type: [Types.ObjectId], ref: 'Role' })
  roles: Types.ObjectId[];
}

export const UserModelName = User.name;
export const UserSchema = createSchema(User);
export type UserModel = Model<User>;

export const UserDestination = { name: UserModelName, schema: UserSchema };
