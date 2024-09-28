import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { Category } from './category.schema';
import mongoose from 'mongoose';
import { UpdateCategoryDto, UpdateSubcategoryDto } from './update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(category: any, userId: string): Promise<Category> {
    try {
      if (category.subcategories) {
        category.subcategories = category.subcategories.map((sub) => ({
          ...sub,
          status: sub.status !== undefined ? sub.status : true,
          _id: new mongoose.Types.ObjectId(),
        }));
      }

      return await this.categoryRepository.create(category, userId);
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error.response?.statusCode === 409
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to create category');
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
        this.categoryRepository.findWithPagination(
          skip,
          limit,
          userId,
          search,
          isSuperAdmin,
        ),
        this.categoryRepository.countAll(userId, search, isSuperAdmin),
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
      const items = await this.categoryRepository.findAll(
        userId,
        search,
        isSuperAdmin,
      );
      return items;
    }
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async update(
    id: string,
    category: Partial<Category>,
    userId: string,
  ): Promise<Category> {
    try {
      const existCategory: any = await this.categoryRepository.findOne(id);
      if (!existCategory) {
        throw new NotFoundException('Category not found');
      }

      if (category.name) {
        existCategory.name = category.name;
      }

      if (category.subcategories && category.subcategories.length > 0) {
        existCategory.subcategories = category.subcategories.map(
          (subcategory) => ({
            name: subcategory.name,
            _id: (subcategory._id as any) || new mongoose.Types.ObjectId(),
          }),
        );
      }

      return await this.categoryRepository.update(id, category);
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException ||
        error.response?.statusCode === 409
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to update category');
      }
    }
  }

  async remove(id: string): Promise<Category> {
    try {
      const deletedCategory = await this.categoryRepository.remove(id);
      if (!deletedCategory) {
        throw new NotFoundException('Category not found');
      }
      return deletedCategory;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to delete category',
          error.message,
        );
      }
    }
  }

  async updateStatus(updateStatusDto: any, userId: string): Promise<Category> {
    const updatedCategory = await this.categoryRepository.updateStatus(
      updateStatusDto.id,
      false,
      userId,
    );
    if (!updatedCategory) {
      throw new NotFoundException('Category not found');
    }
    return updatedCategory;
  }

  async updateSubcategoryStatus(
    categoryId: string,
    subcategoryId: string,
    status: boolean,
  ): Promise<Category> {
    const category = await this.categoryRepository.findOne(categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const subcategory = category.subcategories.find(
      (sub) => sub._id.toString() === subcategoryId,
    );

    if (!subcategory) {
      throw new NotFoundException('Subcategory not found');
    }

    subcategory.status = status;
    return await this.categoryRepository.update(categoryId, category);
  }
}
