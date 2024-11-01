import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})

export class HandleErrorUser {
  constructor(private _toastService: ToastrService) {}

  // Método genérico de manejo de errores
  handleError(error: any) {
    console.log(error);

    // Manejo de errores específicos basados en el código de estado
    if (error.status === 400) {
      if (error.error) {
        // Manejo de errores específicos del campo
        if (error.error.username) {
          this._toastService.warning(
            'Ya existe un usuario con ese nombre de usuario.'
          );
        } else if (error.error.email) {
          this._toastService.warning(
            'Introduce una dirección de correo electrónico válida.'
          );
        } else {
          this._toastService.warning(
            'Hay errores en los datos proporcionados.'
          );
        }
      } else {
        this._toastService.warning('Solicitud incorrecta.');
      }
    } else if (error.status === 404) {
      this._toastService.error('Recurso no encontrado.');
    } else if (error.status === 500) {
      this._toastService.error(
        'Error interno del servidor. Por favor, inténtalo de nuevo más tarde.'
      );
    } else {
      this._toastService.error(
        'Se produjo un error. Por favor, inténtalo de nuevo más tarde.'
      );
    }
  }
}
