import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { AppMaterialModule } from '../modules/app-material.module';

import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { CategoryListComponent } from './category-list/category-list.component';

@NgModule({
  declarations: [ProductListComponent, ProductDetailComponent, CategoryListComponent],
  imports: [
    CommonModule,
    AppMaterialModule,
    ProductsRoutingModule
  ]
})
export class ProductsModule { }
