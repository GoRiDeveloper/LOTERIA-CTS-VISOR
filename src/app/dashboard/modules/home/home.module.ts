import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MenuHomeComponent } from './pages/menu-home/menu-home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DirectionAdminFinanceComponent } from './pages/direction-admin-finance/direction-admin-finance.component';
import { GerenciaTesoreriaComponent } from './pages/gerencia-tesoreria/gerencia-tesoreria.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { SearchFileModalComponent } from './components/Direction-admin-finance/search-file-modal/search-file-modal.component';
import { ViewFilePdfComponent } from './components/Direction-admin-finance/view-file-pdf/view-file-pdf.component';
import { AddFileModalComponent } from './components/Gerencia-tesoreria/add-file-modal/add-file-modal.component';
import { FormAddDependencieComponent } from './components/Direction-admin-finance/form-add-dependencie/form-add-dependencie.component';
import { FormAddTableComponent } from './components/Direction-admin-finance/form-add-table/form-add-table.component';
import { FormAddSheetComponent } from './components/Direction-admin-finance/form-add-sheet/form-add-sheet.component';

@NgModule({
  declarations: [
    HomeComponent,
    MenuHomeComponent,
    DirectionAdminFinanceComponent,
    GerenciaTesoreriaComponent,
    SearchFileModalComponent,
    ViewFilePdfComponent,
    AddFileModalComponent,
    FormAddDependencieComponent,
    FormAddTableComponent,
    FormAddSheetComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    NgbModule,
    NgxExtendedPdfViewerModule,
  ],
})
export class HomeModule {}
