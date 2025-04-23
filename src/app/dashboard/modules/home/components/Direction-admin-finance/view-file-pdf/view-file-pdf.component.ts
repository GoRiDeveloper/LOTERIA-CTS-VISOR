import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PDFDocument } from 'pdf-lib';
import { Result } from 'src/app/interfaces/dependencyStructure.interface';
import { DirectoriosServicesService } from 'src/app/services/directorios-services.service';

@Component({
  selector: 'app-view-file-pdf',
  templateUrl: './view-file-pdf.component.html',
  styleUrls: ['./view-file-pdf.component.css'],
})
export class ViewFilePdfComponent implements OnInit {
  @Input() fileId?: any;
  @Input() download: boolean = false;
  @Input() documentData?: Result;
  @Input() closeModal?: () => void;

  public isLoadingPdf: boolean = true;
  public namePDF?: string;
  public pdfSrc: any = '';
  public pdfinfo = {
    id: 0,
    nombre: '',
    ext: '',
    paginas: 0,
  };
  public page: number = 1;
  public lastPageViewed?: number;

  constructor(
    private _dependencyService: DirectoriosServicesService,
    private _toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getDocumentData();
  }

  descargar() {
    if (this.download)
      this._dependencyService
        .getDocumentArchivoDescargarByID(this.fileId)
        .subscribe({
          next: (response) => {
            const blob = new Blob([response], {
              type: 'application/pdf',
            });
            const url = window.URL.createObjectURL(blob);
            // Configurar el nombre del archivo con la extensión especificada
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = `${this.fileId}.pdf`; // Agrega la extensión correcta
            anchor.click();
            // Liberar la URL creada para liberar memoria
            window.URL.revokeObjectURL(url); // Llama a la función con la extensión correspondiente
          },
          error: (err) => {
            console.error('Error al descargar el archivo', err);
          },
        });
  }

  getDocumentData() {
    const idDoc = this.documentData?.documento_id.toString();
    this.namePDF = this.documentData?.nombre_archivo;

    this._dependencyService.getDocumentArchivoInfoByID(idDoc!).subscribe({
      next: (response) => {
        this.pdfinfo.ext = response.ext;
        this.pdfinfo.ext = response.ext;
        this.pdfinfo.nombre = response.nombre;
        this.pdfinfo.paginas = response.paginas;
        this.pdfinfo.id = this.documentData?.documento_id!;

        this.loadPdf(this.pdfinfo.id, 1, this.pdfinfo.paginas);
      },
      error: (err) => {
        console.error('Error loading PDF:', err);
        this._toastr.error('', `Error al cargar el PDFs.`, {
          progressBar: true,
          progressAnimation: 'increasing',
        });
        this.isLoadingPdf = false;
        this.closeModal!();
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
        // const firtsPagesLoaded = 20;

        const partialPdf = await this.loadPartialPdf(
          pk,
          startPage,
          firtsPagesLoaded
        );
        const newPdfDoc = await this.processPdf(
          partialPdf,
          startPage,
          firtsPagesLoaded
        );

        // Mostrar las primeras páginas
        this.displayPdf(partialPdf, 1, 1, firtsPagesLoaded);

        // Cargar el resto de las páginas en segundo plano
        this.loadRemainingPages(pk, 1, endPage, newPdfDoc);
      } else {
        const completePDF = await this.loadPartialPdf(pk, startPage, endPage);
        this.displayPdf(completePDF, 1, endPage, endPage, true);
      }
    } catch {
      (error: any) => {
        console.log('Error occurred:');
        console.error('Error loading PDF:', error);
        this._toastr.error('', `Error al cargar el PDF.`, {
          progressBar: true,
          progressAnimation: 'decreasing',
        });
        this.isLoadingPdf = false;
      };
    }
  }

  async loadRemainingPages(
    pk: number,
    startPage: number,
    endPage: number,
    basePdfDoc: PDFDocument
  ): Promise<void> {
    try {
      const remainingPdf = await this.loadPartialPdf(pk, startPage, endPage);
      const newPdfDoc = await this.processPdf(
        remainingPdf,
        startPage,
        endPage,
        basePdfDoc
      );

      // Mantener la página actual
      const currentPage = this.page;
      this.displayPdf(remainingPdf, currentPage, startPage, endPage, true);
    } catch (error) {
      console.error('Error loading remaining pages:', error);
    }
  }

  async loadPartialPdf(
    pk: number,
    startPage: number,
    endPage: number
  ): Promise<PDFDocument> {
    const response = await this._dependencyService
      .getDocumentByPages(pk, startPage, endPage)
      .toPromise();
    if (!response) {
      throw new Error('No se ha recibido ningún documento');
    }
    const blob = new Blob([response], { type: 'application/pdf' });
    const arrayBuffer = await blob.arrayBuffer();
    return await PDFDocument.load(arrayBuffer);
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
    pdfDoc
      .save()
      .then((pdfBytes) => {
        const newBlob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(newBlob);
        this.pdfSrc = url;
        this.page = currentPage;
        this.isLoadingPdf = false;

        if (!downloadComplete) {
          this._toastr.info(
            'Tu archivo se ha cargado parcialmente.',
            `Se han cargado ${totalPages} de ${this.pdfinfo.paginas}.`,
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
      })

      .then(() => {
        // Ir a la última página vista después de la carga completa,
        if (downloadComplete) {
          setTimeout(() => {
            this.lastPageViewed = currentPage - 1;
            this.changePage(this.lastPageViewed);
          }, 800);
        }
      });
  }

  changePage(value: number) {
    this.page = value + 1;
  }
}
