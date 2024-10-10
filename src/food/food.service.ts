import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FoodRepository } from './food.repository';
import { Food } from './food.schema';
import { generateUniqueUsername } from '../utils/functions';
@Injectable()
export class FoodService {
  constructor(private readonly foodRepository: FoodRepository) {}

  async create(food: Food, userId: string): Promise<Food> {
    try {
      return await this.foodRepository.create(food, userId);
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error.response?.statusCode === 409
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to create food');
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
        this.foodRepository.findWithPagination(
          skip,
          limit,
          userId,
          search,
          isSuperAdmin,
        ),
        this.foodRepository.countAll(userId, search, isSuperAdmin),
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
      const items = await this.foodRepository.findAll(
        userId,
        search,
        isSuperAdmin,
      );
      return items;
    }
  }

  async findOne(id: string): Promise<Food> {
    const food = await this.foodRepository.findOne(id);
    if (!food) {
      throw new NotFoundException('Food not found');
    }
    return food;
  }

  async update(id: string, food: Partial<Food>, userId: string): Promise<Food> {
    try {
      const existFood = await this.foodRepository.findOne(id);
      if (!existFood) {
        throw new NotFoundException('Food not found');
      }
      return await this.foodRepository.update(id, food);
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException ||
        error.response?.statusCode === 409
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to update food');
      }
    }
  }

  async remove(id: string): Promise<Food> {
    try {
      const deletedFood = await this.foodRepository.remove(id);
      if (!deletedFood) {
        throw new NotFoundException('Food not found');
      }
      return deletedFood;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to delete food',
          error.message,
        );
      }
    }
  }
}
