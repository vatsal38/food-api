import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { MenuRepository } from './menu.repository';
import { Menu } from './menu.schema';
import mongoose from 'mongoose';
@Injectable()
export class MenuService {
  constructor(private readonly menuRepository: MenuRepository) {}

  async create(menu: Menu, userId: string): Promise<Menu> {
    try {
      return await this.menuRepository.create(menu, userId);
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error.response?.statusCode === 409
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to create menu');
      }
    }
  }

  async findAll(
    userId: string,
    page?: number,
    limit?: number,
    search?: string,
    isSuperAdmin?: boolean,
  ) {
    if (page && limit) {
      const skip = (page - 1) * limit;
      const [items, totalRecords] = await Promise.all([
        this.menuRepository.findWithPagination(
          skip,
          limit,
          userId,
          search,
          isSuperAdmin,
        ),
        this.menuRepository.countAll(userId, search, isSuperAdmin),
      ]);
      const totalPages = Math.ceil(totalRecords / limit);
      return {
        items,
        recordsPerPage: limit,
        totalRecords,
        currentPageNumber: page,
        totalPages,
      };
    } else {
      const items = await this.menuRepository.findAll(
        userId,
        search,
        isSuperAdmin,
      );
      return items;
    }
  }

  async findOne(id: string): Promise<Menu> {
    const menu = await this.menuRepository.findOne(id);
    if (!menu) {
      throw new NotFoundException('Menu not found');
    }
    return menu;
  }

  async update(id: string, menu: Partial<Menu>, userId: string): Promise<Menu> {
    try {
      const existMenu = await this.menuRepository.findOne(id);
      if (!existMenu) {
        throw new NotFoundException('Menu not found');
      }
      return await this.menuRepository.update(id, menu);
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException ||
        error.response?.statusCode === 409
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to update menu');
      }
    }
  }

  async remove(id: string): Promise<Menu> {
    try {
      const deletedMenu = await this.menuRepository.remove(id);
      if (!deletedMenu) {
        throw new NotFoundException('Menu not found');
      }
      return deletedMenu;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to delete menu',
          error.message,
        );
      }
    }
  }
}
