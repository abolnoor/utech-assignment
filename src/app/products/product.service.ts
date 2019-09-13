import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient, public authService: AuthService, ) { }

  getProducts(params: object): Observable<object> {
    let httpParams;
    if (params) {
      httpParams = new HttpParams();
      Object.keys(params).forEach((key) => {
        httpParams = httpParams.append(key, params[key]);
      });
    }
    const options = {
      params: httpParams ? httpParams : {}
    };
    return this.http.get(`/api/products`, options);

  }

  getProduct(id: number | string) {
    return this.http.get(`/api/products/${id}`);
  }

  getCategories(params?: object): Observable<object> {
    let httpParams;
    if (params) {
      httpParams = new HttpParams();
      Object.keys(params).forEach((key) => {
        httpParams = httpParams.append(key, params[key]);
      });
    }
    const options = {
      params: httpParams ? httpParams : {}
    };
    return this.http.get(`/api/categories`, options);
  }

}
