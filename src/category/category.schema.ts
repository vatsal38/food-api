import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export type CategoryDocument = Category & Document;

@Schema()
export class Subcategory {
  @Prop({ required: true })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @ApiProperty({ example: 'name', description: 'name' })
  name: string;

  @Prop({ default: true })
  status: boolean;

  @Prop({ default: () => new mongoose.Types.ObjectId() })
  @IsOptional()
  _id: mongoose.Schema.Types.ObjectId;
}

export const SubcategorySchema = SchemaFactory.createForClass(Subcategory);

@Schema()
export class Category {
  @Prop({ required: true })
  @IsString({ message: 'Name must be a string' })
  @IsOptional()
  @ApiProperty({ example: 'string', description: 'string' })
  name: string;

  @Prop({ default: true })
  status: boolean;

  @Prop({ type: [{ type: SubcategorySchema }], default: [] })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'List of subcategories under the category',
    type: [Subcategory],
  })
  subcategories?: Subcategory[];

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

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.pre('save', function (next) {
  const category = this as CategoryDocument;
  category.updatedAt = new Date();
  next();
});

CategorySchema.pre('updateOne', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

CategorySchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});
