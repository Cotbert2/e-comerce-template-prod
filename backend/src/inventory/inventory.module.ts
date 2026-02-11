import { Module } from '@nestjs/common';
import { CategoryService, ProductsService, ProviderService } from './inventory.service';
import { InventoryResolver } from './inventory.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema, Product, ProductSchema, Provider, ProviderSchema } from 'src/core/domain/schemas/invetory.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name : Category.name, schema : CategorySchema}]),
    MongooseModule.forFeature([{ name : Provider.name, schema : ProviderSchema}]),
    MongooseModule.forFeature([{ name : Product.name, schema : ProductSchema}]),
  ],
  providers: [ CategoryService, InventoryResolver,ProviderService, ProductsService]
})
export class InventoryModule {}
