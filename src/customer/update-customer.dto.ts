import { UpdateSubcategoryDto } from './../category/update-category.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsPhoneNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';

export class UpdateOrderListDto {
  @ApiProperty({ example: new Date(), description: 'Date of the order' })
  @IsOptional()
  date: Date;

  @ApiProperty({ example: '12:30', description: 'Time of the order' })
  @IsOptional()
  @IsString({ message: 'Time must be a string' })
  time: string;

  @ApiProperty({ example: 'veg', description: 'Food type of the order' })
  @IsOptional()
  foodType: mongoose.Schema.Types.ObjectId;

  @ApiProperty({ example: 'Pizza', description: 'Dish ordered' })
  @IsOptional()
  @IsString({ message: 'Dish must be a string' })
  dish: string;

  @ApiProperty({ example: 'New York', description: 'Location of the order' })
  @IsOptional()
  @IsString({ message: 'Location must be a string' })
  location: string;
}

export class UpdateCustomerDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @ApiProperty({ example: 'string', description: 'string' })
  customerName?: string;

  @IsOptional()
  @IsString({ message: 'Email must be a string' })
  @ApiProperty({ example: 'string@yopmail.com', description: 'string' })
  surName?: string;

  @IsOptional()
  @IsString({ message: 'Village must be a string' })
  @ApiProperty({ example: 'string', description: 'string' })
  Address?: string;

  @IsOptional()
  @IsString({ message: 'Village must be a string' })
  @ApiProperty({ example: 'string', description: 'string' })
  village?: string;

  @IsOptional()
  @IsString({ message: 'Phone number must be a string' })
  @IsPhoneNumber('IN', {
    message: 'Phone number must be a valid Indian phone number',
  })
  @ApiProperty({ example: 'string', description: '1234567891' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'Village must be a string' })
  @ApiProperty({ example: 'string', description: 'string' })
  description?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateOrderListDto)
  @ApiPropertyOptional({
    description: 'List of order',
    type: [UpdateOrderListDto],
  })
  orderList?: UpdateOrderListDto[];

  @IsOptional()
  @ApiProperty({ example: true, description: 'true' })
  isGoodOccasion?: boolean;

  @IsString({ message: 'Role must be a string' })
  @IsOptional()
  @ApiProperty({ example: 'string', description: 'string' })
  role?: string;

  @IsOptional()
  @ApiProperty({ example: true, description: 'string' })
  status?: boolean;
}
