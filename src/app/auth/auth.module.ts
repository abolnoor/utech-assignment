import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../app-material.module';
import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  declarations: [ LoginComponent ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppMaterialModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
