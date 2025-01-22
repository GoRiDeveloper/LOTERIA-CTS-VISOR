import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { metadataMapper } from 'src/app/infraestructure/mappers/metadata.mapper';
import { CurrentRoute } from 'src/app/interfaces/currentRoute.interface';
import { MetadataInterface } from 'src/app/interfaces/metadata.interaface';
import { DirectoriosServicesService } from 'src/app/services/directorios-services.service';

@Component({
  selector: 'form-add-table',
  templateUrl: './form-add-table.component.html',
  styleUrls: ['./form-add-table.component.css'],
})
export class FormAddTableComponent implements OnInit {
  @Output() executeGetDependency = new EventEmitter<void>();
  @Input() public currentRoute: CurrentRoute | null = null;
  @Input() public sheetId: string | boolean = false;
  @Input() public indiceDependencia?: string;
  @Input() public dependenciaIndiceLongitud?: string;
  @Input() public isCreateDependencia?: boolean;

  // Formulario con FormArray para metadatos dinámicos
  public dependencieForm: FormGroup = this.fb.group({
    metaData: this.fb.array([]),
  });
  public dependencieFormHeader: FormGroup = this.fb.group({
    header: ['', [Validators.required]],
  });

  public headers?: MetadataInterface[];
  public namesHeaders?: string[];
  public selectedHeaders?: string[];
  public idDepNueva?: string;
  public dependeciaIdHeader?: number;
  public dependenciaDocumentoTipoId?: number;
  public idHeadersToAdd: number[] = [];
  public idDocumentCreated?: number;

  constructor(
    private fb: FormBuilder,
    private _toastr: ToastrService,
    private _dependecyService: DirectoriosServicesService,
    private _modalService: NgbModal,
    private _router: Router
  ) {}

  ngOnInit() {
    this.getMetadata();
    this.addMetaData();
  }

  get metaData(): FormArray {
    return this.dependencieForm.get('metaData') as FormArray;
  }

  getMetadata() {
    this._dependecyService.getMetadata().subscribe({
      next: (resp) => {
        this.headers = resp.map((item: any) =>
          metadataMapper.dependencyStructureToEntity(item)
        );
        this.namesHeaders = this.headers?.map(
          (item: MetadataInterface) => item.nameHeader!
        );
      },
    });
  }

  addMetaData() {
    const lastIndex = this.metaData.length - 1;

    if (lastIndex >= 0) {
      const lastValue = this.metaData.at(lastIndex)?.value;

      if (lastValue === '') {
        this._toastr.error('El último registro no puede estar vacío', 'Error');
        return;
      }

      const values = this.metaData.value.map((meta: string) => meta);
      const isDuplicate =
        values.filter((value: string) => value === lastValue).length > 1;

      if (isDuplicate) {
        this._toastr.error(
          'El registro ya ha sido agregado anteriormente',
          'Error'
        );
        return;
      }
    }

    this.metaData.push(this.fb.control('', Validators.required));
  }

  removeMetaData(index: number) {
    if (index === 0 && this.metaData.length === 1) {
      this._toastr.error('No se puede eliminar el último registro', 'Error');
      return;
    }
    this.metaData.removeAt(index);
  }

  onSubmitAddTable() {
    this.agregarCatalogoTipo();
  }

  //Crea encabezados en caso de no existir en la base de datos

  agregarCatalogoTipo() {
    const metaData: MetadataInterface[] = this.metaData.value;
    const idMetadata: number[] = metaData
      .filter((item) => item.id !== undefined)
      .map((item) => item.id);
    if (metaData && idMetadata) {
      this.idHeadersToAdd?.push(...idMetadata);
    }

    const data = {
      catalogoHeaderId: this.idHeadersToAdd,
      tipo_id: this.sheetId,
      dependencia_id: this.currentRoute?.id,
    };

    this._dependecyService.addTagType(data).subscribe({
      next: (response) => {
        this._toastr.success('Encabezados agregados exitosamente', 'Éxito');

        this._toastr.success(`Tabla agregada exitosamente`, 'Éxito');
        this._modalService.dismissAll();
        this._router.navigate([
          `/dashboard/home/documentos/${this.currentRoute?.id}`,
        ]);
      },
      error: (err) => {
        this._toastr.error('Error al agregar encabezados', 'Error');
        console.log(err);
      },
    });
  }

  // agregarDepTemporal() {
  //   const idDoc = this.idDocumentCreated?.toString()!;
  //   const headersId = this.idHeadersToAdd;
  //   const currentUrl = this.currentRoute?.id;

  //   this._dependecyService.addTemporalDep(idDoc, headersId).subscribe({
  //     next: (resp) => {

  //     },
  //     error: (err) => {
  //       this._toastr.error('Error al agregar la tabla', 'Error');
  //       console.log(err);
  //     },
  //   });
  // }

  createHeader() {
    const newHeader = this.dependencieFormHeader.get('header')?.value;
    const existHeader = this.headers?.includes(newHeader);
    if (existHeader) {
      this._toastr.warning(
        'El encabezado ya existe, favor de verificar',
        'Error'
      );
      return;
    }

    this._dependecyService.createHeader(newHeader).subscribe({
      next: (response) => {
        this._toastr.success(
          `Encabezado ${newHeader} agregado exitosamente`,
          'Éxito'
        );

        this.dependencieFormHeader.reset();

        this.getMetadata();
      },
      error: (err) => {
        this._toastr.error('Error al crear encabezado', 'Error');
        console.log(err);
      },
    });
  }

  openModal(content: any) {
    this._modalService.open(content, { centered: true, size: 'lg' });
  }
}
