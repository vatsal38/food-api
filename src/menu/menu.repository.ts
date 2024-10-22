import { CategoryRepository } from '../category/category.repository';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Menu, MenuDocument } from './menu.schema';

export class MenuRepository {
  constructor(
    @InjectModel(Menu.name) private menuModel: Model<MenuDocument>,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async create(menu: Menu, userId: string): Promise<Menu> {
    menu.createdBy = userId;
    menu.user = userId;
    const newMenu = new this.menuModel(menu);
    return newMenu.save();
  }

  async findAll(
    userId: string,
    search?: string,
    isSuperAdmin?: boolean,
  ): Promise<Menu[]> {
    const query = this.createSearchQuery(search);
    if (!isSuperAdmin) {
      query.createdBy = userId;
    }
    const menus = await this.menuModel
      .find(query)
      .populate('categoryId', 'name')
      .populate('user', 'firstName lastName username')
      .exec();

    const populatedMenus = await Promise.all(
      menus.map(async (menu) => {
        const category = await this.categoryRepository.findOne(menu.categoryId);
        return {
          ...menu.toObject(),
          subCategoryId: category?.subcategories.filter((subcat) =>
            menu.subCategoryId.includes(subcat._id.toString()),
          ),
        } as any;
      }),
    );
    return populatedMenus;
  }

  async findOne(id: string): Promise<Menu> {
    const menu = await this.menuModel
      .findById(id)
      .populate('categoryId', 'name')
      .populate('user', 'firstName lastName username')
      .exec();

    const category = await this.categoryRepository.findOne(menu.categoryId);

    const populatedMenu = {
      ...menu.toObject(),
      subCategoryId: category?.subcategories.filter((subcat) =>
        menu.subCategoryId.includes(subcat._id.toString()),
      ),
    } as any;

    return populatedMenu;
  }

  async update(id: string, menu: Partial<Menu>): Promise<Menu> {
    return this.menuModel.findByIdAndUpdate(id, menu, { new: true }).exec();
  }

  async remove(id: string): Promise<Menu> {
    return this.menuModel.findByIdAndDelete(id).exec();
  }

  async findByPhone(phone: string, userId: string): Promise<Menu | null> {
    return this.menuModel.findOne({ phone }, { createdBy: userId }).exec();
  }

  async findByEmail(email: string, userId: string): Promise<Menu | null> {
    return this.menuModel.findOne({ email }, { createdBy: userId }).exec();
  }

  async findWithPagination(
    skip: number,
    limit: number,
    userId: string,
    search?: string,
    isSuperAdmin?: boolean,
  ): Promise<Menu[]> {
    const query = this.createSearchQuery(search);
    if (!isSuperAdmin) {
      query.createdBy = userId;
    }
    const menus = await this.menuModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .populate('categoryId', 'name')
      .populate('user', 'firstName lastName username')
      .exec();

    const populatedMenus = await Promise.all(
      menus.map(async (menu) => {
        const category = await this.categoryRepository.findOne(menu.categoryId);
        return {
          ...menu.toObject(),
          subCategoryId: category?.subcategories.filter((subcat) =>
            menu.subCategoryId.includes(subcat._id.toString()),
          ),
        } as any;
      }),
    );
    return populatedMenus;
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
    return this.menuModel.countDocuments(query).exec();
  }

  private createSearchQuery(search: string): any {
    if (!search) {
      return {};
    }
    const fieldsToSearch = ['menuType'];
    return {
      $or: fieldsToSearch.map((field) => ({
        [field]: { $regex: search, $options: 'i' },
      })),
    };
  }
}
