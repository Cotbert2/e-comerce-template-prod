import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class RegisterUser {
    @Field((type) => String, {nullable: true})
    id : string;

    @Field((type) => String, {nullable: true})
    name : string;

    @Field((type) => String, {nullable: true})
    email : string;

    @Field((type) => String, {nullable: true})
    password : string;

    @Field((type) => String, {nullable: true})
    phone : string;

}

@ObjectType()
export class Customer{

    @Field((type) => String, {nullable: true})
    id : string;
    
    @Field((type) => String, {nullable: true})
    name : string;

    @Field((type) => String, {nullable: true})
    phone : string;

    @Field((type) => String, {nullable: true})
    identification : string;

    @Field((type) => String, {nullable: true})
    user : RegisterUser;
}

@ObjectType()

export class User {
    @Field((type) => String, {nullable: true})
    id : string;

    @Field((type) => String, {nullable: true})
    name : string;

    @Field((type) => String, {nullable: true})
    email : string;

    @Field((type) => String, {nullable: true})
    phone : string;
}