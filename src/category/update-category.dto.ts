import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsOptional, ValidateNested, IsArray } from 'class-validator';

export class UpdateSubcategoryDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'New Subcategory Name',
    description: 'Name of the subcategory',
    required: false,
  })
  name?: string;
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @ApiProperty({ example: 'string', description: 'string', required: false })
  name?: string;

  @IsOptional()
  @ApiProperty({ example: true, description: 'true', required: false })
  // @IsBoolean({ message: 'Status should be boolean' })
  status?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSubcategoryDto)
  @ApiPropertyOptional({
    description: 'List of subcategories under the category',
    type: [UpdateSubcategoryDto],
  })
  subcategories?: UpdateSubcategoryDto[];
}
