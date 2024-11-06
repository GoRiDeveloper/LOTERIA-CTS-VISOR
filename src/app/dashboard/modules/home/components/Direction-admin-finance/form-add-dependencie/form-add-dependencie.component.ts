import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { metadataMapper } from 'src/app/infraestructure/mappers/metadata.mapper';
import { CurrentRoute } from 'src/app/interfaces/currentRoute.interface';
import { MetadataInterface } from 'src/app/interfaces/metadata.interaface';
import { DirectoriosServicesService } from 'src/app/services/directorios-services.service';

@Component({
  selector: 'form-add-dependencie',
  templateUrl: './form-add-dependencie.component.html',
  styleUrls: ['./form-add-dependencie.component.css'],
})
export class FormAddDependencieComponent implements OnInit {
  @Output() executeGetDependency = new EventEmitter<void>();
  @Input() public currentRoute: CurrentRoute | null = null;
  @Input() public editableItem: { id: string; name: string } | boolean = {
    id: '',
    name: '',
  };
  @Input() public indiceDependencia?: string;
  @Input() public dependenciaIndiceLongitud?: string;
  @Input() public isCreateDependencia?: boolean;

  // Formulario con FormArray para metadatos dinámicos
  public dependencieForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    metaData: this.fb.array([]),
  });

  public headers?: MetadataInterface[];
  public namesHeaders?: string[];
  public selectedHeaders?: string[];
  public idDepNueva?: string;
  public userRol?: number;
  public dependeciaIdHeader?: number;
  public dependenciaDocumentoTipoId?: number;
  public idHeadersToAdd: (number | undefined)[] = [];

  constructor(
    private fb: FormBuilder,
    private _toastr: ToastrService,
    private _dependecyService: DirectoriosServicesService,
    private _modalService: NgbModal
  ) {}

  ngOnInit() {
    this.getMetadata();
    this.setUserRol();

    if (typeof this.editableItem !== 'boolean' && this.editableItem.name) {
      this.dependencieForm.patchValue({ nombre: this.editableItem.name });
    }
  }

  get metaData(): FormArray {
    return this.dependencieForm.get('metaData') as FormArray;
  }

  setUserRol() {
    debugger;
    let bytes = CryptoJS.AES.decrypt(
      localStorage.getItem('data') || '',
      localStorage.getItem('token') || ''
    );

    const userData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    console.log({ rol: userData.rol });

    this.userRol = userData.rol;
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
    this.metaData.removeAt(index);
  }

  async onSubmitAddDep() {
    if (!this.dependencieForm.valid) return;
    const nombre = this.dependencieForm.get('nombre')?.value;

    const createDep = {
      nombre,
      dependenciaIndiceBase: this.indiceDependencia!,
      dependenciaSuperior: this.currentRoute?.id!,
    };

    if (typeof this.editableItem === 'boolean') {
      this._dependecyService.addDependency(createDep).subscribe({
        next: (response) => {
          this._toastr.success('', 'Dependencia Creada');
          this.idDepNueva = response.id;
          this._modalService.dismissAll();
          this.executeGetDependency.emit();
        },
        error: (err) => {
          this._toastr.error('Error al crear dependencia', 'Error');
          console.log(err);
        },
      });
    } else {
      this._dependecyService
        .updateDependencie(this.editableItem.id, { nombre })
        .subscribe({
          next: (response) => {
            this._toastr.success('', 'Dependencia Editada');
            this.idDepNueva = response.id;
            this._modalService.dismissAll();
            this.executeGetDependency.emit();
          },
          error: (err) => {
            this._toastr.error('Error al editar dependencia', 'Error');
            console.log(err);
          },
        });
    }
  }
}
