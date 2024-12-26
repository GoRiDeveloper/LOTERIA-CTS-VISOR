import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpHeaders } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { DirectoriosServicesService } from 'src/app/services/directorios-services.service';
import { filterDate } from 'src/app/utils/filterDate';
import { ToastrService } from 'ngx-toastr';
import { PDFDocument } from 'pdf-lib';
import { StoreLocalStorage } from 'src/app/services/sesionStorage.service';
import { HeadersInterface } from 'src/app/interfaces/headersData.interface';
import { CurrentRoute } from 'src/app/interfaces/currentRoute.interface';

@Component({
  selector: 'app-gerencia-tesoreria',
  templateUrl: './gerencia-tesoreria.component.html',
  styleUrls: ['./gerencia-tesoreria.component.css'],
})
export class GerenciaTesoreriaComponent implements OnInit {
  public dateFormat?: string;
  public pdfQuery: string = '';
  public pagesRendered?: number;
  public pagePDF?: number;
  public isLoadingData: boolean = true;
  public isLoadingPdf: boolean = false;
  public isNotPdf: boolean = false;
  public typeDocument: any;
  private idDependecy: string = '';
  public idType: string = '';
  nombreType: string = '';
  public documents: any;
  public titleTable?: string;
  public searchInput: string = '';
  public pageCurrent: number = 1;
  public order: number = 0;
  public limitPage: number = 10;
  public fileCurrent: any;
  public page: number = 1;
  public id: string = '';
  public _showAll: boolean = true;
  public headerSearch: number = 0;
  public headers?: HeadersInterface[] | [];
  public filterData: any[] = [];
  public ocr: string = '';
  public user_id?: string;
  public user_role?: number;
  public messages: Array<string> = [];
  public nameFile: string = '';
  public: string = '';
  pdfSrc: any = '';
  pdfinfo = {
    id: 0,
    nombre: '',
    ext: '',
    paginas: 0,
  };
  public dependenciaIndice?: string;
  public dependenciaId?: string;
  public currentTag?: string;
  public editablesExist: boolean = false;
  public isCreate: string = 'Crear';

  public lastPageViewed?: number;
  public filesViewed: string[] = [];

  public rutasBreadcrumb: CurrentRoute[] = [];
  public rutasData: any = [];

  public vinculados: boolean = true;
  public isLoading: boolean = false;
  public documentSelected?: any;

  public sub_expediente: string = '';
  public tramo_id: string = '';
  public area_id: string = '';
  // Props Pdf

  _zoom: number = 0.7;

  constructor(
    private _dependecyService: DirectoriosServicesService,
    private _activateRoute: ActivatedRoute,
    private modalService: NgbModal,
    private _toastr: ToastrService,
    private _http: HttpClient,
    private _storeLocalStorage: StoreLocalStorage
  ) {}

  ngOnInit(): void {
    this.user_id = localStorage.getItem('user_id')!;
    this.user_role = Number(localStorage.getItem('user_role'));
    this._activateRoute.paramMap.subscribe((params) => {
      this.idDependecy = params.get('id') || '';
      this.getRutas();
      this.getTypeDocument();
    });

    if (this._storeLocalStorage.get('idsViewed') !== null)
      this.filesViewed = this._storeLocalStorage.get('idsViewed');
  }

  getTypeDocument() {
    this._dependecyService.getTypeDocumentByID(this.idDependecy).subscribe({
      next: (response) => {
        this.typeDocument = response;
        this.idType = this.typeDocument[0]?.id;
        this.currentTag = this.idType?.toString();

        this.getDocumentsByType();
      },
    });
  }

