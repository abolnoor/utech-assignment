import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient) { }

  getCategories(sortBy: string, sortDir: string, pageIndex: number, search: object): Observable<{ data: [], pagination: any }> {
    console.log(sortBy, sortDir, pageIndex, search);
    const href = '/api/categories';
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


  getCategory(id: number | string) {
    const href = `/api/categories/${id}`;
    return this.http.get<any>(href);
  }

  updateCategory(category) {
    const href = `/api/categories/${category.id}`;

    return this.http.put<any>(href, category);
  }

  storeCategory(category) {
    const href = `/api/categories`;

    return this.http.post<any>(href, category);
  }

  deleteCategory(category) {
    const href = `/api/categories/${category.id}`;
    return this.http.delete<any>(href);
  }
}
