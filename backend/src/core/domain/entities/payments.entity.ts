import { Field, ObjectType } from "@nestjs/graphql";


@ObjectType()
export class PaymentMethod{

    @Field((type) => String, {nullable: true})
    id : string

    @Field((type) => String, {nullable: true})
    giftCardNumber : string;

    @Field((type) => Number, {nullable: true})
    giftCardAmount : number;

    @Field((type) => String, {nullable: true})
    paymentMethod : string;

    @Field((type) => String, {nullable: true})
    creditCardNumber : string;

    @Field((type) => String, {nullable: true})
    creditCardName : string;

    @Field((type) => String, {nullable: true})
    creditCardExpirationDate : string;

    @Field((type) => String, {nullable: true})
    creditCardCVC : string;

    @Field((type) => String, {nullable: true})
    user : string;

    @Field((type) => String, {nullable: true})
    giftCardStatus : string;

}
