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
import { CategoryService } from './category.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Category } from './category.schema';
import { UpdateCategoryDto } from './update-category.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import mongoose from 'mongoose';
@ApiTags('Categories')
@ApiBearerAuth()
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiBody({ type: Category })
  async create(@Req() req: any, @Body() category: Category) {
    const userId = req.user.userId;
    await this.categoryService.create(category, userId);
    return { message: 'Category created successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all category' })
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
    return this.categoryService.findAll(
      userId,
      page,
      limit,
      search,
      isSuperAdmin,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a single category by id' })
  async findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiBody({ type: UpdateCategoryDto })
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateCategoryDto: any,
  ) {
    const userId = req.user.userId;
    await this.categoryService.update(id, updateCategoryDto, userId);
    return { message: 'Category updated successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('status')
  @ApiOperation({ summary: 'Delete category status' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        status: { type: 'boolean' },
      },
    },
  })
  async updateStatus(@Req() req: any, @Body() updateStatusDto: { id: string }) {
    const userId = req.user.userId;
    await this.categoryService.updateStatus(updateStatusDto, userId);
    return { message: 'Category deleted successfully!' };
  }

  @Post(':id/subcategories/:subId/status')
  @ApiOperation({ summary: 'Delete subcategory status' })
  async updateSubcategoryStatus(
    @Param('id') categoryId: string,
    @Param('subId') subcategoryId: string,
  ) {
    await this.categoryService.updateSubcategoryStatus(
      categoryId,
      subcategoryId,
      false,
    );
    return { message: 'Sub category deleted successfully!' };
  }
}
