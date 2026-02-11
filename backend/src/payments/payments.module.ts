import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsResolver } from './payments.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from 'src/core/domain/schemas/payments.schema';

@Module({
  imports : [
    MongooseModule.forFeature([{ name : Payment.name, schema : PaymentSchema}]),
  ],
  providers: [PaymentsService, PaymentsResolver]
})
export class PaymentsModule {}
