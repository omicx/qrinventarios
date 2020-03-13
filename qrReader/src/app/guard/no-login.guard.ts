import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from "@angular/router";
import { map } from "rxjs/operators";
import { AuthenticationService} from '../services/authentication.service';

import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class NoLoginGuard implements CanActivate {

  constructor(
    private router : Router,
    private authService: AuthenticationService
   ){}


    
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      const currentUser = this.authService.isLoggedIn;
      if(currentUser){
        // authorised so return true
        return true;
      }
       // not logged in so redirect to login page with the return url
       this.router.navigate(['/dashboard']);
      return false;
  }

}