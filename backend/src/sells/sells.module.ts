import { Module } from '@nestjs/common';
import { SellsService } from './sells.service';
import { SellsResolver } from './sells.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Sell, SellSchema } from 'src/core/domain/schemas/sells.schema';
import { Payment, PaymentSchema } from 'src/core/domain/schemas/payments.schema';
import { Category, CategorySchema, Product, ProductSchema, Provider, ProviderSchema } from 'src/core/domain/schemas/invetory.schema';
import { Country, CountrySchema } from 'src/core/domain/schemas/country.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Sell.name, schema: SellSchema }]),
  MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
  MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  MongooseModule.forFeature([{ name: Country.name, schema: CountrySchema }]),
  ],

  providers: [SellsService, SellsResolver]
})
export class SellsModule { }
