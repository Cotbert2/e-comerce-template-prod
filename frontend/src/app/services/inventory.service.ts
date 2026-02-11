import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ProductsQuery,CategoryQuery,ProductsByCategoryQuery } from './graphql/queries/inventory.query';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(

    private apollo: Apollo
  ) { }


  getProducts() {
    return this.apollo.query(
      {
        query: ProductsQuery,
      })
  }

  getCategories() {
    return this.apollo.query(
      {
        query: CategoryQuery,
      })
  }

  getProductsByCategory(category: string) {
    return this.apollo.query(
      {
        query: ProductsByCategoryQuery,
        variables: {
          category
        }
      })
  }
}
