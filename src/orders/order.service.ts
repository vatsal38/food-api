import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { Order } from './order.schema';
@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async create(order: Order, userId: string): Promise<Order> {
    try {
      return await this.orderRepository.create(order, userId);
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error.response?.statusCode === 409
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to create order');
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
        this.orderRepository.findWithPagination(
          skip,
          limit,
          userId,
          search,
          isSuperAdmin,
        ),
        this.orderRepository.countAll(userId, search, isSuperAdmin),
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
      const items = await this.orderRepository.findAll(
        userId,
        search,
        isSuperAdmin,
      );
      return items;
    }
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async update(
    id: string,
    order: Partial<Order>,
    userId: string,
  ): Promise<Order> {
    try {
      const existOrder = await this.orderRepository.findOne(id);
      if (!existOrder) {
        throw new NotFoundException('Order not found');
      }
      return await this.orderRepository.update(id, order);
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException ||
        error.response?.statusCode === 409
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to update order');
      }
    }
  }

  async remove(id: string): Promise<Order> {
    try {
      const deletedOrder = await this.orderRepository.remove(id);
      if (!deletedOrder) {
        throw new NotFoundException('Order not found');
      }
      return deletedOrder;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to delete order',
          error.message,
        );
      }
    }
  }
}
