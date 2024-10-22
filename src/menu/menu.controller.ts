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
import { MenuService } from './menu.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Menu } from './menu.schema';
import { UpdateMenuDto } from './update-menu.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import mongoose from 'mongoose';
@ApiTags('Menus')
@ApiBearerAuth()
@Controller('menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new menu' })
  @ApiBody({
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          categoryId: { type: 'string' },
          subCategoryId: { type: 'array', items: { type: 'string' } },
        },
      },
    },
  })
  async create(@Req() req: any, @Body() menu: any) {
    const userId = req.user.userId;
    await Promise.all(
      menu.map((menuDto: any) => this.menuService.create(menuDto, userId)),
    );
    return { message: 'Menu created successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all menus' })
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
    return this.menuService.findAll(userId, page, limit, search, isSuperAdmin);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a single menu by id' })
  async findOne(@Param('id') id: string) {
    return this.menuService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a menu' })
  @ApiBody({ type: UpdateMenuDto })
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateMenuDto: UpdateMenuDto,
  ) {
    const userId = req.user.userId;
    await this.menuService.update(id, updateMenuDto, userId);
    return { message: 'Menu updated successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a menu' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.menuService.remove(id);
    return { message: 'Menu deleted successfully!' };
  }
}
