import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { response } from 'express';
import { Category, Product, Provider } from './../core/domain/schemas/invetory.schema';
import { Payment } from '../core/domain/schemas/payments.schema';

import mongoose, { Model } from 'mongoose';
import { Country } from '../core/domain/schemas/country.schema';
import { Sell } from '../core/domain/schemas/sells.schema';


@Injectable()
export class SellsService {
    constructor(
        @InjectModel(Sell.name) private sellRepository: Model<Sell>,
        @InjectModel(Country.name) private readonly countryModel: Model<Country>,
        @InjectModel(Product.name) private productRepository: Model<Product>,
        @InjectModel(Payment.name) private paymentRepository: Model<Payment>,

    ) { }


    private async getLocationByCityId(cityId: string) {
        return this.countryModel.aggregate([
            { $unwind: "$states" },
            { $unwind: "$states.cities" },
            { $match: { "states.cities._id": new mongoose.Types.ObjectId(cityId) } },
            {
                $project: {
                    _id: 0,
                    country: "$name",
                    state: "$states.name",
                    city: "$states.cities.name"
                }
            }
        ]);
    }

    public async createSell(sell: any) {
        let total = 0;

        //check if all products cuantity is available and update the inventory
        for (let i = 0; i < sell.products.length; i++) {
            const product = sell.products[i];
            if (product.quantity <= 0) {
                console.log('[-] Error procesing sell: quantity is less than 0');
                return false;
            }
            const productData = await this.productRepository.findOne({ _id: product.product });
            if (productData.stock < product.quantity) {
                console.log('[-] Error procesing sell: stock is less than quantity');
                return false;
            }

            total += productData.price * product.quantity;

        }


        //check if the payment method is owned by the customer
        const paymentMethod = await this.paymentRepository.findOne({ _id: sell.paymentMethod });

        // if (!paymentMethod) {
        //     console.log('[-] Error procesing sell: payment method not found');
        //     return false;
        // }


        //check if paymentMethod is a gift card, then check if the gift card is registered, belongs to the customer and has enough balance

        if (paymentMethod.paymentMethod == 'gift-card') {
            if (paymentMethod.giftCardStatus != 'registered') {
                console.log('[-] Error procesing sell: gift card is not registered');
                return false;
            }

            // if (paymentMethod.user != sell.customer) {
            //     console.log('[-] Error procesing sell: gift card does not belong to the customer');
            //     return false;
            // }

            if (paymentMethod.giftCardAmount < total) {
                console.log('[-] Error procesing sell: gift card balance is less than total');
                return false;
            }
        }



        // if (paymentMethod.customer != sell.customer) {
        //     console.log('')
        //     console.log('[-] Error procesing sell: payment method does not belong to the customer');
        //     return false;
        // }

        console.log('payment method found');









        //update the inventory

        for (let i = 0; i < sell.products.length; i++) {
            const product = sell.products[i];
            const productData = await this.productRepository.findOne({ _id: product.product });
            productData.stock = productData.stock - product.quantity;
            await productData.save();
        }


        const dataToSave = {
            ...sell,
            total,
            date: new Date(),
        }

        console.log(dataToSave);
        const newSell = new this.sellRepository(dataToSave);
        const mongoResponse = await newSell.save();
        console.log(mongoResponse);
        if (mongoResponse) return true;
        return false;
    }


    public async getSellByCustomerId(customerId: string) {
        const response = await this.sellRepository.find({ customer: customerId })
            .populate('customer')
            .populate('paymentMethod')
            .populate('products.product')
            .exec();


        return response;

    }
}
