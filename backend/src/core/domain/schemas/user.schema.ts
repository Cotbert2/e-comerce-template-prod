import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Mongoose, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class User extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    role: string;
}

@Schema()

export class Customer extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    phone: string;

    //identification should be unique
    @Prop({ required: true, unique: true })
    identification: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    user: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
export const CustomerSchema = SchemaFactory.createForClass(Customer);