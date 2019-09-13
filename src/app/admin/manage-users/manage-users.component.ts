import { Component, ViewChild, OnInit, AfterViewInit, Inject } from '@angular/core';
import { Observable, Subject, merge, of as observableOf } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UsersService } from '../users.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';
import { User } from 'src/app/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-dialog',
  templateUrl: 'user-dialog.html',
  styleUrls: ['./user-dialog.scss']
})

export class UserDialogComponent implements OnInit {
  userForm: FormGroup;
  user$: Observable<any>;
  constructor(
    private usersService: UsersService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData) {
    this.userForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      mobile_number: [''],
      password: ['', [Validators.required]],
      roles: [[], [Validators.required]],
    });
  }

  ngOnInit() {
    if (this.dialogData.row) {
      this.user$ = this.usersService.getUser(this.dialogData.row.id);

      this.user$.subscribe(user => {
        user.roles = user.roles ? user.roles.map(r => r.id) : [];
        this.userForm.patchValue(user);
      });
    }

  }


}

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements AfterViewInit {
  displayedColumns: string[] = ['first_name', 'last_name', 'email', 'mobile_number', 'status', 'created_at', 'updated_at', '_actions'];
  dataSource: MatTableDataSource<any>;
  roleList$: Observable<object>;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  search = {
    status: 'active'
  };
  searchChange = new Subject();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private usersService: UsersService, public dialog: MatDialog) { }

  ngAfterViewInit() {

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page, this.searchChange)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.usersService.getUsers(
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
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => this.dataSource = new MatTableDataSource(data));

    this.roleList$ = this.usersService.getRoles({ status: 'active' });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  onSearchChange(ev) {
    console.log(ev);
    this.searchChange.next(this.search);
  }

  openUserDialog(row?) {
    const dialogRef = this.dialog.open(UserDialogComponent,
      { data: { row, roles: this.roleList$ } }
    );

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: `, result);

      if (result) {
        const value = result.value;
        const user = new User();
        row = row ? row : {};

        Object.keys(user).forEach(key => {
          if (
            row[key] == value[key] ||
            (
              !row[key] && (!value[key] ||
                (!value[key].length && !value[key].size))
            )
          ) {
            delete user[key];
          } else if (!!value[key]) {
            user[key] = value[key];
          }
        });


        if (row && row.id) {
          user.id = row.id;
          console.log('update', user);
          this.usersService.updateUser(user).subscribe(data => {
            console.log('updated', data);
            Object.keys(row).forEach(k => {
              row[k] = data[k];
            });
          });
        } else {
          this.usersService.storeUser(user).subscribe(data => {
            console.log('added', data);

            const dd = this.dataSource.data;
            dd.push(data);
            this.dataSource.data = dd;
          });
        }
      }


    });
  }

  deleteUser(row) {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { title: 'delete confirm', message: `Are you sure you want to delete (${row.name}) user?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

      if (result) {
        this.usersService.deleteUser(row).subscribe(data => {
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
