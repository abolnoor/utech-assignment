import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private http: HttpClient) { }

  getRoles(sortBy: string, sortDir: string, pageIndex: number, search: object): Observable<{ data: [], pagination: any }> {
    console.log(sortBy, sortDir, pageIndex, search);
    const href = '/api/roles';
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


  getRole(id: number | string) {
    const href = `/api/roles/${id}`;
    return this.http.get<any>(href);
  }

  updateRole(role) {
    const href = `/api/roles/${role.id}`;

    return this.http.put<any>(href, role);
  }

  storeRole(role) {
    const href = `/api/roles`;

    return this.http.post<any>(href, role);
  }

  deleteRole(role) {
    const href = `/api/roles/${role.id}`;
    return this.http.delete<any>(href);
  }

  getPermissions(search: object): Observable<{ data: [], pagination: any }> {
    console.log(search);
    const href = '/api/permissions';
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
