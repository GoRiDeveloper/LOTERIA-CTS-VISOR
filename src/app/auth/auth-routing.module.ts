import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './components/login/login.component';
import { ValidateCodeComponent } from './components/validate-code/validate-code.component';
import { PasswordComponent } from './components/password/password.component';

const routes: Routes = [
  {
    path:'',
    component:AuthComponent,
    children:[
      {
        path:'login',
        component:LoginComponent
      },
      {
        path:'codigo-verificacion',
        component:ValidateCodeComponent
      },
      {
        path:'codigo-verificacion',
        component:ValidateCodeComponent
      },
      {
        path:'contrasena',
        component:PasswordComponent
      },
      {
        path:'**',
        redirectTo:'login'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
