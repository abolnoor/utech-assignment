import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ProductService } from '../product.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product$: Observable<object>;
  constructor(private http: HttpClient,
              private route: ActivatedRoute,
              private router: Router,
              private productService: ProductService,
  ) { }

  ngOnInit() {
    let jwtToken = window.localStorage.getItem('jwtToken');

    if (!jwtToken) {
      this.login('anonymous@utechmena.com', 'secret')
        .subscribe(
          data => {
            console.log(data);
            jwtToken = data.token;
            window.localStorage.setItem('jwtToken', jwtToken);
            this.getProduct(jwtToken);
          },
          error => {
            console.error(error);
          });
    } else {
      this.getProduct(jwtToken);
    }
  }

  login(email: string, password: string) {
    return this.http.post<any>(`/api/auth`, { email, password });
  }


  getProduct(token: string) {
    this.product$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.productService.getProduct(token, params.get('id')))
    );


  }
}
