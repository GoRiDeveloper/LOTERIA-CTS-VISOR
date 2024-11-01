import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Auth, UserProfile } from '../interfaces/Auth.interface';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public now: any;
  public horaToken: any;
  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _toastr: ToastrService
  ) {}

  private _getHeaders() {
    return new HttpHeaders({
      'content-Type': 'application/json',
      Authorization: localStorage.getItem('token') ?? '',
    });
  }

  postLogin(userCredentials: Auth): Observable<any> {
    const headers = new HttpHeaders({ 'content-Type': 'application/json' });
    return this._http.post<any>(
      `${environment.BASE_URL}auth/`,
      userCredentials,
      { headers }
    );
  }

  postCodeAutentification(codeVerification: string): Observable<UserProfile> {
    let data = {
      token: codeVerification,
    };
    const headers = new HttpHeaders({ 'content-Type': 'application/json' });
    return this._http
      .post<UserProfile>(`${environment.BASE_URL}validate/`, data, { headers })
      .pipe(tap((response) => {}));
  }

  validateEmailCode(codeVerification: string): Observable<any> {
    const headers = new HttpHeaders({ 'content-Type': 'application/json' });
    return this._http.get(
      `${environment.BASE_URL}validar_correo/${codeVerification}`,
      { headers }
    );
  }

  isAuth(): boolean {
    return localStorage.getItem('token') != null ? true : false;
  }

  checkTokenExpiration() {
    const tokenTime = localStorage.getItem('tokenTime');
    this.now = new Date().getTime();

    // console.log({ tokenTime: tokenTime, now: this.now });
    if (tokenTime !== null) {
      this.horaToken = new Date(tokenTime).getTime();
    } else {
      console.log('No token time found in local storage');
    }

    if (this.now - this.horaToken > 12 * 60 * 60 * 1000) {
      this._toastr.info(
        `Por favor, vuelva a iniciar sesión.`,
        'Por seguridad, cerramos su sesión cada 12 horas',
        {
          progressBar: true,
          progressAnimation: 'decreasing',
          timeOut: 0,
        }
      );

      localStorage.clear();

      this._router.navigate(['/login']);
    }
  }
}
