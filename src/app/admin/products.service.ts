import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  getProducts(sortBy: string, sortDir: string, pageIndex: number, search: object): Observable<{ data: [], pagination: any }> {
    console.log(sortBy, sortDir, pageIndex, search);
    const href = '/api/products';
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


  getProduct(id: number | string) {
    const href = `/api/products/${id}`;
    return this.http.get<any>(href);
  }

  updateProduct(product) {
    const href = `/api/products/${product.id}`;
    if (product.image) {
    const formData: FormData = new FormData();
    formData.append('id', product.id);
    formData.append('image', product.image);
    this.http.put<any>(href, formData).subscribe(res => console.log(res));
    delete product.image;
  }
    // Object.keys(product).forEach(key => {
    //   formData.append(key, product[key]);
    // });
    return this.http.put<any>(href, product);
  }

  storeProduct(product) {
    const href = `/api/products`;

    // const formData: FormData = new FormData();

    // Object.keys(product).forEach(key => {
    //   formData.append(key, product[key]);
    // });
    return this.http.post<any>(href, product);
  }

  deleteProduct(product) {
    const href = `/api/products/${product.id}`;
    return this.http.delete<any>(href);
  }

}
