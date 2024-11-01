import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ViewUserComponent } from './pages/view-user/view-user.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewDependenciaDocDescargaComponent } from './pages/view-dependencia-doc-descarga/view-dependencia-doc-descarga.component';
import { TreeViewComponent } from 'src/app/shared/tree-view/tree-view.component';

@NgModule({
  declarations: [
    UserComponent,
    ViewUserComponent,
    ViewDependenciaDocDescargaComponent,
    TreeViewComponent,
  ],
  providers: [],
  imports: [
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    NgbModule,
    FormsModule,
  ],
})
export class UserModule {}
