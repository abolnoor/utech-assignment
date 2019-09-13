import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ManageProductsComponent } from './manage-products/manage-products.component';
import { ManageCategoriesComponent } from './manage-categories/manage-categories.component';
import { AuthGuard } from '../auth/auth.guard';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ManageRolesComponent } from './manage-roles/manage-roles.component';


const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivateChild: [AuthGuard],
        children: [
          {
            path: 'categories', component: ManageCategoriesComponent
          },
          {
            path: 'products', component: ManageProductsComponent
          },
          {
            path: 'users', component: ManageUsersComponent,
            data: {
              allowedRoles: ['admin']
            }
          },
          {
            path: 'roles', component: ManageRolesComponent,
            data: {
              allowedRoles: ['admin']
            }
          },
          {
            path: '', component: AdminDashboardComponent
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
