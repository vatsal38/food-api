import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { FoodService } from './food.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Food } from './food.schema';
import { UpdateFoodDto } from './update-food.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
@ApiTags('Foods')
@ApiBearerAuth()
@Controller('foods')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new food' })
  @ApiBody({ type: Food })
  async create(@Req() req: any, @Body() food: Food) {
    const userId = req.user.userId;
    await this.foodService.create(food, userId);
    return { message: 'Food created successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all foods' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  async findAll(
    @Req() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    const isSuperAdmin = req.user.role === 'superadmin';
    const userId = req.user.userId;
    return this.foodService.findAll(userId, page, limit, search, isSuperAdmin);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a single food by id' })
  async findOne(@Param('id') id: string) {
    return this.foodService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a food' })
  @ApiBody({ type: UpdateFoodDto })
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateFoodDto: UpdateFoodDto,
  ) {
    const userId = req.user.userId;
    await this.foodService.update(id, updateFoodDto, userId);
    return { message: 'Food updated successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a food' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.foodService.remove(id);
    return { message: 'Food deleted successfully!' };
  }
}
