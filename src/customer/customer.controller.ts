import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Customer } from './customer.schema';
import { UpdateCustomerDto } from './update-customer.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import mongoose from 'mongoose';
@ApiTags('Customers')
@ApiBearerAuth()
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBody({ type: Customer })
  @ApiOperation({ summary: 'Create a new customer' })
  async create(@Req() req: any, @Body() customer: Customer) {
    const userId = req.user.userId;
    await this.customerService.create(customer, userId);
    return { message: 'Customer created successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all customers' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'isOrderList', required: false, type: Boolean })
  async findAll(
    @Req() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('isOrderList') isOrderList?: boolean,
  ) {
    const isSuperAdmin = req.user.role === 'superadmin';
    const userId = req.user.userId;

    return this.customerService.findAll(
      userId,
      page,
      limit,
      search,
      isSuperAdmin,
      isOrderList,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a single customer by id' })
  async findOne(@Param('id') id: string) {
    return this.customerService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a customer' })
  @ApiBody({ type: UpdateCustomerDto })
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateCustomerDto: any,
  ) {
    const userId = req.user.userId;
    await this.customerService.update(id, updateCustomerDto, userId);
    return { message: 'Customer updated successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a customer' })
  async remove(@Param('id') id: string) {
    await this.customerService.remove(id);
    return { message: 'Customer deleted successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('status')
  @ApiOperation({ summary: 'Update Customer status' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        status: { type: 'boolean' },
      },
    },
  })
  async updateStatus(
    @Req() req: any,
    @Body() updateStatusDto: { id: string; status: boolean },
  ) {
    const userId = req.user.userId;
    await this.customerService.updateStatus(updateStatusDto, userId);
    return { message: 'Customer status updated successfully!' };
  }
}
