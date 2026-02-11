import { Injectable } from '@angular/core';
import { SINGUP } from './graphql/mutations/autho.mutation';
import { Login } from './graphql/queries/auth.query';
import { Apollo } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {



  constructor(

    private apollo: Apollo
  ) { }


  singup(data: any) {
    return this.apollo.mutate({
      mutation: SINGUP,
      variables: {
        data
      }
    });
  }


  login(data : any){
    return this.apollo.query(
      {
        query: Login,
        variables: {
          data
        }
      }
    )
  } 
}
