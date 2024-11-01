import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { ViewUserComponent } from './pages/view-user/view-user.component';
import { ViewDependenciaDocDescargaComponent } from './pages/view-dependencia-doc-descarga/view-dependencia-doc-descarga.component';

const routes: Routes = [
  {
    path:'',
    component:UserComponent,
    children:[
      {
        path:'ver-usuarios',
        component:ViewUserComponent
      },
      {
        path:'ver-dependencia-documento-descarga',
        component:ViewDependenciaDocDescargaComponent
      },

      {
        path:'**',
        redirectTo:'ver-usuarios'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
