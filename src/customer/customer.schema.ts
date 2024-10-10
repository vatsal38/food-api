import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import {
  IsString,
  IsPhoneNumber,
  IsOptional,
  IsMongoId,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export type CustomerDocument = Customer & Document;

@Schema()
export class OrderList {
  @Prop({ default: Date.now })
  @ApiProperty({ example: new Date(), description: 'Date of the order' })
  @IsOptional()
  date: Date;

  @Prop({ required: true })
  @ApiProperty({ example: '12:30', description: 'Time of the order' })
  @IsOptional()
  @IsString({ message: 'Time must be a string' })
  time: string;

  @Prop({ required: true })
  @IsOptional()
  @IsMongoId({ message: 'foodType must be valid mongo id' })
  @ApiProperty({
    example: '66f8487c648b5c22c97cc252',
    description: 'Food Type of the order',
  })
  foodType: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  @ApiProperty({ example: 'Pizza', description: 'Dish ordered' })
  @IsOptional()
  @IsString({ message: 'Dish must be a string' })
  dish: string;

  @Prop({ required: true })
  @ApiProperty({ example: 'New York', description: 'Location of the order' })
  @IsOptional()
  @IsString({ message: 'Location must be a string' })
  location: string;

  @Prop({ default: () => new mongoose.Types.ObjectId() })
  @IsOptional()
  _id: mongoose.Schema.Types.ObjectId;
}

const OrderListSchema = SchemaFactory.createForClass(OrderList);

@Schema()
export class Customer {
  @Prop({ unique: true })
  invoiceNo: string;

  @IsOptional()
  @Prop({ required: true })
  @IsString({ message: 'Customer Name must be a string' })
  @ApiProperty({ example: 'string', description: 'string' })
  customerName: string;

  @IsOptional()
  @Prop({ required: true })
  @IsString({ message: 'surname must be a string' })
  @ApiProperty({ example: 'string@yopmail.com', description: 'string' })
  surName: string;

  @IsOptional()
  @Prop({ required: true })
  @IsString({ message: 'Address must be a string' })
  @ApiProperty({ example: 'string', description: 'string' })
  Address: string;

  @Prop({ default: Date.now })
  date: Date;

  @IsOptional()
  @Prop({ required: true })
  @IsString({ message: 'Village must be a string' })
  @ApiProperty({ example: 'string', description: 'string' })
  village: string;

  @IsOptional()
  @Prop({ required: true, unique: true })
  @IsString({ message: 'Phone number must be a string' })
  @IsPhoneNumber('IN', {
    message: 'Phone number must be a valid Indian phone number',
  })
  @ApiProperty({ example: 'string', description: '1234567891' })
  phone: string;

  @Prop({ required: true })
  @IsString({ message: 'Description must be a string' })
  @ApiProperty({ example: 'string', description: 'string' })
  description: string;

  @Prop({ type: [{ type: OrderListSchema }], default: [] })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'List of Order',
    type: [OrderList],
  })
  orderList?: OrderList[];

  @Prop({ default: true })
  @IsOptional()
  @ApiProperty({ example: true, description: 'true' })
  isGoodOccasion: boolean;

  @Prop()
  @IsOptional()
  @IsString({ message: 'Role must be a string' })
  @ApiProperty({ example: 'string', description: 'string' })
  role: string;

  @Prop({ default: true })
  status: boolean;

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

export const CustomerSchema = SchemaFactory.createForClass(Customer);

CustomerSchema.pre('save', function (next) {
  const product = this as CustomerDocument;
  product.updatedAt = new Date();
  next();
});

CustomerSchema.pre('updateOne', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

CustomerSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});
