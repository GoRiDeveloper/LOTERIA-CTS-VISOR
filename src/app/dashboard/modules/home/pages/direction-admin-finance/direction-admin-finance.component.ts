import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DirectoriosServicesService } from 'src/app/services/directorios-services.service';
import * as CryptoJS from 'crypto-js';
import {
  dependencyStructure,
  Result,
} from 'src/app/interfaces/dependencyStructure.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { CurrentRoute } from 'src/app/interfaces/currentRoute.interface';

@Component({
  selector: 'app-direction-admin-finance',
  templateUrl: './direction-admin-finance.component.html',
  styleUrls: ['./direction-admin-finance.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DirectionAdminFinanceComponent implements OnInit {
  @ViewChild('SearchFileModal') searchFileModal!: TemplateRef<any>;

  public subDependencies: any;
  public idSuperior: string = '';
  public subDependecyName: string = '';
  public filterDependeciesName: any[] = [];
  public archivosVarios: boolean = false;
  public archivosVariosURL?: number;
  public user_rol?: number;
  userData: any;
  public user_id_localStorage: any;
  public currentRoute: CurrentRoute | null = null;

  public idsArray?: number[];
  public indiceDependencia?: string;

  public src: string = '';
  public isLoading: boolean = true;
  public searchValue: string = '';
  public rutasData: any = [];
  public dependenciaIndiceLongitud?: string;
  public dependenciaSuperior?: string;
  public typeView: boolean = true;
  public dependencyStructure?: dependencyStructure[];
  public valuesTable!: Result[];
  public noDataMsg?: boolean;
  public idDependencia?: string;
  public isCreateDependencia: boolean = false;

  public editableItem:
    | boolean
    | {
        id: string;
        name: string;
      } = false;

  constructor(
    private _dependecyService: DirectoriosServicesService,
    private _activateRoute: ActivatedRoute,
    private _modalService: NgbModal,
    private _toastr: ToastrService,
    private _location: Location
  ) {}

  ngOnInit(): void {
    let bytes = CryptoJS.AES.decrypt(
      localStorage.getItem('data') || '',
      localStorage.getItem('token') || ''
    );

    this.userData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    this.user_id_localStorage = localStorage.getItem('user_id');

    this.user_rol = this.userData.rol;

    this._activateRoute.paramMap.subscribe((params) => {
      this.idSuperior = params.get('id') || '';
      this.getDependecy();
    });
  }

  setEditable(id: string, name: string, content: any) {
    this.editableItem = {
      id,
      name,
    };

    this._modalService.open(content, { size: 'lg', centered: true });
  }

  getDependecy() {
    this.isLoading = true;
    this.archivosVarios = false;

    this._dependecyService.getDependecyByID(this.idSuperior).subscribe({
      next: (response) => {
        if (!response) {
          this._toastr.error('Error al cargar dependencia', 'Respuesta vacía');
          this._location.back();
          return;
        }

        const { dependencias, archivos, rutas } = response;

        // solución
        if (rutas[0]?.has_doc) this._location.back();

        this.dependenciaIndiceLongitud = dependencias.length + 1;

        this.currentRoute = rutas[0];

        // Toma la dependencia indice de la ruta anterior y ejecuta la función
        // para obtener los ids hijos de la ruta anterior
        this.indiceDependencia = rutas?.[0]?.dependencia_indice || null;

        this.subDependencies = dependencias || [];
        this.archivosVariosURL = archivos || [];
        this.filterDependeciesName = dependencias || [];
        this.rutasData = rutas?.reverse() || [];

        if (rutas[rutas.length - 1]?.has_doc) this.archivosVarios = true;

        this.isLoading = false;
        if (this.subDependencies.length === 0) {
          this.noDataMsg = true;
        } else {
          this.noDataMsg = false;
        }
      },
      error: (err) => {
        console.log(err);
        this._toastr.error(
          'Error al cargar dependencia',
          'Error en la petición'
        );
        this._location.back();
      },
    });
  }

  searchQuery(value: string): void {
    this.filterDependeciesName = this.filterDependecies(
      value,
      ...this.subDependencies
    );
  }

  filterDependecies(query: string, ...dependencies: any[]): any[] {
    return dependencies.filter((dependency) =>
      dependency.nombre.toLowerCase().includes(query.toLowerCase())
    );
  }

  openModalSearchFiles() {
    this._modalService.open(this.searchFileModal, {
      size: 'xl',
      scrollable: true,
      centered: true,
    });
  }

  openModalCreateDependencie(content: any, isCreateDep: boolean) {
    this.isCreateDependencia = isCreateDep;
    this.editableItem = false;

    this._modalService.open(content, { size: 'lg', centered: true });
  }

  cargar_script(id: any) {
    let data = {
      id,
    };
    if (confirm('¿Desea cargar script?')) {
      this._dependecyService.cargarDepartamentosScript(data).subscribe({
        next: (response: any) => {
          alert(response.msg);
        },
      });
    }
  }

  borrar_documentos(subgerencia: any) {
    let data = {
      id: subgerencia.id,
    };
    if (confirm('¿Desea borrar todos los documentos?')) {
      this._dependecyService.borrarDocumentosDepartamento(data).subscribe({
        next: (response: any) => {
          alert('Documentos eliminados');
          this.getDependecy();
        },
      });
    }
  }

  borrar_dependencia(subgerencia: any) {
    let data = {
      id: subgerencia.id,
    };
    if (confirm('¿Desea borrar la dependencia?')) {
      this._dependecyService.borrarDepartamento(data).subscribe({
        next: (response: any) => {
          alert('Dependencia eliminada');
          this.getDependecy();
        },
      });
    }
  }
}
