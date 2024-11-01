import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  constructor(private _toastr: ToastrService, private _router: Router) {}

  public handleError(err: HttpErrorResponse) {
    let errorMessage!: string;

    if (err.error instanceof ErrorEvent) {
      errorMessage = `an error ocurred: ${err.error.message}`;
    } else {
      switch (err.status) {
        case 400:
          errorMessage = `Solicitud incorrecta. Por favor, revise los datos enviados.`;
          break;
        case 401:
          errorMessage = `No autorizado. Por favor, inicie sesión nuevamente.`;
          localStorage.clear(); // Limpiar el local storage
          this._router.navigate(['auth/login']); // Redirigir al login
          break;
        case 403:
          errorMessage = `Prohibido. No tiene permisos para acceder a este recurso.`;
          break;
        case 404:
          errorMessage = `Recurso no encontrado. Por favor, verifique la URL.`;
          break;
        case 500:
          errorMessage = `Ha ocurrido un problema con el servidor. Inténtelo más tarde.`;
          break;
        case 503:
          errorMessage = `Servicio no disponible. El servidor puede estar en mantenimiento. Inténtelo más tarde.`;
          break;
        case 0:
          errorMessage = `No se puede conectar con el servidor. Revisa tu conexión a internet.`;
          break;
        default:
          errorMessage = `Ha ocurrido un error inesperado. Inténtelo más tarde. Código de error: ${err.status}`;
      }
    }

    this._toastr.error(`código error - ${err.status}`, errorMessage, {
      disableTimeOut: false,
      closeButton: true,
      progressBar: true,
      progressAnimation: 'increasing',
      positionClass: 'toast-top-right',
    });
  }
}
