import { Field, ObjectType } from "@nestjs/graphql";


@ObjectType()
export class Category {

    @Field((type) => String, {nullable: true})
    id: string;

    @Field((type) => String, {nullable: true})
    name: string;

    @Field((type) => String, {nullable: true})
    description: string;
}

@ObjectType()
export class Provider {

    @Field((type) => String, {nullable: true})
    id: string;

    @Field((type) => String, {nullable: true})
    name: string;

    @Field((type) => String, {nullable: true})
    email: string;

    @Field((type) => String, {nullable: true})
    phone: string;

    @Field((type) => String, {nullable: true})
    description: string;

    @Field((type) => String, {nullable: true})
    country: string;
}


@ObjectType()
export class Product {

    @Field((type) => String, {nullable: true})
    id: string;

    @Field((type) => String, {nullable: true})
    name: string;

    @Field((type) => Number, {nullable: true})
    price: number;

    @Field((type) => String, {nullable: true})
    description: string;

    @Field((type) => Number, {nullable: true})
    stock: number;

    @Field((type) => Category, {nullable: true})
    category: Category;

    @Field((type) => Provider, {nullable: true})
    provider: Provider;

    @Field((type) => Number, {nullable: true})
    rating: number;

    @Field((type) => Number, {nullable: true})
    discount: number;

    @Field((type) => String, {nullable: true})
    image: string;
}
