import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './category.schema';

export class CategoryRepository {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(category: Category, userId: string): Promise<Category> {
    category.createdBy = userId;
    category.user = userId;
    const newCategory = new this.categoryModel(category);
    return newCategory.save();
  }

  async findAll(
    userId: string,
    search?: string,
    isSuperAdmin?: boolean,
  ): Promise<Category[]> {
    const query = this.createSearchQuery(search);
    if (!isSuperAdmin) {
      query.createdBy = userId;
    }
    const categories = await this.categoryModel.find(query).exec();
    const filteredCategories = categories
      .map((category) => {
        if (category.status) {
          category.subcategories = category.subcategories.filter(
            (subcategory) => subcategory.status,
          );
          return category;
        }
        return null;
      })
      .filter((category) => category !== null);
    return filteredCategories;
  }

  async findOne(id: string): Promise<Category> {
    return this.categoryModel.findById(id).exec();
  }

  async update(id: string, category: Partial<Category>): Promise<Category> {
    return this.categoryModel
      .findByIdAndUpdate(id, category, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Category> {
    return this.categoryModel.findByIdAndDelete(id).exec();
  }

  async findByPhone(phone: string, userId: string): Promise<Category | null> {
    return this.categoryModel.findOne({ phone }, { createdBy: userId }).exec();
  }

  async findByEmail(email: string, userId: string): Promise<Category | null> {
    return this.categoryModel.findOne({ email }, { createdBy: userId }).exec();
  }

  async findWithPagination(
    skip: number,
    limit: number,
    userId: string,
    search?: string,
    isSuperAdmin?: boolean,
  ): Promise<Category[]> {
    const query = this.createSearchQuery(search);
    if (!isSuperAdmin) {
      query.createdBy = userId;
    }
    return this.categoryModel.find(query).skip(skip).limit(limit).exec();
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
    return this.categoryModel.countDocuments(query).exec();
  }

  async highestCodeCategory(codePrefix: any) {
    return this.categoryModel
      .findOne({ code: { $regex: `^${codePrefix}` } })
      .sort({ code: -1 })
      .select('code')
      .exec();
  }

  async updateStatus(
    id: string,
    status: boolean,
    userId: string,
  ): Promise<Category> {
    return this.categoryModel
      .findByIdAndUpdate(
        id,
        { status, updatedBy: userId, updatedAt: new Date() },
        { new: true },
      )
      .exec();
  }

  private createSearchQuery(search: string): any {
    if (!search) {
      return {};
    }
    const fieldsToSearch = [
      'code',
      'name',
      'email',
      'phone',
      'village',
      'username',
      'gender',
    ];
    return {
      $or: fieldsToSearch.map((field) => ({
        [field]: { $regex: search, $options: 'i' },
      })),
    };
  }
}
