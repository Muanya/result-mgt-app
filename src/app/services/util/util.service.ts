import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor( @Inject(PLATFORM_ID) private platformId: Object,) {}

  public get isBrowser() : boolean {
    return isPlatformBrowser(this.platformId)
  }
  


}
