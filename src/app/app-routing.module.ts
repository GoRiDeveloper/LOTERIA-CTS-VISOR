import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardGuard } from './guards/dashboard.guard';
import { UsersGuard } from './guards/users.guard';
import { ValidateEmailComponent } from './shared/validate-email/validate-email/validate-email.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'user',
    loadChildren: () => import('./admin/modules/user/user.module').then(m => m.UserModule),
    canLoad:[UsersGuard],
    canActivate:[UsersGuard]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canLoad:[DashboardGuard],
    canActivate:[DashboardGuard]
  },
  {
    path: 'validarcorreo/:codigo', 
    component:ValidateEmailComponent
  },
  {
    path:'**',
    redirectTo:'auth'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
