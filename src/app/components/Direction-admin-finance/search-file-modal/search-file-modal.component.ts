import * as CryptoJS from 'crypto-js';
import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  Result,
  SearchFilesByQueryResponse,
} from 'src/app/interfaces/dependencyStructure.interface';
import { DirectoriosServicesService } from 'src/app/services/directorios-services.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { lastValueFrom } from 'rxjs';
import { UserDataInterface } from 'src/app/interfaces/Users.interface';

@Component({
  selector: 'search-file-modal',
  templateUrl: './search-file-modal.component.html',
  styleUrls: ['./search-file-modal.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SearchFileModalComponent implements OnInit {
  @ViewChild('ViewPdf') ViewFilePdfComponent!: TemplateRef<any>;
  @Input() valuesTable!: Result[];
  @Input() indiceDependencia!: string;

  public userData?: any;
  public userId?: number;

  public queryFile?: string;
  public searchFileFromModal: boolean = false;
  public inputNotValid: boolean = false;
  public isLoadingDataTable: boolean = true;
  public notValues: boolean = false;
  public selectedFile?: Result | null;
  public documentData?: any;

  constructor(
    private _dependecyService: DirectoriosServicesService,
    private _modalService: NgbModal
  ) {}

  ngOnInit() {
    let bytes = CryptoJS.AES.decrypt(
      localStorage.getItem('data') || '',
      localStorage.getItem('token') || ''
    );
    this.userData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    this.userId = this.userData.user_id;
  }

  searchFile(): void | boolean {
    // Retorna la función si al menos tiene 3 caracteres
    if (
      (this.queryFile && this.queryFile.length < 3) ||
      this.queryFile?.length === 0
    )
      return (this.inputNotValid = true);
    this.inputNotValid = false;
    this.searchFileFromModal = true;
    this.getIdsChildren(this.indiceDependencia);
  }

  async getIdsChildren(dependencia_indice: string) {
    try {
      // Obtener los IDs de las dependencias hijas

      const response = await this._dependecyService
        .getIdsChildren(dependencia_indice)
        .toPromise();
      const { Dependencias } = response;
      const idsArray = Dependencias.map((item: any) => item.id);

      const data = {
        dependencia_ids: idsArray,
        description: this.queryFile,
        usuario_id: this.userId,
      };

      // Obtener los detalles de los documentos
      const detailsResponse: SearchFilesByQueryResponse = await lastValueFrom(
        this._dependecyService.getListDocumentsById(data)
      );

      this.valuesTable = detailsResponse.results;

      if (this.valuesTable.length === 0) {
        this.notValues = true;
      } else {
        this.notValues = false;
      }

      this.searchFileFromModal = false;
      this.isLoadingDataTable = false;
    } catch (error) {
      console.error('Error fetching details:', error);
    }
  }

  openModalPdf(dependency: any) {
    this.selectedFile = dependency;
    this.documentData = { ...this.selectedFile };

    const modalRef: NgbModalRef = this._modalService.open(
      this.ViewFilePdfComponent,
      {
        fullscreen: true,
        scrollable: true,
        centered: true,
      }
    );

    modalRef.result.finally(() => {
      this.selectedFile = null; // Reinicia la selección al cerrar el modal
    });
  }

  closeModal() {
    this._modalService.dismissAll();
  }
}
