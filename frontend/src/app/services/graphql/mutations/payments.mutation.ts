import { gql } from '@apollo/client/core';



export const RegisterGiftCard = gql`
mutation registerGiftCard($data : GiftCardResgitrationInput!){
    registerGiftCard(data: $data)
}`

/*
mutation InsertCreditCard {
    insertCreditCard(
        data: 
    )
}

*/

export const RegisterCreditCard = gql`
mutation InsertCreditCard($data : CardInput!){
    insertCreditCard(data: $data)
}
`