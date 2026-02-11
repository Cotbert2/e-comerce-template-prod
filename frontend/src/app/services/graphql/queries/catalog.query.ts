import { gql } from '@apollo/client/core';

export const CountryQuery = gql`
query Countries {
    countries {
        id
        name
        states {
            id
            name
            cities {
                id
                name
            }
        }
    }
}`;