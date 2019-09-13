import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getUsers(sortBy: string, sortDir: string, pageIndex: number, search: object): Observable<{ data: [], pagination: any }> {
    console.log(sortBy, sortDir, pageIndex, search);
    const href = '/api/users';
    let httpParams;
    if (search || sortBy) {
      httpParams = new HttpParams();

      Object.keys(search).forEach((key) => {
        httpParams = httpParams.append(key, search[key]);
      });

      httpParams = httpParams.append('sortBy', sortBy);
      if (sortDir) {
        httpParams = httpParams.append('sortDir', sortDir);
      }
      console.log(httpParams);
    }


    const options = {
      params: httpParams ? httpParams : {}
    };



    return this.http.get<any>(href, options);
  }


  getUser(id: number | string) {
    const href = `/api/users/${id}`;
    return this.http.get<any>(href);
  }

  updateUser(user) {
    const href = `/api/users/${user.id}`;

    return this.http.put<any>(href, user);
  }

  storeUser(user) {
    const href = `/api/users`;

    return this.http.post<any>(href, user);
  }

  deleteUser(user) {
    const href = `/api/users/${user.id}`;
    return this.http.delete<any>(href);
  }

  getRoles(search: object): Observable<{ data: [], pagination: any }> {
    console.log(search);
    const href = '/api/roles';
    let httpParams;
    if (search) {
      httpParams = new HttpParams();

      Object.keys(search).forEach((key) => {
        httpParams = httpParams.append(key, search[key]);
      });

      console.log(httpParams);
    }

    const options = {
      params: httpParams ? httpParams : {}
    };

    return this.http.get<any>(href, options);
  }

}
