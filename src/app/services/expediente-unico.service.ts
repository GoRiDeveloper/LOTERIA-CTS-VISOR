import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpedienteUnicoService {
  public dependencies:any;

  constructor(private _http:HttpClient) { }

  private _getHeaders() {
    return new HttpHeaders({ 'content-Type': 'application/json', Authorization: localStorage.getItem('token')??'' });
  }

  getDependenciaUnica():Observable<any> {
    return this._http.get<any>(`${environment.BASE_URL}expediente_unico/list`, {headers: this._getHeaders()})
  }
  getDependenciaUnicaByID(idSuperior:string):Observable<any> {
    return this._http.get<any>(`${environment.BASE_URL}expediente_unico/list?superior=${idSuperior}`, {headers: this._getHeaders()})
  }
  getTypeDocumentByID(filtros:Map<string, string>):Observable<any> {

    let params = new HttpParams();

    filtros.forEach((valor, key) => {
      params = params.append(key, valor);
    });


    return this._http.get<any>(`${environment.BASE_URL}expediente_unico/tipo_documento/list`, {headers: this._getHeaders(),params:params})
  }
  getTypeDocumentByIDType(filtros:Map<string, string>):Observable<any> {
    
    let params = new HttpParams();

    filtros.forEach((valor, key) => {
      params = params.append(key, valor);
    });

    return this._http.get<any>(`${environment.BASE_URL}expediente_unico/documento/list2`, {headers: this._getHeaders(),params:params})
  }

  getDocumentByID(idType:string):Observable<any> {
    return this._http.get<any>(`${environment.BASE_URL}}expediente_unico/documento/archivo/${idType}`, {headers: this._getHeaders()})
  }

  getDocumentArchivoByID(idType:string, page:number):Observable<any> {
    var headers = new HttpHeaders({  'content-Type': 'application/pdf',Authorization: localStorage.getItem('token')??'' });
    return this._http.get(`${environment.BASE_URL}expediente_unico/documento/archivo/${idType}?page=${page}`, {responseType: 'arraybuffer' ,headers: headers})
  }


  getDocumentArchivoDescargarByID(idType:string):Observable<any> {
    var headers = new HttpHeaders({  'content-Type': 'application/pdf',Authorization: localStorage.getItem('token')??'' });
    return this._http.get(`${environment.BASE_URL}expediente_unico/documento/archivo/${idType}?download=1`, {responseType: 'arraybuffer' ,headers: headers})
  }
  getDocumentArchivoInfoByID(idType:string):Observable<any> {
    return this._http.get<any>(`${environment.BASE_URL}expediente_unico/documento/archivo_info/${idType}`, {headers: this._getHeaders()})
  }



  getAreas():Observable<any> {
    return this._http.get<any>(`${environment.BASE_URL}expediente_unico/areas`, {headers: this._getHeaders()})
  }
  getSubtipos(exp:string):Observable<any> {
    return this._http.get<any>(`${environment.BASE_URL}expediente_unico/sub_tipos/list?expediente=${exp}`, {headers: this._getHeaders()})
  }

  getTramos(area:any):Observable<any> {
    return this._http.get<any>(`${environment.BASE_URL}expediente_unico/tramos?area=${area}`, {headers: this._getHeaders()})
  }
}
