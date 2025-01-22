import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CurrentRoute } from 'src/app/interfaces/currentRoute.interface';
import { DirectoriosServicesService } from 'src/app/services/directorios-services.service';

@Component({
  selector: 'form-add-sheet',
  templateUrl: './form-add-sheet.component.html',
  styleUrls: ['./form-add-sheet.style.css'],
})
export class FormAddSheetComponent implements OnInit {
  @Output() responseSheet?: any = new EventEmitter();
  @Output() manageSheet?: any = new EventEmitter();

  @Input() public id?: any = null;
  @Input() public name? = '';
  @Input() public type?: 'add' | 'edit' = 'add';
  @Input() public currentRoute?: CurrentRoute | null = null;

  public sheetForm: FormGroup = this.fb.group({
    nombre: ['', Validators.required, Validators.minLength(2)],
    metaData: this.fb.array([]),
  });

  constructor(
    private fb: FormBuilder,
    private _toastr: ToastrService,
    private _dependecyService: DirectoriosServicesService
  ) {}

  get metaData(): FormArray {
    return this.sheetForm.get('metaData') as FormArray;
  }

  ngOnInit(): void {
    if (this.name && this.type === 'edit')
      this.sheetForm.patchValue({ nombre: this.name });
  }

  onSubmitAddSheet(): any {
    const nameInput = this.sheetForm.get('nombre')?.value;

    if (!nameInput)
      return this._toastr.warning('Todos los campos son requeridos');

    if (!this.currentRoute?.id)
      return this._toastr.error('El ID de la dependencia es requerido.');

    if (this.type === 'add') {
      this._dependecyService
        .addSheet({
          nombre: nameInput,
          dependencia: this.currentRoute.id,
        })
        .subscribe({
          next: (value) => {
            this.responseSheet?.emit(value.id);
          },
        });
    } else if (this.type === 'edit') {
      if (!this.id)
        return this._toastr.error(
          'El ID de la hoja es requerido para editarse.'
        );

      this._dependecyService
        .editSheet(this.id, {
          nombre: nameInput,
          dependencia: this.currentRoute.id,
        })
        .subscribe({
          next: (value) => {
            this.responseSheet?.emit(value.id);
          },
        });
    }
  }
}
