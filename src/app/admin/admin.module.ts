import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';
import { AppMaterialModule } from '../app-material.module';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin/admin.component';
import { ManageProductsComponent, ProductDialogComponent } from './manage-products/manage-products.component';
import { ManageCategoriesComponent, CategoryDialogComponent } from './manage-categories/manage-categories.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ManageUsersComponent, UserDialogComponent } from './manage-users/manage-users.component';
import { ManageRolesComponent, RoleDialogComponent } from './manage-roles/manage-roles.component';

@NgModule({
  declarations: [AdminComponent, AdminDashboardComponent,
    ProductDialogComponent, CategoryDialogComponent, UserDialogComponent, RoleDialogComponent,
    ManageProductsComponent, ManageCategoriesComponent, ManageUsersComponent, ManageRolesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ColorPickerModule,
    AppMaterialModule,
    AdminRoutingModule
  ],
  entryComponents: [
    ProductDialogComponent,
    CategoryDialogComponent,
    UserDialogComponent,
    RoleDialogComponent
  ],
})
export class AdminModule { }
