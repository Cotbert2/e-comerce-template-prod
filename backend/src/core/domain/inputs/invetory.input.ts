import { Field, Float, InputType } from "@nestjs/graphql";

@InputType('CategoryInput')
export class CategoryInput {
    @Field((type) => String, {nullable: true})
    name : string;

    @Field((type) => String, {nullable: true})
    description : string;
}


@InputType('ProviderInput')
export class ProviderInput {
    @Field((type) => String, {nullable: true})
    name : string;

    @Field((type) => String, {nullable: true})
    email : string;

    @Field((type) => String, {nullable: true})
    phone : string;

    @Field((type) => String, {nullable: true})
    description : string;

    @Field((type) => String, {nullable: true})
    country : string;
}


@InputType('ProductInput')
export class ProductInput {
    @Field((type) => String, {nullable: true})
    name : string;

    @Field((type) => Number, {nullable: true})
    price : number;

    @Field((type) => String, {nullable: true})
    description : string;

    @Field((type) => Number, {nullable: true})
    stock : number;

    @Field((type) => String, {nullable: true})
    category : string;

    @Field((type) => String, {nullable: true})
    provider : string;

    @Field((type) => Number, {nullable: true})
    rating : number;

    @Field((type) => Number, {nullable: true})
    discount : number;

    @Field((type) => String, {nullable: true})
    image : string;
}