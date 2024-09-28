import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'string', description: 'string' })
  username: string;

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'string', description: 'string' })
  firstName: string;

  @Prop()
  @IsEmail()
  @IsOptional()
  @ApiProperty({ example: 'string', description: 'string' })
  email?: string;

  @Prop()
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'string', description: 'string' })
  lastName?: string;

  @Prop({ required: true })
  @IsString()
  @Length(8, 128)
  @ApiProperty({ example: 'string', description: 'string' })
  password: string;

  @Prop()
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'string', description: 'string' })
  otp: string;

  @Prop({ default: 'admin' })
  @IsString()
  @IsOptional()
  role: string;

  @Prop()
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  otpExpiration: Date;

  @Prop({ default: false })
  @IsBoolean()
  @IsOptional()
  isVerified: boolean;

  @Prop({ default: true })
  @IsBoolean()
  @IsOptional()
  isProduct: boolean;

  @Prop()
  @IsString()
  @IsOptional()
  resetOtp: string;

  @Prop()
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  resetOtpExpiration: Date;

  @Prop({ default: true })
  @IsBoolean()
  @IsOptional()
  isWeb?: boolean;

  @Prop({ default: true })
  @IsBoolean()
  @IsOptional()
  isAndroid?: boolean;

  @Prop({ default: '6356368324' })
  @IsString()
  @IsOptional()
  number?: string;

  @Prop()
  createdBy: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  updatedBy: string;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
  const User = this as UserDocument;
  User.updatedAt = new Date();
  next();
});

UserSchema.pre('updateOne', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

UserSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});
