import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { StoreService } from 'src/app/store.service';

@Component({
  selector: 'app-view-dependencia-doc-descarga',
  templateUrl: './view-dependencia-doc-descarga.component.html',
  styleUrls: ['./view-dependencia-doc-descarga.component.sass'],
})
export class ViewDependenciaDocDescargaComponent implements OnInit {
  public isLoading: boolean = true;
  public dependenciesDocDonwload: any;
  public pageCurrent: number = 1;
  public pagemax: number = 1;
  public search: string = '';
  public status: string = '0';
  constructor(
    private _userService: UsersService,
    private _store: StoreService
  ) {}

  ngOnInit(): void {
    this.getDependenciaDocDescarga();
  }

  getDependenciaDocDescarga() {
    var filtros = new Map<string, any>();
    filtros.set('page', this.pageCurrent);
    if (this.search.length > 0) filtros.set('search', this.search);
    if (this.status != '0') filtros.set('tipo', this.status);

    this._userService.getAllDependeciesDocDescarga(filtros).subscribe({
      next: (response) => {
        this.dependenciesDocDonwload = response;
        this.pagemax = Math.ceil(this.dependenciesDocDonwload.count / 10);
        this.isLoading = false;
      },
    });
  }

  irPagina(pagina: any) {
    try {
      this.pageCurrent = parseInt(pagina);
      if (this.pageCurrent < 1) {
        this.pageCurrent = 1;
      } else if (this.pageCurrent > this.pagemax) {
        this.pageCurrent = this.pagemax;
      }
      this.getDependenciaDocDescarga();
    } catch (error) {}
  }

  handleBeforePage() {
    this.pageCurrent--;
    this.getDependenciaDocDescarga();
  }

  handleNextPage() {
    this.pageCurrent++;
    this.getDependenciaDocDescarga();
  }

  handleOpenMenu() {
    this._store.handleCanvas(true);
  }
}
