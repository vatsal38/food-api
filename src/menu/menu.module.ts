import { CategoryModule } from '../category/category.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { Menu, MenuSchema } from './menu.schema';
import { MenuRepository } from './menu.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Menu.name, schema: MenuSchema }]),
    CategoryModule,
  ],
  controllers: [MenuController],
  providers: [MenuService, MenuRepository],
})
export class MenuModule {}
