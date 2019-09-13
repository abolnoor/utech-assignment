import { Component, OnInit, AfterViewInit, Inject, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subject, merge, of as observableOf } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RolesService } from '../roles.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';
import { Role } from 'src/app/role';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-role-dialog',
  templateUrl: 'role-dialog.html',
  styleUrls: ['./role-dialog.scss']
})

export class RoleDialogComponent implements OnInit {
  roleForm: FormGroup;
  role$: Observable<any>;
  constructor(
    private rolesService: RolesService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData) {
    this.roleForm = this.fb.group({
      name: ['', [Validators.required]],
      display_name: ['', [Validators.required]],
      permissions: [[], [Validators.required]],
    });
  }

  ngOnInit() {
    if (this.dialogData.row) {
      this.role$ = this.rolesService.getRole(this.dialogData.row.id);

      this.role$.subscribe(role => {
        role.permissions = role.perms ? role.perms.map(p => p.id) : [];
        delete role.perms;
        this.roleForm.patchValue(role);
      });
    }

  }


}

@Component({
  selector: 'app-manage-roles',
  templateUrl: './manage-roles.component.html',
  styleUrls: ['./manage-roles.component.scss']
})
export class ManageRolesComponent implements AfterViewInit {
  displayedColumns: string[] = ['name', 'display_name', 'status', 'created_at', 'updated_at', '_actions'];
  dataSource: MatTableDataSource<any>;
  permissionList$: Observable<object>;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  search = {
    status: 'active'
  };
  searchChange = new Subject();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private rolesService: RolesService, public dialog: MatDialog) { }

  ngAfterViewInit() {

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page, this.searchChange)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.rolesService.getRoles(
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

    this.permissionList$ = this.rolesService.getPermissions({});
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  onSearchChange(ev) {
    console.log(ev);
    this.searchChange.next(this.search);
  }

  openRoleDialog(row) {
    const dialogRef = this.dialog.open(RoleDialogComponent,
      { data: { row, permissions: this.permissionList$ } }
    );

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: `, result);

      if (result) {
        const value = result.value;
        const role = new Role();
        row = row ? row : {};

        Object.keys(role).forEach(key => {
          if (
            row[key] == value[key] ||
            (
              !row[key] && (!value[key] ||
                (!value[key].length && !value[key].size))
            )
          ) {
            delete role[key];
          } else if (!!value[key]) {
            role[key] = value[key];
          }
        });


        if (row && row.id) {
          role.id = row.id;
          console.log('update', role);
          this.rolesService.updateRole(role).subscribe(data => {
            console.log('updated', data);
            Object.keys(row).forEach(k => {
              row[k] = data[k];
            });
          });
        } else {
          this.rolesService.storeRole(role).subscribe(data => {
            console.log('added', data);

            const dd = this.dataSource.data;
            dd.push(data);
            this.dataSource.data = dd;
          });
        }
      }


    });
  }

  deleteRole(row) {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { title: 'delete confirm', message: `Are you sure you want to delete (${row.name}) role?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

      if (result) {
        this.rolesService.deleteRole(row).subscribe(data => {
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
