import { Field, Float, InputType } from "@nestjs/graphql";


@InputType('CardInput')
export class CardInput {
    @Field((type) => String, {nullable: true})
    creditCardName : string;

    @Field((type) => String, {nullable: true})
    creditCardNumber : string;

    @Field((type) => String, {nullable: true})
    creditCardExpirationDate : string;

    @Field((type) => String, {nullable: true})
    creditCardCVC : string;

    @Field((type) => String, {nullable: true})
    user : string;
}

@InputType('GiftCardCreationInput')

export class GiftCardCreationInput {
    @Field((type) => Float, {nullable: true})
    giftCardAmount : number;

}

@InputType('GiftCardResgitrationInput')

export class GiftCardResgitrationInput {
    @Field((type) => String, {nullable: true})
    giftCardNumber : string;

    @Field((type) => String, {nullable: true})
    user : string;

}