  getRutas() {
    this._dependecyService.getDependecyByID(this.idDependecy).subscribe({
      next: (response) => {
        const { rutas } = response;
        this.rutasData = [...rutas].reverse();
        this.rutasBreadcrumb = [...rutas].reverse();
        this.rutasBreadcrumb = this.rutasBreadcrumb.slice(
          0,
          this.rutasData.length - 1
        );

        // Obetner la ruta actual
        const currentRoute: CurrentRoute =
          this.rutasData[this.rutasData.length - 1];

        this.titleTable = currentRoute.nombre;
        this.dependenciaIndice = currentRoute.dependencia_indice;
        this.dependenciaId = currentRoute.id;
      },
    });
  }

  buscarHeader() {
    this.pageCurrent = 1;
    this.getDocumentsByType();
  }
  darBaja(document_id: string) {
    this._dependecyService.putDarBaja(document_id).subscribe({
      next: (response) => {
        if (response.success == 1) {
          this.getDocumentsByType();
        }
      },
    });
  }
  getDocumentsByType() {
    const normalizedInput = this.searchInput
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    var filtros = new Map<string, any>();
    filtros.set('tipo', this.idType);
    filtros.set('buscar', normalizedInput);
    filtros.set('page', this.pageCurrent);
    filtros.set('order', this.order);
    filtros.set('limit', this.limitPage);
    filtros.set('dependencia', this.idDependecy);
    if (this.ocr.length > 0) {
      filtros.set('ocr', this.ocr);
    }
    if (this.vinculados == true) {
      filtros.set('vinculados', 1);
    } else {
      filtros.set('vinculados', 0);
    }
    if (this.headerSearch != 0) {
      filtros.set('header', this.headerSearch);
    }

    this._dependecyService.getTypeDocumentByIDType(filtros).subscribe({
      next: (response) => {
        const { documentos_editables } = response;
        this.documents = response;

        if (documentos_editables > 0) this.editablesExist = true;

        filterDate(this.documents.data);

        // const map = new Map();

        // for (let header of this.documents.headers) {
        //   map.set(header.nombre, header.nombre);
        // }
        // console.log({ map: map.values() });

        this.filterData = this.documents.headers as any[];
        // this.filterData = this.documents.headers.filter(
        //   (item: { nombre: string }) =>
        //     item.nombre !== 'AREA' &&
        //     item.nombre !== 'ÁREA' &&
        //     item.nombre !== 'AREA ADSCRITA' &&
        //     item.nombre !== 'UNIDAD ADMINISTRATIVA' &&
        //     item.nombre !== 'NUMERO DE IMÁGENES' &&
        //     item.nombre !== 'Número de Imágenes' &&
        //     item.nombre !== 'Numero de Imágenes' &&
        //     item.nombre !== 'NUMERO DE IMAGENES' &&
        //     item.nombre !== 'None'
        // );
        this.headers = this.filterData;
        if (this.headers && this.headers.length == 0) {
          this.headers = this.documents.headers;
        }

        if (this.documents.data) {
          this.isLoadingData = false;
        }
      },
    });
  }

  deleteFile() {
    const idDocumento = parseInt(this.documentSelected.documento_id);

    this._dependecyService.deleteFileBD(idDocumento).subscribe({
      next: () => {
        this._toastr.success('', 'Documento Eliminado');
        this.modalService.dismissAll();
        this.getTypeDocument();
      },
      error: (error) => {
        this._toastr.error('', 'Error al eliminar el documento');
        this.modalService.dismissAll();
      },
    });
  }

  handleChangeType(tipo: any) {
    this.idType = tipo.id;
    this.nombreType = tipo.nombre;
    this.pageCurrent = 1;
    this.documents = undefined;
    this.headers = [];
    this.getDocumentsByType();
  }

  handleBeforePage() {
    this.pageCurrent--;
    this.getDocumentsByType();
  }

  handleNextPage() {
    this.pageCurrent++;
    this.getDocumentsByType();
  }

  handleSetLimitPage() {
    this.pageCurrent = 1;
    this.getDocumentsByType();
  }

