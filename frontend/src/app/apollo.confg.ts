// import { inject } from '@angular/core';
// // import { provideApolloClient } from '@apollo/client/core/';
// import { ApolloClient, InMemoryCache } from '@apollo/client/core';
// import { HttpLink } from 'apollo-angular/http';

// export const provideGraphqlClient = () => {
//   const httpLink = inject(HttpLink);
//   return new ApolloClient({
//     link: httpLink.create({ uri: 'https://tu-api-graphql.com/graphql' }),
//     cache: new InMemoryCache(),
//   });
// };

import { Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApplicationConfig, inject } from '@angular/core';
import { ApolloClientOptions, DefaultOptions, InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { take, firstValueFrom, throwError } from 'rxjs';


const defaultOptions: DefaultOptions = {
  query: {
    fetchPolicy: 'no-cache', // No almacenar las respuestas de las consultas
  },
  mutate: {
    fetchPolicy: 'no-cache', // No almacenar las respuestas de las mutaciones
  },
};



export function apolloOptionsFactory(): ApolloClientOptions<any> {
  const httpLink = inject(HttpLink);
  return {
    uri: 'http://localhost:3000/graphql',
    //dont save cache
    cache: new InMemoryCache(),
    defaultOptions: defaultOptions,
  };
}

export const graphqlProvider: ApplicationConfig['providers'] = [
  Apollo,
  {
    provide: APOLLO_OPTIONS,
    useFactory: apolloOptionsFactory, // Usar la fábrica de opciones de Apollo
  },
];