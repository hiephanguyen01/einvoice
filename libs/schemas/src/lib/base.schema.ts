import { Type } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';

@Schema({ timestamps: true, versionKey: false, collection: 'invoices' })
export class BaseSchema {
  _id: ObjectId;

  id: string;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ type: Date, default: new Date() })
  updatedAt: Date;
}

export const createSchema = <T extends Type<any>>(target: T) => {
  const schema = SchemaFactory.createForClass(target);
  schema.set('toObject', { virtuals: true });
  schema.set('toJSON', { virtuals: true });
  schema.set('versionKey', false);
  schema.set('timestamps', true);
  return schema;
};
