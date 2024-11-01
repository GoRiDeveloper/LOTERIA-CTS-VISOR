import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class UsersGuard implements CanActivate, CanLoad {
  constructor(private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let bytes = CryptoJS.AES.decrypt(
      localStorage.getItem('data') || '',
      localStorage.getItem('token') || ''
    );
    let user =
      bytes.sigBytes > 0
        ? JSON.parse(bytes?.toString(CryptoJS.enc.Utf8) || '')
        : '';
    if (
      (localStorage.getItem('token') || '') == '' ||
      (localStorage.getItem('token') || '') == undefined
    ) {
      this.router.parseUrl('./auth');
      return false;
    }
    if (user.rol != 1) {
      this.router.parseUrl('./auth');
      return false;
    }

    return true;
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let bytes = CryptoJS.AES.decrypt(
      localStorage.getItem('data') || '',
      localStorage.getItem('token') || ''
    );
    let user =
      bytes.sigBytes > 0
        ? JSON.parse(bytes?.toString(CryptoJS.enc.Utf8) || '')
        : '';
    if (
      (localStorage.getItem('token') || '') == '' ||
      (localStorage.getItem('token') || '') == undefined
    ) {
      this.router.parseUrl('./auth');
      return false;
    }
    if (user.rol != 1) {
      this.router.parseUrl('./auth');
      return false;
    }

    return true;
  }
}
