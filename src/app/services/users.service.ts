import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDataInterface } from '../interfaces/Users.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserDependecieInterface } from '../interfaces/Auth.interface';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private _http: HttpClient) {}

  private _getHeaders() {
    return new HttpHeaders({
      'content-Type': 'application/json',
      Authorization: localStorage.getItem('token') ?? '',
    });
  }

  getAllUsers(filtros: Map<string, string>): Observable<UserDataInterface[]> {
    let params = new HttpParams();
    // filtros.forEach((key:string,valor:string) => {
    //   console.log(key);
    //   console.log(valor);
    // });

    filtros.forEach((valor, key) => {
      params = params.append(key, valor);
    });

    return this._http.get<UserDataInterface[]>(
      `${environment.BASE_URL}usuario/list`,
      { headers: this._getHeaders(), params: params }
    );
  }

  getAllUsersPaginado(filtros: Map<string, string>): Observable<any> {
    let params = new HttpParams();

    filtros.forEach((valor, key) => {
      params = params.append(key, valor);
    });

    return this._http.get<any>(`${environment.BASE_URL}usuario/paginado`, {
      headers: this._getHeaders(),
      params: params,
    });
  }

  postCreateUser(user: UserDataInterface): Observable<UserDataInterface> {
    return this._http.post<UserDataInterface>(
      `${environment.BASE_URL}usuario/create`,
      user,
      { headers: this._getHeaders() }
    );
  }

  // Endpoint Manuel

  patchUpdateUser(id: number, user: any): Observable<UserDataInterface> {
    return this._http.put<UserDataInterface>(
      `${environment.BASE_URL}usuario/partial_update/${id}`,
      user,
      { headers: this._getHeaders() }
    );
  }

  putUpdateUser(
    user: UserDataInterface,
    idUser: string
  ): Observable<UserDataInterface> {
    return this._http.put<UserDataInterface>(
      `${environment.BASE_URL}usuario/partial_update2/${idUser}/`,
      user,
      { headers: this._getHeaders() }
    );
  }

  putUpdateDepUser(id: string, dependencias: string[]): Observable<any> {
    return this._http.patch<any[]>(
      `${environment.BASE_URL}actualizar-dependencias/${id}/`,
      { dependencias: dependencias },
      { headers: this._getHeaders() }
    );
  }

  getAllDependecies(): Observable<UserDependecieInterface[]> {
    return this._http.get<UserDependecieInterface[]>(
      `${environment.BASE_URL}usuario/dependencias`,
      { headers: this._getHeaders() }
    );
  }

  getAllDependeciesDocDescarga(
    filtros: Map<string, any>
  ): Observable<UserDependecieInterface[]> {
    let params = new HttpParams();

    filtros.forEach((valor, key) => {
      params = params.append(key, valor);
    });

    return this._http.get<UserDependecieInterface[]>(
      `${environment.BASE_URL}dependencia/documento/descargas`,
      { headers: this._getHeaders(), params: params }
    );
  }

  getAllExpUnicoDocDescarga(
    filtros: Map<string, any>
  ): Observable<UserDependecieInterface[]> {
    let params = new HttpParams();

    filtros.forEach((valor, key) => {
      params = params.append(key, valor);
    });

    return this._http.get<UserDependecieInterface[]>(
      `${environment.BASE_URL}expediente_unico/documento/descargas`,
      { headers: this._getHeaders(), params: params }
    );
  }

  putUpdateStatusUser(
    status: any,
    idUser: string
  ): Observable<UserDataInterface> {
    return this._http.put<UserDataInterface>(
      `${environment.BASE_URL}usuario/partial_update2/${idUser}/`,
      status,
      { headers: this._getHeaders() }
    );
  }

  getUserInfo(): Observable<any> {
    return this._http.get<any>(`${environment.BASE_URL}usuario/info`, {
      headers: this._getHeaders(),
    });
  }

  logout(): Observable<any> {
    return this._http.get<any>(`${environment.BASE_URL}logout`, {
      headers: this._getHeaders(),
    });
  }
}
