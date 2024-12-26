import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';

import { Auth } from 'src/app/interfaces/Auth.interface';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  public isLoading: boolean = false;
  public isShowPassword: boolean = false;
  public userLogin: Auth = <Auth>{};
  public imgSrc?: SafeUrl;

  loginForm: FormGroup = this._fb.group({
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(
          '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,10}$'
        ),
      ],
    ],
    password: ['', Validators.required],
  });

  constructor(
    private _fb: FormBuilder,
    private _toastr: ToastrService,
    private _authService: AuthService,
    private _sanitizer: DomSanitizer,
    private _modalService: NgbModal,
    private _router: Router
  ) {}

  ngOnInit(): void {}

  public inputIsValid = (campo: string) =>
    this.loginForm.controls[campo].errors &&
    this.loginForm.controls[campo].touched;

  checkUserData() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
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
    this.userLogin.username = this.loginForm.get('email')?.value.toLowerCase();
    this.userLogin.password = this.loginForm.get('password')?.value;
  }

  handleLogin() {
    this.checkUserData();
    this._authService.postLogin(this.userLogin).subscribe({
      next: (response: any) => {
        alert(response.token);
        this._toastr.success(
          '',
          `Se ha enviado el código de verificacion a tu correo.`,
          {
            progressBar: true,
            progressAnimation: 'decreasing',
          }
        );
        this.isLoading = false;
        this._router.navigate(['/auth/codigo-verificacion']);
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  handleQRLogin(content: any) {
    this.checkUserData();
    this._authService.getQR(this.userLogin).subscribe({
      next: (response: Blob) => {
        const url = this._sanitizer.bypassSecurityTrustUrl(
          URL.createObjectURL(response)
        );
        this.imgSrc = url;
        this._modalService.open(content, { size: 'lg', centered: true });
      },
      error: (error) => (this.isLoading = false),
    });

    this._authService
      .loginId(this.userLogin.username, this.userLogin.password)
      .subscribe({
        next: (response) => {
          localStorage.setItem(
            'uid',
            CryptoJS.AES.encrypt(
              JSON.stringify(response.temp_uid),
              'verify'
            ).toString()
          );
        },
        error: (error) => console.log(error),
      });
  }

  sendVerifyCode() {
    this._modalService.dismissAll();
    this._toastr.success(
      '',
      `Se ha enviado el código de verificacion a la aplicación de autenticación.`,
      {
        progressBar: true,
        progressAnimation: 'decreasing',
      }
    );
    this.isLoading = false;
    this._router.navigate(['/auth/codigo-verificacion']);
  }
}
