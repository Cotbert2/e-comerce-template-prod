import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Mongoose, Schema as MongooseSchema } from 'mongoose';


@Schema()

export class Payment extends Document {
    @Prop({ required: false})
    giftCardNumber: string;

    @Prop({ required: false })
    giftCardAmount: number;

    @Prop({ required: false })
    giftCardStatus: string;


    @Prop({ required: true })
    paymentMethod: string;

    //credit card nullable fields
    @Prop({ required: false })
    creditCardNumber: string;

    @Prop({ required: false })
    creditCardName: string;

    @Prop({ required: false })
    creditCardExpirationDate: string;

    @Prop({ required: false })
    creditCardCVC: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    user: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);