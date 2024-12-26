import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CurrentRoute } from 'src/app/interfaces/currentRoute.interface';
import { HeadersInterface } from 'src/app/interfaces/headersData.interface';
import { DirectoriosServicesService } from 'src/app/services/directorios-services.service';

@Component({
  selector: 'add-file-modal',
  templateUrl: './add-file-modal.component.html',
  styleUrls: ['./add-file-modal.component.css'],
})
export class AddFileModalComponent implements OnInit {
  @Output() executeGetDependency = new EventEmitter<void>();

  @Input() public idType?: string;
  @Input() public headers?: HeadersInterface[] | null;
  @Input() public dependenciaIndice?: string;
  @Input() public dependenciaId?: string;
  @Input() public currentTag?: string;
  @Input() public ruta?: CurrentRoute[];
  @Input() public documentSelected?: any;

  public dynamicForm: FormGroup = new FormGroup({});
  public selectedFile?: any;
  public idNewFile?: number;
  public isEdit?: string;

  constructor(
    private fb: FormBuilder,
    private _toastr: ToastrService,
    private _dependencyService: DirectoriosServicesService,
    private _modalService: NgbModal
  ) {}

  ngOnInit() {
    if (this.headers) {
      this.createForm();
    }
  }

  getHeader(header: string) {
    return header.replace(/\./g, '');
  }

  createForm() {
    const group: any = {};
    this.headers?.forEach((header) => {
      group[header.nombre.replace(/\./g, '')] = new FormControl('');
    });
    if (this.documentSelected === undefined) {
      this.dynamicForm = this.fb.group(group);
      this.isEdit = 'Crear';
    } else {
      this.isEdit = 'Actualizar';
      this.dynamicForm = this.fb.group({});

      this.headers!.forEach((header) => {
        // Precarga los valores al inicializar el formulario
        this.dynamicForm.addControl(
          header.nombre.replace(/\./g, ''),
          this.fb.control(this.documentSelected[header.nombre] || 'N/A')
        );
      });
    }
  }

  onFileSelect(event: any) {
    this.selectedFile = event.files[0];
  }

  onSubmitForm() {
    if (this.isEdit === 'Actualizar') {
      return this.onSubmitEditFile();
    }

    if (!this.selectedFile) {
      this._toastr.warning(
        'Por favor seleccione un archivo',
        'Archivo requerido'
      );
      return;
    }
    const route = this.ruta?.map((route) => route.nombre);
    const routeSend = route?.join('\\');

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('dependenciaIndice', this.dependenciaIndice!);
    formData.append('dependenciaId', this.dependenciaId!);
    formData.append('tipoDocumento', this.currentTag!);
    formData.append('tipo', this.idType!);
    formData.append('ruta', routeSend as string);

    this._dependencyService.uploadPDF(formData).subscribe({
      next: (response) => {
        this.idNewFile = response.id;
        this._toastr.success('', 'Pdf agregado con éxito');
        this.onSubmitFieldsForm();
        this._modalService.dismissAll();
        this.executeGetDependency.emit();
      },
      error: (error) => {
        this._toastr.success('', 'Error al agregar PDF');
        console.error('Upload failed:', error);
        this._modalService.dismissAll();
      },
    });
  }

  onSubmitFieldsForm() {
    const catalogoHeaderId = this.headers?.map((header) => header.id);
    const descriptionValues = this.dynamicForm.value;
    const descripcion = Object.values(descriptionValues);

    const updatedDescriptions = descripcion.map((item) =>
      item === '' ? 'N/A' : item
    );

    const data = {
      documentoId: this.idNewFile as number,
      descripcion: updatedDescriptions as string[],
      catalogoHeaderId,
    };

    this._dependencyService.addFieldsFile(data).subscribe({
      next: (resp) => {
        this._toastr.success('', 'Campos agregados con éxito');
        this.insertNewFile();
      },
      error: (error) => {
        this._toastr.error('Error al agregar campos', 'Error');
        console.log(error);
      },
    });
  }

  insertNewFile() {
    this._dependencyService.insertNewFile(this.idNewFile!).subscribe({
      next: (resp) => {
        this._toastr.success('Archivo agregado a la tabla', 'Éxito');
        this.executeGetDependency.emit();
      },
      error: (error) => {
        this._toastr.error('Error al agregar archivo a tabla', 'Error');
        console.log(error);
      },
    });
  }

  onSubmitEditFile() {
    const idFile = this.documentSelected.documento_id;
    this._dependencyService.getFieldsFile(idFile).subscribe({
      next: (resp) => {
        const idCampos = resp.map((item) => item.id);
        let descripcion: string[] = [];

        this.headers?.forEach((header) => {
          console.log({ header });

          const value = this.dynamicForm.get(
            header.nombre.replace(/\./g, '')
          )?.value;
          console.log({ value });

          descripcion.push(value === '' || value === null ? 'N/A' : value);
        });

        const data = {
          idCampos,
          descripcion,
        };
        this.executeGetDependency.emit();

        this.editFieldsFile(data);
        if (this.selectedFile) {
          const route = this.ruta?.map((route) => route.nombre);
          const routeSend = route?.join('\\');

          const formData = new FormData();
          formData.append('file', this.selectedFile);
          formData.append('ruta', routeSend!);
          formData.append('pk', idFile);

          this._dependencyService.editPdf(formData).subscribe({
            next: (resp) => {
              this._toastr.success('', 'Pdf actualizado con éxito');
            },
            error: (error) => {
              this._toastr.error('Error al actualizar PDF', 'Error');
              console.log(error);
            },
          });
        }
      },
      error: (error) => {
        this._toastr.error('Error al obtener campos', 'Error');
        console.log(error);
      },
    });
  }

  editFieldsFile(data: any) {
    this._dependencyService.editFieldsFile(data).subscribe({
      next: (resp) => {
        this._toastr.success('', 'Campos actualizados con éxito');
        this._modalService.dismissAll();
        this.executeGetDependency.emit();
      },
      error: (error) => {
        this._toastr.error('Error al actualizar campos', 'Error');
        console.log(error);
      },
    });
  }
}