  descargar() {
    this._dependecyService.getDocumentArchivoDescargarByID(this.id).subscribe({
      next: (response) => {
        const fileName = this.pdfinfo.nombre; // Nombre base del archivo
        const extension = this.pdfinfo.ext; // Determina la extensión según el tipo de archivo

        this.downLoadFile(response, fileName, extension); // Llama a la función con la extensión correspondiente
      },
      error: (err) => {
        console.error('Error al descargar el archivo', err);
      },
    });
  }

  irPagina(pagina: string) {
    try {
      this.pageCurrent = parseInt(pagina);
      if (this.pageCurrent < 0) {
        this.pageCurrent = 0;
      } else if (this.pageCurrent > this.documents.paginas) {
        this.pageCurrent = this.documents.paginas;
      }
      this.getDocumentsByType();
    } catch (error) {
      console.log(error);
    }
  }

  buscarvinculados() {
    this.pageCurrent = 1;
    this.getDocumentsByType();
  }

  changePage(value: number) {
    this.page += value;
  }

  openModal(
    content: any,
    data?: any,
    size: string = 'xl',
    editFile: boolean = false
  ) {
    console.log({ data });

    this.documentSelected = data;
    this.modalService.open(content, {
      size,
      centered: true,
      // scrollable: true,
    });
    if (editFile) {
      this.isCreate = 'Editar';
    } else {
      this.isCreate = 'Crear';
    }
  }

  openArchivoDocumento(id: string, nombre: string, content: any) {
    this.isLoadingPdf = true;
    this.isNotPdf = false;

    this.id = id;
    this.pdfSrc = '';
    this.pdfinfo = { id: 0, nombre: '', ext: '', paginas: 1 };

    this._dependecyService.getDocumentArchivoInfoByID(this.id).subscribe({
      next: (response) => {
        this.isLoadingPdf = true;
        this.page = 1;

        this.pdfinfo.ext = response.ext;
        this.pdfinfo.nombre = response.nombre;
        this.pdfinfo.paginas = response.paginas;
        this.pdfinfo.id = parseInt(this.id);

        if (this.pdfinfo.ext !== 'pdf') {
          this.isLoadingPdf = false;
          this.isNotPdf = true;

          this.modalService.open(content, {
            fullscreen: true,
            centered: true,
            windowClass: 'modal__window-background',
          });
          return;
        }

        this.loadPdf(this.pdfinfo.id, 1, this.pdfinfo.paginas);
        // Almacenar ids de archivos vistos para aplicar estilos a los mismos
        if (!this.filesViewed.includes(id)) {
          this.filesViewed.push(id);
          this._storeLocalStorage.set('idsViewed', this.filesViewed);
        }

        this.modalService.open(content, {
          fullscreen: true,
          centered: true,
          windowClass: 'modal__window-background',
        });
      },
      error: (err) => {
        console.error('Error loading PDF:', err);
        this._toastr.error('', `Error al cargar el PDF.`, {
          progressBar: true,
          progressAnimation: 'increasing',
        });
        this.isLoadingPdf = false;
      },
    });
  }

  async loadPdf(
    pk: number,
    startPage: number,
    endPage: number = 5
  ): Promise<void> {
    this.isLoadingPdf = true;
    try {
      if (endPage > 200) {
        const firtsPagesLoaded = Math.round(endPage / 5);
        const partialPdf = await this.loadPartialPdf(
          pk,
          startPage,
          firtsPagesLoaded
        );
        // const newPdfDoc = await this.processPdf(
        //   partialPdf,
        //   startPage,
        //   firtsPagesLoaded
        // );
        // console.log({ partialPdf });

        this.displayPdf(partialPdf, 1, firtsPagesLoaded, endPage);

        this.loadRemainingPages(pk, 1, endPage);
      } else {
        const completePdf = await this.loadPartialPdf(pk, startPage, endPage);

        this.displayPdf(completePdf, 1, endPage, endPage, true);
      }
    } catch (error) {
      console.error('Error occurred:', error);
      this._toastr.error('Error al cargar el PDF.', '', {
        progressBar: true,
        progressAnimation: 'decreasing',
      });
      this.isLoadingPdf = false;
    }
  }

