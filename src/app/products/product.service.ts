import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getProducts(token: string, params: object): Observable<object> {
    let httpParams;
    if (params) {
      httpParams = new HttpParams();
      Object.keys(params).forEach((key) => {
        httpParams = httpParams.append(key, params[key]);
      });
    }
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }),
      params: httpParams ? httpParams : {}
    };

    console.log(params, options);
    return this.http.get(`/api/products`, options);
  }

  getProduct(token: string, id: number | string) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      })
    };

    return this.http.get(`/api/products/${id}`, options);
  }

  getCategories(token: string, params: object): Observable<object> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      })
    };
    return this.http.get(`/api/categories`, options);
  }

}
