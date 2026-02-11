import { gql } from '@apollo/client/core';

export const ProductsQuery = gql`
query Products {
    products {
        id
        name
        price
        description
        stock
        rating
        discount
        image
        category {
            id
            name
            description
        }
        provider {
            id
            name
            email
            phone
            description
            country
        }
    }
}
`;

export const CategoryQuery = gql`
query Categories {
    categories {
        id
        name
        description
    }
}

`;


export const ProductsByCategoryQuery = gql`
query ProductsByCategory($category : String!) {
    productsByCategory(category: $category) {
        id
        name
        price
        description
        stock
        rating
        discount
        image
    }
}
`;