import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CustomerRepository } from './customer.repository';
import { Customer } from './customer.schema';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async create(customer: Customer, userId: string): Promise<Customer> {
    try {
      const highestCodeCustomer =
        await this.customerRepository.highestInvoiceNoCustomer();
      let currentCode: any = 1;
      if (highestCodeCustomer) {
        const highestCode = highestCodeCustomer.invoiceNo;
        currentCode = highestCode + 1;
      }
      customer.invoiceNo = `${currentCode}`;
      return await this.customerRepository.create(customer, userId);
    } catch (error) {
      if (error.keyPattern && error.keyPattern.phone) {
        throw new ConflictException('Phone number already exists');
      }
      if (
        error instanceof ConflictException ||
        error.response?.statusCode === 409
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to create customer');
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
        this.customerRepository.findWithPagination(
          skip,
          limit,
          userId,
          search,
          isSuperAdmin,
        ),
        this.customerRepository.countAll(userId, search, isSuperAdmin),
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
      const items = await this.customerRepository.findAll(
        userId,
        search,
        isSuperAdmin,
      );
      return items;
    }
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne(id);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  async update(
    id: string,
    customer: Partial<Customer>,
    userId: string,
  ): Promise<Customer> {
    try {
      const existingCustomer = await this.customerRepository.findOne(id);

      if (!existingCustomer) {
        throw new NotFoundException('Customer not found');
      }

      return await this.customerRepository.update(id, customer);
    } catch (error) {
      if (error.keyPattern && error.keyPattern.phone) {
        throw new ConflictException('Phone number already exists');
      }
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException ||
        error.response?.statusCode === 409
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to update customer');
      }
    }
  }

  async remove(id: string): Promise<Customer> {
    try {
      const deletedCustomer = await this.customerRepository.remove(id);
      if (!deletedCustomer) {
        throw new NotFoundException('Customer not found');
      }
      return deletedCustomer;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to delete Customer',
          error.message,
        );
      }
    }
  }

  async updateStatus(updateStatusDto: any, userId: string): Promise<Customer> {
    const updatedCustomer = await this.customerRepository.updateStatus(
      updateStatusDto.id,
      updateStatusDto.status,
      userId,
    );
    if (!updatedCustomer) {
      throw new NotFoundException('Customer not found');
    }
    return updatedCustomer;
  }
}
