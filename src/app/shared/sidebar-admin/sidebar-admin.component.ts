import {
  Component,
  OnInit,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { DirectoriosServicesService } from 'src/app/services/directorios-services.service';
import * as CryptoJS from 'crypto-js';
import {
  NgbModal,
  NgbOffcanvas,
  OffcanvasDismissReasons,
} from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { forkJoin } from 'rxjs';
import { ItemNavbarSelect } from 'src/app/services/itemNavbarSelect.service';
@Component({
  selector: 'app-sidebar-admin',
  templateUrl: './sidebar-admin.component.html',
  styleUrls: ['./sidebar-admin.component.css'],
})
export class SidebarAdminComponent implements OnInit {
  public dependencies: any;
  userData: any;

  public userInfo: any;
  closeResult = '';
  public idSuperior: string = '';

  public subDependecyName: string = '';
  public subDependenciesMap: { [idSuperior: string]: string[] } = {};
  selectedItemIndexSubject: number | null = null;

  constructor(
    private _directoriosService: DirectoriosServicesService,
    private modalService: NgbModal,
    private _router: Router,
    private _userService: UsersService,
    private offcanvasService: NgbOffcanvas,
    private _dependecyService: DirectoriosServicesService,
    private _activateRoute: ActivatedRoute,
    private itemNavbarSelected: ItemNavbarSelect
  ) {}

  ngOnInit(): void {
    let bytes = CryptoJS.AES.decrypt(
      localStorage.getItem('data') || '',
      localStorage.getItem('token') || ''
    );
    this.userData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    // this._activateRoute.paramMap.subscribe((params) => {
    //   this.idSuperior = params.get('id') || '';
    // });
    this.getDepencenciaList();
    this.getUserInfo();

    this.itemNavbarSelected.selectedItemIndex$.subscribe((index) => {
      this.selectedItemIndexSubject = index;
    });
  }

  // Activar clase para navbar item
  onItemClick(index: number): void {
    this.itemNavbarSelected.setSelectedItemIndex(index);
  }
  //



  getDepencenciaList() {
    this._directoriosService.getDependecy().subscribe({
      next: (reponse) => {
        this.dependencies = reponse;
      },
    });
    this._dependecyService.getDependecy().subscribe({
      next: (reponse: any) => {
        reponse.forEach((element: any) => {
          if (element.id == this.idSuperior) {
            this.subDependecyName = element.nombre;
          }
        });
      },
    });
  }

  open(content: any) {
    this.modalService.dismissAll();
    this.modalService
      .open(content, {
        ariaLabelledBy: 'offcanvas-basic-title',
        size: 'md',
        centered: true,
        windowClass: 'modal__window-background',
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case OffcanvasDismissReasons.ESC:
        return 'by pressing ESC';
      case OffcanvasDismissReasons.BACKDROP_CLICK:
        return 'by clicking on the backdrop';
      default:
        return `with: ${reason}`;
    }
  }

  handleLogout() {
    const btnCross = document.getElementById('btnCross');

    this._userService.logout().subscribe({
      next: (response) => {
        localStorage.clear();
        this.modalService.dismissAll();
        this._router.navigateByUrl('/');
        if (btnCross) {
          btnCross.click();
        }
      },
    });
    localStorage.clear();
    this._router.navigateByUrl('/');
  }

  getUserInfo() {
    this._userService.getUserInfo().subscribe({
      next: (response) => {
        localStorage.setItem('expediente_ver', response.expediente_ver);
        localStorage.setItem('user_id', response.user_id);
        // localStorage.setItem('tramo',response.tramo)
        // localStorage.setItem('area',response.area)
        //obtener de este endpoint expediente_ver para ocultarlo del menu lateral
      },
    });
  }

  openBackdrop(content: TemplateRef<any>) {
    this.offcanvasService.open(content, {
      backdrop: true,
      ariaLabelledBy: 'modal-basic',
      animation: true,
    });
  }
}
