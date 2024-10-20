import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @ApiProperty({
    type: mongoose.Schema.Types.ObjectId,
    description: 'Category ID',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Category',
  })
  categoryId: string;

  @ApiProperty({
    type: [mongoose.Schema.Types.ObjectId],
    description: 'Array of Subcategory IDs',
  })
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: 'Subcategory',
  })
  subCategoryId: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: string;

  @Prop()
  createdBy: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  updatedBy: string;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.pre('save', function (next) {
  const order = this as OrderDocument;
  order.updatedAt = new Date();
  next();
});

OrderSchema.pre('updateOne', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

OrderSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});
