import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import mongoose from 'mongoose';

export class UpdateOrderDto {
  @IsOptional()
  @ApiProperty({ type: String, description: 'Category ID' })
  categoryId: string;

  @IsOptional()
  @ApiProperty({ type: [String], description: 'Array of Subcategory IDs' })
  subCategoryId: string[];
}
