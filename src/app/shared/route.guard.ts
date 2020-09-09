import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class RouteGuard implements CanActivate {

  constructor(private authService : AuthService, private router : Router, private activatedRoute : ActivatedRoute) {

  }

  canActivate(): boolean {
    
      if (!this.authService.isHouseMember) {
        return true;
      }
      return false;

  }
  
}
