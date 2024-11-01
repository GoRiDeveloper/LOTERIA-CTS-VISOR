import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Auth } from 'src/app/interfaces/Auth.interface';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  public isLoading:boolean = false;
  public isShowPassword:boolean = false;
  public userLogin:Auth = <Auth>{};


  loginForm: FormGroup = this._fb.group({
    email: ['', [Validators.required,Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,10}$')] ],
    password: ['', Validators.required ] 
  });

  constructor(private _fb: FormBuilder,
              private _toastr:ToastrService,
              private _authService:AuthService,
              private _router:Router) { }

  ngOnInit(): void {}

  public inputIsValid = (campo: string) => (this.loginForm.controls[campo].errors && this.loginForm.controls[campo].touched);
  handleLogin() {    
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.isLoading = false;
        this._toastr.warning('Revisa las casillas marcadas del formulario', 'Formulario no valido',
        {
          progressBar: true,
          progressAnimation: 'decreasing',
        });
      return;
    }
    this.isLoading = true;
    this.userLogin.username = this.loginForm.get('email')?.value.toLowerCase();
    this.userLogin.password = this.loginForm.get('password')?.value;
    

    this._authService.postLogin(this.userLogin).subscribe(
      {
        next: response => {
          console.log(this.userLogin);
          alert(response.code);
          this._toastr.success('',`Se ha enviado el código de verificacion a tu correo.`,
          {
            progressBar: true,
            progressAnimation: 'decreasing',
          });
          this.isLoading = false;
          this._router.navigate(['/auth/codigo-verificacion'])
        },
        error: error =>   ( this.isLoading = false )
      })
  }
}