import { Field, ObjectType } from "@nestjs/graphql";


@ObjectType()
export class City {

    @Field((type) => String, {nullable: true})
    id: string;

    @Field((type) => String, {nullable: true})
    name: string;
}

@ObjectType()
export class State {

    @Field((type) => String, {nullable: true})
    id: string;

    @Field((type) => String, {nullable: true})
    name: string;

    @Field((type) => [City], {nullable: true})
    cities: City[];
}

@ObjectType()
export class Country {

    @Field((type) => String, {nullable: true})
    id: string;

    @Field((type) => String, {nullable: true})
    name: string;

    @Field((type) => [State], {nullable: true})
    states: State[];
}
