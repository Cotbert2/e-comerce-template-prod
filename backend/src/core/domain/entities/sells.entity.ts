import { Field, ObjectType } from "@nestjs/graphql";
import { Product } from "./inventory.entity";
import { Customer } from "./auth.entity";
import { PaymentMethod } from "./payments.entity";
import { City } from "./country.entity";


@ObjectType()
export class ProductsRequested {
    @Field((type) => Product, {nullable: true})
    product : Product;
    
    @Field((type) => Number, {nullable: true})
    quantity : number;
}


@ObjectType()
export class CityPlace {
    @Field((type) => String, {nullable: true})
    country : string;


    @Field((type) => String, {nullable: true})
    state : string;

    @Field((type) => String, {nullable: true})
    city : string;
}

@ObjectType()
export class SellsEntity {
    @Field((type) => String, {nullable: true})
    id : string;

    @Field((type) => String, {nullable: true})
    address : string;

    @Field((type) => String, {nullable: true})
    zipCode : string;

    @Field((type) => String, {nullable: true})
    contactPhone : string;

    @Field((type) => String, {nullable: true})
    city : String;

    @Field((type) => PaymentMethod, {nullable: true})
    paymentMethod : PaymentMethod;

    @Field((type) => Customer, {nullable: true})
    customer : Customer;

    @Field((type) => [ProductsRequested], {nullable: true})
    products : ProductsRequested[];
}
