import { CategoryRepository } from './../category/category.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './order.schema';

export class OrderRepository {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async create(order: Order, userId: string): Promise<Order> {
    order.createdBy = userId;
    order.user = userId;
    const newOrder = new this.orderModel(order);
    return newOrder.save();
  }

  async findAll(
    userId: string,
    search?: string,
    isSuperAdmin?: boolean,
  ): Promise<Order[]> {
    const query = this.createSearchQuery(search);
    if (!isSuperAdmin) {
      query.createdBy = userId;
    }
    const orders = await this.orderModel
      .find(query)
      .populate('categoryId', 'name')
      .populate('user', 'firstName lastName username')
      .exec();

    const populatedOrders = await Promise.all(
      orders.map(async (order) => {
        const category = await this.categoryRepository.findOne(
          order.categoryId,
        );
        return {
          ...order.toObject(),
          subCategoryId: category?.subcategories.filter((subcat) =>
            order.subCategoryId.includes(subcat._id.toString()),
          ),
        } as any;
      }),
    );
    return populatedOrders;
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel
      .findById(id)
      .populate('categoryId', 'name')
      .populate('user', 'firstName lastName username')
      .exec();

    const category = await this.categoryRepository.findOne(order.categoryId);

    const populatedOrder = {
      ...order.toObject(),
      subCategoryId: category?.subcategories.filter((subcat) =>
        order.subCategoryId.includes(subcat._id.toString()),
      ),
    } as any;

    return populatedOrder;
  }

  async update(id: string, order: Partial<Order>): Promise<Order> {
    return this.orderModel.findByIdAndUpdate(id, order, { new: true }).exec();
  }

  async remove(id: string): Promise<Order> {
    return this.orderModel.findByIdAndDelete(id).exec();
  }

  async findByPhone(phone: string, userId: string): Promise<Order | null> {
    return this.orderModel.findOne({ phone }, { createdBy: userId }).exec();
  }

  async findByEmail(email: string, userId: string): Promise<Order | null> {
    return this.orderModel.findOne({ email }, { createdBy: userId }).exec();
  }

  async findWithPagination(
    skip: number,
    limit: number,
    userId: string,
    search?: string,
    isSuperAdmin?: boolean,
  ): Promise<Order[]> {
    const query = this.createSearchQuery(search);
    if (!isSuperAdmin) {
      query.createdBy = userId;
    }
    const orders = await this.orderModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .populate('categoryId', 'name')
      .populate('user', 'firstName lastName username')
      .exec();

    const populatedOrders = await Promise.all(
      orders.map(async (order) => {
        const category = await this.categoryRepository.findOne(
          order.categoryId,
        );
        return {
          ...order.toObject(),
          subCategoryId: category?.subcategories.filter((subcat) =>
            order.subCategoryId.includes(subcat._id.toString()),
          ),
        } as any;
      }),
    );
    return populatedOrders;
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
    return this.orderModel.countDocuments(query).exec();
  }

  private createSearchQuery(search: string): any {
    if (!search) {
      return {};
    }
    const fieldsToSearch = ['orderType'];
    return {
      $or: fieldsToSearch.map((field) => ({
        [field]: { $regex: search, $options: 'i' },
      })),
    };
  }
}
