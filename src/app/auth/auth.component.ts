import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../services/screenLoading.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.sass'],
})
export class AuthComponent implements OnInit {
  isLoading: boolean = false;

  loginForm: FormGroup = this._fb.group({
    password: ['Abcd1234', Validators.required],
    email: ['dev@omedic.com', Validators.required],
  });

  constructor(
    private _fb: FormBuilder,
    private loadingService: LoadingService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this._router.navigateByUrl('/dashboard');
    }
    this.loadingService.isLoading$.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
  }
}
