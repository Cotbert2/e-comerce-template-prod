import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { createCustomer } from './graphql/mutations/shipping.mutation';
import { CountryQuery } from './graphql/queries/catalog.query';


@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  constructor(

    private apollo: Apollo
  ) { }

  getCountryCatalog() {
    return this.apollo.query(
      {
        query: CountryQuery,
      })
  }
}
