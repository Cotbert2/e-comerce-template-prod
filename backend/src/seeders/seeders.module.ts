import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeederService } from './seeders.service';
import { UserSchema, CustomerSchema } from '../core/domain/schemas/user.schema';
import { CountrySchema } from '../core/domain/schemas/country.schema';
import { CategorySchema, ProviderSchema, ProductSchema } from '../core/domain/schemas/invetory.schema';
import { PaymentSchema } from '../core/domain/schemas/payments.schema';
import { SellSchema } from '../core/domain/schemas/sells.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Customer', schema: CustomerSchema },
      { name: 'Country', schema: CountrySchema },
      { name: 'Category', schema: CategorySchema },
      { name: 'Provider', schema: ProviderSchema },
      { name: 'Product', schema: ProductSchema },
      { name: 'Payment', schema: PaymentSchema },
      { name: 'Sell', schema: SellSchema },
    ]),
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeedersModule {}
