import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ProductService } from '../product.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  categories$: Observable<object>;
  constructor(
    private http: HttpClient,
    private productService: ProductService
  ) { }

  ngOnInit() {
    let jwtToken = window.localStorage.getItem('jwtToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    if (!jwtToken) {
      this.login('anonymous@utechmena.com', 'secret')
        .subscribe(
          data => {
            console.log(data);
            jwtToken = data.token;
            window.localStorage.setItem('jwtToken', jwtToken);
            this.getCategories(jwtToken);
          },
          error => {
            console.error(error);
          });
    } else {
      this.getCategories(jwtToken);
    }

  }

  login(email: string, password: string) {
    return this.http.post<any>(`/api/auth`, { email, password });
  }

  getCategories(token: string) {
      this.categories$ = this.productService.getCategories(token, {});


  }

}
