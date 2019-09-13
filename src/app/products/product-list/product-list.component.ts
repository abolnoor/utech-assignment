import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ProductService } from '../product.service';
import { ParamMap, ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products$: Observable<object>;
  catName: string;
  loading = false;
  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.loading = true;
    this.products$ = this.route.queryParams.pipe(
      switchMap(params => {
        const p: any = { status: 'active' };
        if (params.cat) {
          setTimeout(() => {
            this.catName = params.cat;
          }, 300);
          p.categories_name = params.cat;
        } else {
          this.catName = '';
        }
        const obs = this.productService.getProducts(p);
        obs.subscribe(
          () => { this.loading = false; },
          () => { this.loading = false; }
        )
        return obs;
      })
    );
  }

}
