import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export type FoodDocument = Food & Document;

@Schema()
export class Food {
  @Prop({ required: true })
  @IsString({ message: 'Food Type must be a string' })
  @ApiProperty({ example: 'string', description: 'string' })
  foodType: string;

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

export const FoodSchema = SchemaFactory.createForClass(Food);

FoodSchema.pre('save', function (next) {
  const food = this as FoodDocument;
  food.updatedAt = new Date();
  next();
});

FoodSchema.pre('updateOne', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

FoodSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});
