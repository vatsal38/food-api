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
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Order } from './order.schema';
import { UpdateOrderDto } from './update-order.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          categoryId: { type: 'string' },
          subCategoryId: { type: 'array', items: { type: 'string' } },
        },
      },
    },
  })
  async create(@Req() req: any, @Body() order: any) {
    const userId = req.user.userId;
    await Promise.all(
      order.map((orderDto: any) => this.orderService.create(orderDto, userId)),
    );
    return { message: 'Order created successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  async findAll(
    @Req() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    const isSuperAdmin = req.user.role === 'superadmin';
    const userId = req.user.userId;
    return this.orderService.findAll(userId, page, limit, search, isSuperAdmin);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a single order by id' })
  async findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a order' })
  @ApiBody({ type: UpdateOrderDto })
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    const userId = req.user.userId;
    await this.orderService.update(id, updateOrderDto, userId);
    return { message: 'Order updated successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a order' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.orderService.remove(id);
    return { message: 'Order deleted successfully!' };
  }
}
