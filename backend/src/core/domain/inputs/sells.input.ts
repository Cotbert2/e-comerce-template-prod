import { Field, InputType } from "@nestjs/graphql";

@InputType('ProductInputSell')
export class ProductInputSell {
    @Field()
    product: string;

    @Field()
    quantity: number;
}

@InputType('SellInput')
export class SellInput {
    @Field()
    address: string;

    @Field()
    zipCode: string;

    @Field()
    contactPhone: string;

    @Field()
    city: string;

    @Field()
    paymentMethod: string;

    @Field(() => [ProductInputSell])
    products: ProductInputSell[];

    @Field()
    customer: string;

}


