import { Injectable } from '@angular/core';
import { CanActivate, Route, UrlSegment, ActivatedRouteSnapshot,RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService} from '../services/authentication.service';
import * as firebase from 'firebase/app';

import { isNullOrUndefined } from 'util';
import { map } from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{

  constructor(
    
    private router: Router,
    private authService: AuthenticationService
  ) {}


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      const currentUser = this.authService.isLoggedIn;
      if(currentUser){
        this.router.navigate(['/login']);
        return false;
      }
       // not logged in so redirect to login page with the return url
       //this.router.navigate(['/login']);
      return true;  
  }

}//class
