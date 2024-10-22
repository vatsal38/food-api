import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type MenuDocument = Menu & Document;

@Schema()
export class Menu {
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

export const MenuSchema = SchemaFactory.createForClass(Menu);

MenuSchema.pre('save', function (next) {
  const menu = this as MenuDocument;
  menu.updatedAt = new Date();
  next();
});

MenuSchema.pre('updateOne', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

MenuSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});