  async loadRemainingPages(
    pk: number,
    startPage: number,
    endPage: number
  ): Promise<void> {
    try {
      const pdf = await this.loadPartialPdf(pk, startPage, endPage);
      // const newPdfDoc = await this.processPdf(
      //   remainingPdf,
      //   startPage,
      //   endPage,
      //   basePdfDoc
      // );

      // Mantener la página actual
      const currentPage = this.page;
      this.displayPdf(pdf, currentPage, startPage, endPage, true);
    } catch (error) {
      console.error('Error loading remaining pages:', error);
    }
  }

  //función que regresa parcialmente o completo el pdf
  async loadPartialPdf(
    pk: number,
    startPage: number,
    endPage: number
  ): Promise<PDFDocument> {
    const response = await this._dependecyService
      .getDocumentByPages(pk, startPage, endPage)
      .toPromise();

    if (!response) {
      throw new Error('No se ha recibido ningún documento');
    }

    const blob = new Blob([response], { type: 'application/pdf' });

    const arrayBuffer = await blob.arrayBuffer();

    return PDFDocument.load(arrayBuffer);
  }

  //función que procesa el pdf para que tengan las mismas dimensiones
  async processPdf(
    pdfDoc: PDFDocument,
    startPage: number,
    endPage: number,
    basePdfDoc?: PDFDocument
  ): Promise<PDFDocument> {
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width: targetWidth, height: targetHeight } = firstPage.getSize();

    // Crear o usar el documento PDF base
    const newPdfDoc = basePdfDoc || (await PDFDocument.create());

    for (const page of pages) {
      const { width, height } = page.getSize();
      const embeddedPage = await newPdfDoc.embedPage(page);
      const newPage = newPdfDoc.addPage([targetWidth, targetHeight]);

      const scaleX = targetWidth / width;
      const scaleY = targetHeight / height;
      const scale = Math.min(scaleX, scaleY);

      const xOffset = (targetWidth - width * scale) / 2;
      const yOffset = (targetHeight - height * scale) / 2;

      newPage.drawPage(embeddedPage, {
        x: xOffset,
        y: yOffset,
        width: width * scale,
        height: height * scale,
      });
    }

