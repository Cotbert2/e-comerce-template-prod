import { gql } from '@apollo/client/core';


export const SINGUP = gql`
mutation Singup($data: UserInput!){
    singup(data: $data)
}
`;