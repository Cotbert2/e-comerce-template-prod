import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Mongoose, Schema as MongooseSchema } from 'mongoose';


@Schema()

export class Sell extends Document {
    //addess fields

    @Prop({ required: true })
    address: string;

    @Prop({ required: true })
    zipCode: string;

    @Prop({ required: true })
    contactPhone: string;

    //city
    @Prop({ required: true })
    city: string;

    //payment method
    @Prop({ type : MongooseSchema.Types.ObjectId, ref : 'Payment' })
    paymentMethod: string;

    @Prop({ required: true })
    total: number;

    //products
    @Prop({ type : 
        [{
            product: { type : MongooseSchema.Types.ObjectId, ref : 'Product' },
            quantity: Number
        }]})
    products: {product: string, quantity: number}[];

    //customer
    @Prop({ type : MongooseSchema.Types.ObjectId, ref : 'Customer' })
    customer: string;

    @Prop({ required: true })
    date: Date;

}

export const SellSchema = SchemaFactory.createForClass(Sell);