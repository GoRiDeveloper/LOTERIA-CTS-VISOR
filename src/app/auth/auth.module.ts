import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { ValidateCodeComponent } from './components/validate-code/validate-code.component';
import { PasswordComponent } from './components/password/password.component';
import { OnlyNumbersDirective } from '../directives/only-numbers.directive';


@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    ValidateCodeComponent,
    PasswordComponent,
    OnlyNumbersDirective
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    AuthRoutingModule,
    
  ]
})
export class AuthModule { }
