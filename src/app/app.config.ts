import { ApplicationConfig, inject, PLATFORM_ID, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideNativeDateAdapter } from '@angular/material/core';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { AuthService } from './services/auth/auth.service';
import { isPlatformBrowser } from '@angular/common';


export async function appInitializer(): Promise<any> {
  const platformId = inject(PLATFORM_ID);
  const authService = inject(AuthService);

  console.info("App initializing...", platformId);

  if (isPlatformBrowser(platformId)) {
    console.info('Running initApp in browser');
    return authService.initApp()  
  } else {
    console.info('Skipping initApp on server');
    return Promise.resolve();
  }

}


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideAppInitializer(appInitializer),
    provideNativeDateAdapter()
  ]
};


