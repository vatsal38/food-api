import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Food, FoodDocument } from './food.schema';

export class FoodRepository {
  constructor(@InjectModel(Food.name) private foodModel: Model<FoodDocument>) {}

  async create(food: Food, userId: string): Promise<Food> {
    food.createdBy = userId;
    food.user = userId;
    const newFood = new this.foodModel(food);
    return newFood.save();
  }

  async findAll(
    userId: string,
    search?: string,
    isSuperAdmin?: boolean,
  ): Promise<Food[]> {
    const query = this.createSearchQuery(search);
    if (!isSuperAdmin) {
      query.createdBy = userId;
    }
    return this.foodModel.find(query).exec();
  }

  async findOne(id: string): Promise<Food> {
    return this.foodModel.findById(id).exec();
  }

  async update(id: string, food: Partial<Food>): Promise<Food> {
    return this.foodModel.findByIdAndUpdate(id, food, { new: true }).exec();
  }

  async remove(id: string): Promise<Food> {
    return this.foodModel.findByIdAndDelete(id).exec();
  }

  async findByPhone(phone: string, userId: string): Promise<Food | null> {
    return this.foodModel.findOne({ phone }, { createdBy: userId }).exec();
  }

  async findByEmail(email: string, userId: string): Promise<Food | null> {
    return this.foodModel.findOne({ email }, { createdBy: userId }).exec();
  }

  async findWithPagination(
    skip: number,
    limit: number,
    userId: string,
    search?: string,
    isSuperAdmin?: boolean,
  ): Promise<Food[]> {
    const query = this.createSearchQuery(search);
    if (!isSuperAdmin) {
      query.createdBy = userId;
    }
    return this.foodModel.find(query).skip(skip).limit(limit).exec();
  }

  async countAll(
    userId: string,
    search?: string,
    isSuperAdmin?: boolean,
  ): Promise<number> {
    const query = this.createSearchQuery(search);

    if (!isSuperAdmin) {
      query.createdBy = userId;
    }
    return this.foodModel.countDocuments(query).exec();
  }

  private createSearchQuery(search: string): any {
    if (!search) {
      return {};
    }
    const fieldsToSearch = ['foodType'];
    return {
      $or: fieldsToSearch.map((field) => ({
        [field]: { $regex: search, $options: 'i' },
      })),
    };
  }
}
