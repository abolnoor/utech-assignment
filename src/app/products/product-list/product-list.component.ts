import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ProductService } from '../product.service';
import { ParamMap, ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products$: Observable<object>;
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
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
            this.getProducts(jwtToken);
          },
          error => {
            console.error(error);
          });
    } else {
      this.getProducts(jwtToken);
    }

  }

  login(email: string, password: string) {
    return this.http.post<any>(`/api/auth`, { email, password });
  }

  getProducts(token: string) {
      this.products$ = this.route.queryParams.pipe(
        switchMap(params => {
          let p = params.cat ? { categories_name: params.cat } : {};
          return this.productService.getProducts(token, p);
        })
      );


  }

}
