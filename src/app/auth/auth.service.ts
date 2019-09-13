import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap, delay, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UserAuth } from '../user-auth';
import { environment } from 'src/environments/environment';
import { RoleTypes } from '../role.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<UserAuth>;
  public currentUser: Observable<UserAuth>;


  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<UserAuth>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }
  public get currentUserValue(): UserAuth {
    return this.currentUserSubject.value;
  }

  redirectUrl: string;

  login(email: string, password: string) {
    return this.http.post<any>(`/api/auth`, { email, password })
      .pipe(map(userAuth => {
        // login successful if there's a jwt token in the response
        if (userAuth && userAuth.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          userAuth.role = userAuth.user.roles[0].name;
          if (userAuth.role !== RoleTypes.Admin && userAuth.role !== RoleTypes.User) {
            userAuth.role = RoleTypes.Guest;
            userAuth.user = null;
          }
          localStorage.setItem('currentUser', JSON.stringify(userAuth));
          this.currentUserSubject.next(userAuth);
        }

        console.log(userAuth);
        return userAuth;
      }));
  }

  getGuest() {
    return this.login('anonymous@utechmena.com', 'secret');
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    return new Observable();
  }
}
