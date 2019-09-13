import { Component, ViewChild, OnInit, AfterViewInit, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, of as observableOf, Subject } from 'rxjs';
import { catchError, map, startWith, switchMap, combineAll } from 'rxjs/operators';
import { ProductsService } from '../products.service';
import { ProductService } from 'src/app/products/product.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/product';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-product-dialog',
  templateUrl: 'product-dialog.html',
  styleUrls: ['./product-dialog.scss']
})

export class ProductDialogComponent implements OnInit {
  productForm: FormGroup;
  product$: Observable<any>;
  constructor(
    private productsService: ProductsService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      color: [''],
      weight: ['', [Validators.required]],
      code: ['', [Validators.required]],
      image: [],
      categories: [[], [Validators.required]],
    });
  }

  ngOnInit() {
    if (this.dialogData.row) {
      this.product$ = this.productsService.getProduct(this.dialogData.row.id);

      this.product$.subscribe(prod => {
        prod.categories = prod.categories ? prod.categories.map(c => c.id) : [];
        this.productForm.patchValue(prod);
      });
    }

  }

  changeColor(ev) {
    console.log(ev);
    this.productForm.patchValue({ color: ev });
  }


  // onSubmit() {
  //   // TODO: Use EventEmitter with form value
  //   console.warn(this.productForm.value);
  // }

}


@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.scss']
})
export class ManageProductsComponent implements AfterViewInit {
  displayedColumns: string[] = ['name', 'description', 'color', 'weight', 'code', 'status', 'created_at', 'updated_at', '_actions'];
  dataSource: MatTableDataSource<any>;
  categoryList$: Observable<object>;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  search = {
    status: 'active'
  };
  searchChange = new Subject();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private productsService: ProductsService, private productService: ProductService, public dialog: MatDialog) { }

  ngAfterViewInit() {

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page, this.searchChange)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.productsService.getProducts(
            this.sort.active, this.sort.direction, this.paginator.pageIndex, this.search);
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.pagination.total_count;

          return data.data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => this.dataSource = new MatTableDataSource(data));

    this.categoryList$ = this.productService.getCategories();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  onSearchChange(ev) {
    console.log(ev);
    this.searchChange.next(this.search);
  }

  openProductDialog(row?) {
    const dialogRef = this.dialog.open(ProductDialogComponent,
      { data: { row, cats: this.categoryList$ } }
    );

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: `, result);

      if (result) {
        const value = result.value;
        const product = new Product();
        row = row ? row : {};

        Object.keys(product).forEach(key => {
          if (
            row[key] == value[key] ||
            (
              !row[key] && (!value[key] ||
                (!value[key].length && !value[key].size))
            )
          ) {
            delete product[key];
          } else if (!!value[key]) {
            product[key] = value[key];
          }
        });


        if (row && row.id) {
          product.id = row.id;
          console.log('update', product);
          this.productsService.updateProduct(product).subscribe(data => {
            console.log('updated', data);
            Object.keys(row).forEach(k => {
              row[k] = data[k];
            });
          });
        } else {
          this.productsService.storeProduct(product).subscribe(data => {
            console.log('added', data);

            const dd = this.dataSource.data;
            dd.push(data);
            this.dataSource.data = dd;
          });
        }
      }


    });
  }

  deleteProduct(row) {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { title: 'delete confirm', message: `Are you sure you want to delete (${row.name}) product?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

      if (result) {
        this.productsService.deleteProduct(row).subscribe(data => {
          console.log('deleted', data);
          const dd = this.dataSource.data;
          const index = dd.indexOf(row);
          if (index !== -1) {
            dd.splice(index, 1);
            this.dataSource.data = dd;
          }

        });
      }
    });



  }
}
