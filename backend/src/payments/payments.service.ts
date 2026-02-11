import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Payment } from '../core/domain/schemas/payments.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentsService {
    constructor(
        @InjectModel(Payment.name) private paymentRepository: Model<Payment>,
    ) { }

    public async newPaymentMethods(payment: any, paymentMethod : string) {
        payment.paymentMethod = paymentMethod;
        console.log(payment);
        const newPayment = new this.paymentRepository(payment);
        const mongoResponse = await newPayment.save();
        console.log(mongoResponse);
        if (mongoResponse) return true;
        return false;
    }

    public async createGiftCard(data: any) {
        console.log('data gift card', data);
        const newGiftCard = {
            ...data,
            paymentMethod: 'gift-card',
            giftCardNumber : uuidv4(),
            giftCardStatus : 'not-registered'
        }
        console.log(newGiftCard);
        const mongoResponse = await this.paymentRepository.create(newGiftCard);
        console.log(mongoResponse);
        if (mongoResponse) return true;
        return false;
    }

    public async registerGiftCard(data: any) {
        console.log('data recived to checlk', data)
        const response = await this.paymentRepository.findOneAndUpdate({giftCardNumber: data.giftCardNumber}, {user: data.user, giftCardStatus: 'registered'});
        console.log(response);
        if (response) return true;
        return false
    }


    public async getPaymentMethodsByUserId(userId: string) {
        return await this.paymentRepository.find({ user: userId }).exec();
    }

}


