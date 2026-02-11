import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ProductsQuery } from './graphql/queries/inventory.query';
import { createCustomer, createSell } from './graphql/mutations/shipping.mutation';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {

  constructor(

    private apollo: Apollo
  ) { }


  createCustomer(data: any) {
    return this.apollo.mutate({
      mutation: createCustomer,
      variables: {
        data
      }
    });
  }


  generateShipping(data: any) {
    return this.apollo.mutate({
      mutation: createSell,
      variables: {
        data
      }
    });
  }



}
