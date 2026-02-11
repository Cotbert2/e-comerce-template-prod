import { gql } from '@apollo/client/core';

export const Login = gql`
query Login($data: UserInput!){
    login(data: $data){
        id
        name
        email
        phone
    }
}
`;