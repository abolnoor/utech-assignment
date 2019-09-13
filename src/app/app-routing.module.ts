import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuard } from './auth/auth.guard';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { HomeComponent } from './home/home.component';


const appRoutes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(mod => mod.AdminModule),
    canLoad: [AuthGuard],
    data: {
      allowedRoles: ['admin', 'user']
    }
  },
  // { path: '',   redirectTo: '/products', pathMatch: 'full' },
  { path: '', component: HomeComponent },
  { path: 'unauthorized', component: AccessDeniedComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
