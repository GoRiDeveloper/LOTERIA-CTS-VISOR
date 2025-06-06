import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { MenuHomeComponent } from './pages/menu-home/menu-home.component';
import { DirectionAdminFinanceComponent } from './pages/direction-admin-finance/direction-admin-finance.component';
import { GerenciaTesoreriaComponent } from './pages/gerencia-tesoreria/gerencia-tesoreria.component';
import { ViewFilesUploadComponent } from './pages/view-files-upload/view-files-upload.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'menu',
        component: MenuHomeComponent,
      },

      {
        path: 'carpetas/:id',
        component: DirectionAdminFinanceComponent,
      },
      {
        path: 'documentos/:id',
        component: GerenciaTesoreriaComponent,
      },
      {
        path: 'view-files-upload',
        component: ViewFilesUploadComponent,
      },
      {
        path: '**',
        redirectTo: 'menu',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
