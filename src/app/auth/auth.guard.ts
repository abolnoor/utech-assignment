import { Injectable } from '@angular/core';
import {
  CanActivate, CanActivateChild, CanLoad,
  Route, UrlSegment, ActivatedRouteSnapshot,
  RouterStateSnapshot, UrlTree, Router, NavigationExtras
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    console.log(next, state);
    let url: string = state.url;

    return this.checkLogin(url, next.data.allowedRoles);
  }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(next, state);
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    let url = `/${route.path}`;

    return this.checkLogin(url, route.data.allowedRoles);
  }

  checkLogin(url: string, roles): boolean {

    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.user) {
      // check if route is restricted by role
      if (roles && ! roles.includes(currentUser.role)) {
        // role not authorised so redirect to home page
        this.router.navigate(['/unauthorized']);
        return false;
      }

      // authorised so return true
      return true;
    }
    this.authService.redirectUrl = url;
    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: url } });
    return false;
  }
}
