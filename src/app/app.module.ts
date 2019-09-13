import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';

import { AppMaterialModule } from './app-material.module';

import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HeaderComponent } from './header/header.component';
import { JwtService } from './auth/jwt.service';
import { ErrorInterceptService } from './auth/error-intercept.service';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';



@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    HeaderComponent,
    AccessDeniedComponent,
    HomeComponent,
    ConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppMaterialModule,
    ProductsModule,
    AuthModule,
    AppRoutingModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptService, multi: true },
],
entryComponents: [
  ConfirmDialogComponent
],
  bootstrap: [AppComponent]
})
export class AppModule { }
