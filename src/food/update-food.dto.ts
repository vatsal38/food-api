import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateFoodDto {
  @IsOptional()
  @IsString({ message: 'Food Type must be a string' })
  @ApiProperty({ example: 'string', description: 'string', required: false })
  foodType?: string;
}
