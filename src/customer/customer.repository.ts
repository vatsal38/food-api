import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from './customer.schema';

export class CustomerRepository {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
  ) {}

  async create(customer: Customer, userId: string): Promise<Customer> {
    customer.createdBy = userId;
    customer.user = userId;
    const newCustomer = new this.customerModel(customer);
    return newCustomer.save();
  }

  async findAll(
    userId: string,
    search?: string,
    isSuperAdmin?: boolean,
    isOrderList?: boolean,
  ): Promise<Customer[]> {
    const query = this.createSearchQuery(search, isOrderList);
    if (!isSuperAdmin) {
      query.createdBy = userId;
    }
    return this.customerModel
      .find(query)
      .populate({ path: 'orderList.foodType', model: 'Food' })
      .exec();
  }

  async findOne(id: string): Promise<Customer> {
    return this.customerModel.findById(id).exec();
  }

  async update(id: string, customer: Partial<Customer>): Promise<Customer> {
    return this.customerModel
      .findByIdAndUpdate(id, customer, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Customer> {
    return this.customerModel.findByIdAndDelete(id).exec();
  }

  async findByPhone(phone: string, userId: string): Promise<Customer | null> {
    return this.customerModel.findOne({ phone }, { createdBy: userId }).exec();
  }

  async findByEmail(email: string, userId: string): Promise<Customer | null> {
    return this.customerModel.findOne({ email }, { createdBy: userId }).exec();
  }

  async findWithPagination(
    skip: number,
    limit: number,
    userId: string,
    search?: string,
    isSuperAdmin?: boolean,
    isOrderList?: boolean,
  ): Promise<Customer[]> {
    const query = this.createSearchQuery(search, isOrderList);
    if (!isSuperAdmin) {
      query.createdBy = userId;
    }
    return this.customerModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .populate({ path: 'orderList.foodType', model: 'Food' })
      .exec();
  }

  async countAll(
    userId: string,
    search?: string,
    isSuperAdmin?: boolean,
    isOrderList?: boolean,
  ): Promise<number> {
    const query = this.createSearchQuery(search, isOrderList);
    if (!isSuperAdmin) {
      query.createdBy = userId;
    }
    return this.customerModel.countDocuments(query).exec();
  }

  async highestInvoiceNoCustomer() {
    return this.customerModel
      .findOne()
      .sort({ invoiceNo: -1 })
      .select('invoiceNo')
      .exec();
  }

  async updateStatus(
    id: string,
    status: boolean,
    userId: string,
  ): Promise<Customer> {
    return this.customerModel
      .findByIdAndUpdate(
        id,
        { status, updatedBy: userId, updatedAt: new Date() },
        { new: true },
      )
      .exec();
  }

  private createSearchQuery(search: string, isOrderList: boolean): any {
    if (!search) {
      return {};
    }

    const fieldsToSearch = [
      'customerName',
      'surName',
      'Address',
      'village',
      'phone',
      'description',
      'invoiceNo',
    ];

    const orderListFieldsToSearch = [
      'orderList.date',
      'orderList.time',
      'orderList.location',
      'orderList.dish',
      'orderList.foodType',
    ];

    if (isOrderList) {
      return {
        $or: orderListFieldsToSearch.map((field) => ({
          [field]: { $regex: search, $options: 'i' },
        })),
      };
    } else {
      return {
        $or: [
          ...fieldsToSearch.map((field) => ({
            [field]: { $regex: search, $options: 'i' },
          })),
          ...orderListFieldsToSearch.map((field) => ({
            [field]: { $regex: search, $options: 'i' },
          })),
        ],
      };
    }
  }
}