    return newPdfDoc;
  }

  displayPdf(
    pdfDoc: PDFDocument,
    currentPage: number,
    pagesToLoad: number,
    totalPages: number,
    downloadComplete?: boolean
  ): void {
    pdfDoc.save().then((pdfBytes) => {
      const newBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(newBlob);
      this.pdfSrc = url;
      this.page = currentPage;
      this.isLoadingPdf = false;

      if (!downloadComplete) {
        this._toastr.info(
          'Tu archivo se ha cargado parcialmente.',
          `Se han cargado ${pagesToLoad} de ${this.pdfinfo.paginas}.`,
          {
            progressBar: true,
            progressAnimation: 'decreasing',
          }
        );
      } else {
        this._toastr.success('', `PDF cargado con éxito.`, {
          progressBar: true,
          progressAnimation: 'decreasing',
        });
      }
    });

    // .then(() => {
    //   // Ir a la última página después de la carga completa,
    //   if (downloadComplete) {
    //     setTimeout(() => {
    //       this.lastPageViewed = currentPage - 1;
    //       this.changePage(this.lastPageViewed);
    //     }, 800);
    //   }
    // });
  }

  showPdf(data: any, type: string) {
    var blob = new Blob([data], { type: type });
    var url = window.URL.createObjectURL(blob);
    var anchor = document.createElement('a');
    anchor.download = 'archivo' + this.id + '.pdf';
    anchor.href = url;
    this.pdfSrc = url;
  }

  onPdfLoaded(pdf: any): void {
    pdf.pagesCount = this.pdfinfo.paginas;
    // console.log(`El PDF tiene ${this.pdfinfo.paginas} páginas.`);
  }

  onPageRendered(event: any): void {
    // console.log(`Página ${event.pageNumber} renderizada.`);
    // const voice = new SpeechSynthesisUtterance("");
    // voice.lang = "en-US";
    // speechSynthesis.speak(voice);
  }

  pageRendered(e: CustomEvent) {
    //@ts-ignore
    // console.log(e);
    // this.page = e.pageNumber;
  }

  onPageChange(e: any) {
    this.page = e;
  }

  pageInitialized(e: CustomEvent) {
    //@ts-ignore
    this.pagesRendered = e.source.pdfDocument._pdfInfo.numPages;
  }

  downLoadFile(data: ArrayBuffer, fileName: string, extension: string) {
    // Crear el Blob en formato binario
    const blob = new Blob([data], {
      type:
        extension === 'pdf' ? 'application/pdf' : 'application/octet-stream',
    });
    const url = window.URL.createObjectURL(blob);

    // Configurar el nombre del archivo con la extensión especificada
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${fileName}.${extension}`; // Agrega la extensión correcta
    anchor.click();

    // Liberar la URL creada para liberar memoria
    window.URL.revokeObjectURL(url);
  }

  handleSetOrder(id: number) {
    if (this.order == 0 || Math.abs(this.order) != id) {
      this.order = id;
    } else if (this.order == id) {
      this.order = id * -1;
    } else {
      this.order = 0;
    }
    this.getDocumentsByType();
  }

  downloadExcel(): void {
    this.isLoading = true;
    const token = localStorage.getItem('token');

    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);

      const opcionesSolicitud = {
        headers: headers,
        observe: 'response' as const,
        responseType: 'json' as const,
      };

      var filtros = new Map<string, any>();

      filtros.set('sub_expediente', this.sub_expediente);
      filtros.set('tramo_id', this.tramo_id);
      filtros.set('tipo', this.idType);
      filtros.set('area', this.area_id);
      filtros.set('buscar', this.searchInput);
      filtros.set('page', this.pageCurrent);
      filtros.set('order', this.order);
      filtros.set('limit', this.limitPage);
      if (this.ocr.length > 0) {
        filtros.set('ocr', this.ocr);
      }
      filtros.set('dependencia', this.idDependecy);
      if (this.vinculados == true) {
        filtros.set('vinculados', 1);
      } else {
        filtros.set('vinculados', 0);
      }
      if (this.headerSearch != 0) {
        filtros.set('header', this.headerSearch);
      }

      this._http
        .get<any>(
          'http://127.0.0.1:8000/api/dependencia/documento/excel',
          opcionesSolicitud
        )
        .subscribe(
          (apiResponse) => {
            const dataJson = apiResponse.body.data;
            console.log('apiResponse', apiResponse);
            const worksheet: XLSX.WorkSheet =
              XLSX.utils.json_to_sheet(dataJson);
            const workbook: XLSX.WorkBook = {
              Sheets: { Excel: worksheet },
              SheetNames: ['Excel'],
            };
            const excelBuffer: any = XLSX.write(workbook, {
              bookType: 'xlsx',
              type: 'array',
            });
            this.saveAsExcelFile(excelBuffer, 'Excel');
            this.isLoading = false;
          },
          (error) => {
            this.isLoading = false;
            console.error(error);
          }
        );
    } else {
      console.log('Token de autenticación no encontrado');
    }
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    const link: HTMLAnchorElement = document.createElement('a');
    link.href = window.URL.createObjectURL(data);
    link.download = `${fileName}.xlsx`;
    link.click();
  }

  changeZoom(amount: number) {
    if (this._zoom <= 0 && amount === -0.1) {
      return;
    } else {
      this._zoom += amount;
      this._zoom = parseFloat(this._zoom.toFixed(2));
    }
  }

  hash() {
    this._dependecyService.hashDependency(this.dependenciaId!).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => console.error(error),
    });
  }
}
