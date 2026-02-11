import { Field, InputType } from "@nestjs/graphql";

@InputType('CountryInput')
export class CountryInput {
    @Field((type) => String, {nullable: true})
    name : string;

    @Field((type) => [StateInput], {nullable: true})
    states : StateInput[];
}


@InputType('StateInput')
export class StateInput {
    @Field((type) => String, {nullable: true})
    name : string;

    @Field((type) => [CityInput], {nullable: true})
    cities : CityInput[];
}

@InputType('CityInput')
export class CityInput {
    @Field((type) => String, {nullable: true})
    name : string;
}