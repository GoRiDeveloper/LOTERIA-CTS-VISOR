import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  ChildrensIDResponse,
  DependencyStructureResponse,
  SearchFilesByQueryResponse,
} from '../interfaces/dependencyStructure.interface';
import {
  AddDependencie,
  AddDependencieResponse,
} from '../interfaces/addDependencie.interface';
import {
  AddFileNewDepResponse,
  AddNewFileResponse,
} from '../interfaces/addFileNewDep';
import {
  AddFieldFile,
  addsHeaders,
} from '../interfaces/addFieldsFile.interface';
import { GetFieldsFileResponse } from '../interfaces/getFieldsFile.interface';
import {
  AddFileGhost,
  AddFileGhostResponse,
} from '../interfaces/addFileGhost.interface';
import { CreateHeadersResponse } from '../interfaces/createHeader.interface';

@Injectable({
  providedIn: 'root',
})
export class DirectoriosServicesService {
  public dependencies: any;

  constructor(private _http: HttpClient) {}

  private _getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token') ?? '',
    });
  }

  getDependecy(): Observable<any> {
    return this._http.get<any>(
      `${environment.BASE_URL}dependencia/inicial_usuario/`,
      {
        headers: this._getHeaders(),
      }
    );
  }

  getMetadata() {
    return this._http.get<any>(`${environment.BASE_URL}obtenerEncabezados/`, {
      headers: this._getHeaders(),
    });
  }
  addDependency(data: AddDependencie) {
    return this._http.post<AddDependencieResponse>(
      `${environment.BASE_URL}agregarDependencia/`,
      data,
      {
        headers: this._getHeaders(),
      }
    );
  }

  addFileNewDep(data: any): Observable<any> {
    return this._http.post<AddFileNewDepResponse>(
      `${environment.BASE_URL}agregarHojaDependencia/`,
      data,
      {
        headers: this._getHeaders(),
      }
    );
  }

  addTagType(data: any): Observable<any> {
    return this._http.post<any>(
      `${environment.BASE_URL}agregarCatalogoTipo/`,
      data,
      {
        headers: this._getHeaders(),
      }
    );
  }

  addFileGhost(data: AddFileGhost): Observable<AddFileGhostResponse> {
    return this._http.post<any>(
      `${environment.BASE_URL}documentoFantasma/`,
      data,
      {
        headers: this._getHeaders(),
      }
    );
  }

  addTemporalDep(id: string, headersTable: number[]): Observable<any> {
    const data = {
      encabezados: headersTable,
    };
    return this._http.post<any>(
      `${environment.BASE_URL}dependenciaTemporal/${id}/`,
      data,
      {
        headers: this._getHeaders(),
      }
    );
  }

  createHeader(header: string): Observable<CreateHeadersResponse> {
    return this._http.post<any>(
      `${environment.BASE_URL}obtenerEncabezados/${header}/`,
      {}, // Cuerpo vacío
      {
        headers: this._getHeaders(),
      }
    );
  }

  uploadPDF(formData: FormData): Observable<AddNewFileResponse> {
    return this._http.post<any>(`${environment.BASE_URL}subirPDF/`, formData, {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem('token') ?? '',
      }),
    });
  }
  getFieldsFile(id: string): Observable<GetFieldsFileResponse[]> {
    return this._http.get<GetFieldsFileResponse[]>(
      `${environment.BASE_URL}agregarCampos/${id}/`,
      {
        headers: this._getHeaders(),
      }
    );
  }

  editFieldsFile(data: any): Observable<GetFieldsFileResponse> {
    return this._http.put<GetFieldsFileResponse>(
      `${environment.BASE_URL}agregarCampos/`,
      data,
      {
        headers: this._getHeaders(),
      }
    );
  }

  addFieldsFile(data: addsHeaders): Observable<AddFieldFile> {
    const { documentoId, ...rest } = data;
    const id = documentoId.toString();
    return this._http.post<any>(
      `${environment.BASE_URL}agregarCampos/${id}/`,
      rest,
      {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('token') ?? '',
        }),
      }
    );
  }

  insertNewFile(idDocument: number): Observable<any> {
    return this._http.get<any>(
      `${environment.BASE_URL}obtenerPath/${idDocument}`,
      {
        headers: this._getHeaders(),
      }
    );
  }

  deleteFileBD(id: number): Observable<any> {
    return this._http.delete<any>(
      `${environment.BASE_URL}agregarCampos/${id}/`,
      {
        headers: this._getHeaders(),
      }
    );
  }

  editPdf(data: FormData): Observable<any> {
    return this._http.patch<any>(`${environment.BASE_URL}modificarPDF/`, data, {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem('token') ?? '',
      }),
    });
  }

  cargarDepartamentosScript(data: any): Observable<any> {
    return this._http.post<any>(
      `${environment.BASE_URL}dependencia/cargarDepartamentosScript`,
      data,
      { headers: this._getHeaders() }
    );
  }
  borrarDepartamento(data: any): Observable<any> {
    return this._http.post<any>(
      `${environment.BASE_URL}dependencia/borrarDepartamento`,
      data,
      { headers: this._getHeaders() }
    );
  }
  borrarDocumentosDepartamento(data: any): Observable<any> {
    return this._http.post<any>(
      `${environment.BASE_URL}dependencia/borrarDocumentosDepartamento`,
      data,
      { headers: this._getHeaders() }
    );
  }

  getDepedenciesInitialStructure(): Observable<any> {
    return this._http.get<DependencyStructureResponse>(
      `${environment.BASE_URL}dependencia/total_documentos/`,
      { headers: this._getHeaders() }
    );
  }

  getDependecySearch(search: string): Observable<any> {
    return this._http.get<any>(
      `${environment.BASE_URL}dependencia/buscar?nombre=${search}`,
      { headers: this._getHeaders() }
    );
  }

  getDepedendencyStructure(): Observable<any> {
    return this._http.get<DependencyStructureResponse>(
      `${environment.BASE_URL}jerarquia`,
      { headers: this._getHeaders() }
    );
  }

  getIdsChildren(dependencia_indice: string): Observable<any> {
    return this._http.get<ChildrensIDResponse>(
      `${environment.BASE_URL}jerarquiaDividida/${dependencia_indice}/`,
      { headers: this._getHeaders() }
    );
  }
  getJerarquiaUser(id: string): Observable<any> {
    return this._http.get<DependencyStructureResponse>(
      `${environment.BASE_URL}jerarquiaUsuario/${id}/`,
      { headers: this._getHeaders() }
    );
  }

  getNumDocument(depIndice: number): Observable<any> {
    return this._http.get<DependencyStructureResponse>(
      `${environment.BASE_URL}JerarquiaNumeroDocumentos/${depIndice}/`,
      { headers: this._getHeaders() }
    );
  }

  getListDocumentsById(data: any): Observable<any> {
    return this._http.post<SearchFilesByQueryResponse>(
      `${environment.BASE_URL}fetch-documents/`,
      data,
      {
        headers: this._getHeaders(),
      }
    );
  }

  getDependecyByID(idSuperior: string): Observable<any> {
    return this._http.get<any>(
      `${environment.BASE_URL}dependencia/list_usuario?superior=${idSuperior}`,
      { headers: this._getHeaders() }
    );
  }
  getTypeDocumentByID(idDependecy: string): Observable<any> {
    return this._http.get<any>(
      `${environment.BASE_URL}dependencia/tipo_documento/list?dependencia=${idDependecy}`,
      { headers: this._getHeaders() }
    );
  }
  getTypeDocumentByIDType(filtros: Map<string, string>): Observable<any> {
    let params = new HttpParams();

    filtros.forEach((valor, key) => {
      params = params.append(key, valor);
    });

    return this._http.get<any>(
      `${environment.BASE_URL}dependencia/documento/list2`,
      { headers: this._getHeaders(), params: params }
    );
  }

  getDocumentByID(idType: string): Observable<any> {
    return this._http.get<any>(
      `${environment.BASE_URL}dependencia/documento/archivo/${idType}`,
      { headers: this._getHeaders() }
    );
  }
  getDocumentArchivoByID(idType: string, page: number): Observable<any> {
    var headers = new HttpHeaders({
      'content-Type': 'application/pdf',
      Authorization: localStorage.getItem('token') ?? '',
    });
    return this._http.get(
      `${environment.BASE_URL}dependencia/documento/archivo/${idType}?page=${page}`,
      { responseType: 'arraybuffer', headers: headers }
    );
  }

  getDocumentByPages(
    pk: number,
    start_page: number,
    end_page: number
  ): Observable<Blob> {
    const headers = new HttpHeaders({
      Authorization: localStorage.getItem('token') ?? '',
    });

    return this._http.get(
      `${environment.BASE_URL}dependencia/documento/pdf/${pk}?start_page=${start_page}&end_page=${end_page}`,
      { responseType: 'blob', headers: headers }
    );
  }

  getDocumentArchivoDescargarByID(id: string): Observable<any> {
    return this._http.get(`${environment.BASE_URL}descargarDocumento/${id}/`, {
      responseType: 'arraybuffer',
      headers: this._getHeaders(),
    });
  }
  getDocumentArchivoInfoByID(idType: string): Observable<any> {
    return this._http.get<any>(
      `${environment.BASE_URL}dependencia/documento/archivo_info/${idType}`,
      { headers: this._getHeaders() }
    );
  }

  putDarBaja(documento_id: string): Observable<any> {
    return this._http.put<any>(
      `${environment.BASE_URL}dependencia/documento/dar_baja/${documento_id}`,
      {},
      { headers: this._getHeaders() }
    );
  }

  updateDependencie(id: string, data: { nombre: string }): Observable<any> {
    return this._http.post<any>(
      `${environment.BASE_URL}dependencia/modificarNombre/${id}/`,
      data,
      { headers: this._getHeaders() }
    );
  }

  hashDependency(dependenciaId: string): Observable<any> {
    return this._http.post<any>(
      `${environment.BASE_URL}ocrDependencia`,
      {
        dependencia_id: dependenciaId,
      },
      { headers: this._getHeaders() }
    );
  }
}
