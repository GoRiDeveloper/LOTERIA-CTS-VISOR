import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarTopAdminComponent } from './navbar-top-admin/navbar-top-admin.component';
import { SidebarAdminComponent } from './sidebar-admin/sidebar-admin.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { SidebarPdfComponent } from './sidebar-pdf/sidebar-pdf.component';
import { TreeModule } from 'primeng/tree';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { ChartModule } from 'primeng/chart';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { ViewFilesUploadComponent } from '../dashboard/modules/home/pages/view-files-upload/view-files-upload.component';

@NgModule({
  declarations: [
    SidebarComponent,
    SidebarAdminComponent,
    NavbarComponent,
    NavbarTopAdminComponent,
    SidebarPdfComponent,
    BreadcrumbComponent,
    ViewFilesUploadComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    TreeModule,
    ButtonModule,
    ListboxModule,
    ChartModule,
    ProgressSpinnerModule,
    TableModule,
    InputTextModule,
    FileUploadModule,
    DropdownModule,
  ],
  exports: [
    NavbarComponent,
    SidebarComponent,
    NavbarTopAdminComponent,
    SidebarAdminComponent,
    BreadcrumbComponent,
    SidebarPdfComponent,
    TreeModule,
    ButtonModule,
    ListboxModule,
    ChartModule,
    ProgressSpinnerModule,
    TableModule,
    InputTextModule,
    FileUploadModule,
    DropdownModule,
  ],
})
export class SharedModule {}
