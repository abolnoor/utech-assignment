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
    this.getProduct();
  }


  getProduct() {
    this.product$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.productService.getProduct(params.get('id')))
    );


  }
}
