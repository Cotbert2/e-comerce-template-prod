import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { RegisterCreditCard, RegisterGiftCard } from './graphql/mutations/payments.mutation';
import { GetPaymentMethods } from './graphql/queries/payments.query';





@Injectable({
  providedIn: 'root'
})
export class PaymentsService {


  constructor(
    private apollo: Apollo
  ) { }


  registerGiftCard(data: any) {
    return this.apollo.mutate({
      mutation: RegisterGiftCard,
      variables: {
        data
      }
    });

  }


  registerCard(data: any) {
    return this.apollo.mutate({
      mutation: RegisterCreditCard,
      variables: {
        data
      }
    });
  }


  getUserPaymentMethods(id : string) {
    console.log('id from service', id);
    return this.apollo.query({
      query: GetPaymentMethods,
      variables: {
        id
      }
    });
  }






}
