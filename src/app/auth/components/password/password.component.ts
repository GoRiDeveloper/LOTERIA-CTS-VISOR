import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Auth } from 'src/app/interfaces/Auth.interface';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html'
})
export class PasswordComponent implements OnInit {

  public isLoading:boolean = false;
  public userLogin:Auth = <Auth>{};
  public isShowPassword:boolean = false;


  passwordForm: FormGroup = this._fb.group({
    password: ['', Validators.required ] 
  });

  constructor(private _fb: FormBuilder,
              private _toastr:ToastrService,
              private _authService:AuthService,
              private _router:Router) { }

  ngOnInit(): void {}

  public inputIsValid = (campo: string) => (this.passwordForm.controls[campo].errors && this.passwordForm.controls[campo].touched);



}
