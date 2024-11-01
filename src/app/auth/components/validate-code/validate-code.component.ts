import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  QueryList,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import * as crypto from 'crypto-js';
import { LoadingService } from 'src/app/services/screenLoading.service';
import { flip } from '@popperjs/core';
@Component({
  selector: 'app-validate-code',
  templateUrl: './validate-code.component.html',
})
export class ValidateCodeComponent implements OnInit {
  public screenLoading: boolean = false;

  public isLoading: boolean = false;
  public isShowPassword: boolean = false;

  public code: string[] = ['', '', '', ''];

  @Input() prevInputId?: string;
  @Input() nextInputId?: string;

  codigoForm: FormGroup = this._fb.group({
    codigo1: ['', Validators.required],
    codigo2: ['', Validators.required],
    codigo3: ['', Validators.required],
    codigo4: ['', Validators.required],
  });

  constructor(
    private _fb: FormBuilder,
    private _toastr: ToastrService,
    private _authService: AuthService,
    private _router: Router,
    private loadingService: LoadingService
  ) {}
  ngOnInit(): void {
    this.loadingService.setIsLoadingState(false);
  }

  onKey(
    event: KeyboardEvent,
    nextInputId: string | null,
    prevInputId: string | null
  ) {
    const input = event.target as HTMLInputElement;
    if (input.value.length === input.maxLength && nextInputId) {
      const nextInput = document.getElementById(
        nextInputId
      ) as HTMLInputElement;
      nextInput.focus();
    } else if (input.value.length === 0 && prevInputId) {
      const prevInput = document.getElementById(
        prevInputId
      ) as HTMLInputElement;
      prevInput.focus();
    }
  }

  handleLogin() {
    if (this.codigoForm.invalid) {
      this.codigoForm.markAllAsTouched();
      this.isLoading = false;
      this._toastr.warning(
        'Revisa las casillas marcadas del formulario',
        'Formulario no valido',
        {
          progressBar: true,
          progressAnimation: 'decreasing',
        }
      );
      return;
    }
    this.isLoading = true;

    this._authService.postCodeAutentification(this.code.join('')).subscribe({
      next: (response) => {
        let token = `token ${response.token}`;
        const tokenTime = new Date().toISOString();
        localStorage.setItem('token', token);
        localStorage.setItem(
          'data',
          crypto.AES.encrypt(JSON.stringify(response), `${token}`).toString()
        );
        localStorage.setItem('tokenTime', tokenTime);
        localStorage.setItem('user_role', response.rol.toString());

        this.isLoading = false;

        setTimeout(() => {
          this.loadingService.setIsLoadingState(true);
        }, 1000);

        setTimeout(() => {
          if (response.rol == 1) {
            this._router.navigate(['/dashboard']);
          } else if (response.rol == 2) {
            this._router.navigate(['/dashboard']);
          } else {
            this._toastr.error(
              '',
              `Error al iniciar sesión, intentalo de nuevo.`
            );
          }
          this.loadingService.setIsLoadingState(false);

          this._toastr.success(
            '',
            `Bienvenido ${response.first_name} ${response.last_name}`,
            {
              progressBar: true,
              progressAnimation: 'decreasing',
            }
          );
        }, 5000);
      },
      error: (error) => {
        console.log(error);
        this.isLoading = false;
      },
    });
  }
}
