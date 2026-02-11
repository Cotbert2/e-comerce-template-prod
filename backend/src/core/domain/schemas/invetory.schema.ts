import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Mongoose, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Category extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

@Schema()
export class Provider extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    country: string;
}

export const ProviderSchema = SchemaFactory.createForClass(Provider);

@Schema()

export class Product extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    stock: number;

    @Prop({ type : MongooseSchema.Types.ObjectId, ref : 'Category' })
    category: string;

    @Prop({ type : MongooseSchema.Types.ObjectId, ref : 'Provider' })
    provider: string;

    @Prop({ required: true })
    rating: number;

    @Prop({ required: true })
    discount: number;

    @Prop({ required: true })
    image: string;
}


export const ProductSchema = SchemaFactory.createForClass(Product);