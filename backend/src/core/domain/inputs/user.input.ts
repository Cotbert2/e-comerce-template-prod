import { Field, InputType } from "@nestjs/graphql";


@InputType('UserInput')
export class UserInput {
    @Field((type) => String, {nullable: true})
    name : string;

    @Field((type) => String, {nullable: true})
    email : string;

    @Field((type) => String, {nullable: true})
    password : string;

    @Field((type) => String, {nullable: true})
    phone : string;

    @Field((type) => String, {nullable: true})
    role : string;

}


@InputType('CustomerInput')
export class CustomerInput {
    @Field((type) => String, {nullable: true})
    name : string;

    @Field((type) => String, {nullable: true})
    phone : string;

    @Field((type) => String, {nullable: true})
    identification : string;

    @Field((type) => String, {nullable: true})
    user : string;

}