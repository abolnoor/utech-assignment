import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { CategoryListComponent } from './category-list/category-list.component';

const heroesRoutes: Routes = [
  { path: 'products',  component: ProductListComponent, data: { animation: 'products' } },
  { path: 'product/:id', component: ProductDetailComponent, data: { animation: 'product' } },
  { path: 'categories', component: CategoryListComponent, data: { animation: 'categories' } }
];

@NgModule({
  imports: [RouterModule.forChild(heroesRoutes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
