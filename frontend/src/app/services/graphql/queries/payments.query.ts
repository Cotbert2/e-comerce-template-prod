import { gql } from '@apollo/client/core';

export const GetPaymentMethods = gql`
query PaymentMethods($id: String!){
    paymentMethods(id: $id) {
        id
        giftCardNumber
        giftCardAmount
        paymentMethod
        creditCardNumber
        creditCardName
        creditCardExpirationDate
        creditCardCVC
        user
        giftCardStatus
    }
}
`