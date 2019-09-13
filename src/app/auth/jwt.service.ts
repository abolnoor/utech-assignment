import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { mergeMap, switchMap, catchError, filter, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { UserAuth } from '../user-auth';

@Injectable()
export class JwtService implements HttpInterceptor {

  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


    const currentUser = this.authService.currentUserValue;
    const isLoggedIn = currentUser && currentUser.token;
    const isApiUrl = req.url.includes(`/api`) && !req.url.includes(`/api/auth`);
    if (isLoggedIn && isApiUrl) {
      this.tokenSubject.next(currentUser.token);

      return this.tokenSubject
        .pipe(filter(token => token != null),
          take(1),
          switchMap(token => {
            return next.handle(this.addTokenToRequest(req, token));
          }));
    } else if (isApiUrl) {

      this.tokenSubject.next(null);

      return this.authService.getGuest()
        .pipe(
          switchMap((user: UserAuth) => {
            if (user) {
              this.tokenSubject.next(user.token);
              return next.handle(this.addTokenToRequest(req, user.token));
            }

            return this.authService.logout() as Observable<HttpEvent<any>> ;
          })
        );

    }

    return next.handle(req);

    // throw new Error('Method not implemented.');
  }

  private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
  }

}
