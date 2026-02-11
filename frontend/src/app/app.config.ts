import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { routes } from './app.routes';
import { MessageService } from 'primeng/api';
import { provideHttpClient } from '@angular/common/http';
import { graphqlProvider } from './apollo.confg';




export const appConfig: ApplicationConfig = {
  providers: 
  [graphqlProvider,
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    providePrimeNG({
      theme: {
          preset: Aura
      }
  }), provideAnimationsAsync(), provideHttpClient(), MessageService
]
};
