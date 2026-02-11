import { gql } from '@apollo/client/core';


export const createCustomer = gql`
mutation CreateCustomer($data: CustomerInput!){
    createCustomer(data: $data)
    {
        id
        name
        phone
        identification
        user
    }
}
`;

export const createSell = gql`
mutation CreateSell($data: SellInput!){
    createSell(sell: $data)
}
`