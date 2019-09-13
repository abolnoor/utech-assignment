import { Component, ViewChild, OnInit, AfterViewInit, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, of as observableOf, Subject } from 'rxjs';
import { catchError, map, startWith, switchMap, combineAll } from 'rxjs/operators';

import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';

import { CategoriesService } from '../categories.service';
import { Category } from 'src/app/category';

@Component({
  selector: 'app-category-dialog',
  templateUrl: 'category-dialog.html',
  styleUrls: ['./category-dialog.scss']
})

export class CategoryDialogComponent implements OnInit {
  categoryForm: FormGroup;
  category$: Observable<any>;
  constructor(
    private categoriesService: CategoriesService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['']
    });
  }

  ngOnInit() {
    if (this.dialogData.row) {
      this.category$ = this.categoriesService.getCategory(this.dialogData.row.id);

      this.category$.subscribe(cat => {
        this.categoryForm.patchValue(cat);
      });
    }

  }



  // onSubmit() {
  //   // TODO: Use EventEmitter with form value
  //   console.warn(this.categoryForm.value);
  // }

}

@Component({
  selector: 'app-manage-categories',
  templateUrl: './manage-categories.component.html',
  styleUrls: ['./manage-categories.component.scss']
})

export class ManageCategoriesComponent implements AfterViewInit {

  displayedColumns: string[] = ['name', 'description', 'status', 'created_at', 'updated_at', '_actions'];
  dataSource: MatTableDataSource<any>;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  search = {
    status: 'active'
  };
  searchChange = new Subject();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private categoriesService: CategoriesService, public dialog: MatDialog) { }



  ngAfterViewInit(): void {

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page, this.searchChange)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.categoriesService.getCategories(
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

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  onSearchChange(ev) {
    console.log(ev);
    this.searchChange.next(this.search);
  }

  openCategoryDialog(row?) {
    const dialogRef = this.dialog.open(CategoryDialogComponent,
      { data: { row } }
    );

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: `, result);

      if (result) {
        const value = result.value;
        const category = new Category();
        row = row ? row : {};

        Object.keys(category).forEach(key => {
          if (
            row[key] == value[key] ||
            (
              !row[key] && !value[key]
            )
          ) {
            delete category[key];
          } else if (!!value[key]) {
            category[key] = value[key];
          }
        });


        if (row && row.id) {
          category.id = row.id;
          console.log('update', category);
          this.categoriesService.updateCategory(category).subscribe(data => {
            console.log('updated', data);
            Object.keys(row).forEach(k => {
              row[k] = data[k];
            });
          });
        } else {
          this.categoriesService.storeCategory(category).subscribe(data => {
            console.log('added', data);

            const dd = this.dataSource.data;
            dd.push(data);
            this.dataSource.data = dd;
          });
        }
      }


    });
  }

  deleteCategory(row) {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { title: 'delete confirm', message: `Are you sure you want to delete (${row.name}) category?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

      if (result) {
        this.categoriesService.deleteCategory(row).subscribe(data => {
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
