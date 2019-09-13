import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  categories$: Observable<object>;
  loading = false;
  constructor(
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.getCategories();
  }

  getCategories() {
    this.loading = true;
    const p: any = { status: 'active' };
    // this.categories$ = this.productService.getCategories(p);

    this.categories$ = this.productService.getCategories(p);
    this.categories$.subscribe(
      () => { this.loading = false; },
      () => { this.loading = false; }
    );

  }

}
