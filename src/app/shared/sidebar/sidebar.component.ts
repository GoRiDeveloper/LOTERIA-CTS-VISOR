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
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { DependencyStructureResponse } from 'src/app/interfaces/dependencyStructure.interface';
import { TreeNode } from 'primeng/api';
import { DependenciesStructureToSidebar } from 'src/app/infraestructure/mappers/dependencies-sidebar.mapper';
import { limitJsonDepth } from '../../utils/limitjson';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SidebarComponent implements OnInit {
  public dependencies: any;
  public treeDependencies: TreeNode[] = [];
  userData: any;
  userType: string = '';
  public userInfo: any;
  closeResult = '';
  public idSuperior: string = '';
  private userId?: string;

  // Varibles para sidebar
  public subDependencies: any = [];
  public subDependecyName: string = '';
  public subDependenciesMap: DependencyStructureResponse[] = [];
  public subDependenciesMapId: string[] = [];
  public isCollapseExpedienteIndex: number | null = null;

  public currentURL?: string;

  constructor(
    private modalService: NgbModal,
    private _router: Router,
    private _userService: UsersService,
    private offcanvasService: NgbOffcanvas,
    private _dependecyService: DirectoriosServicesService
  ) {}

  ngOnInit(): void {
    let bytes = CryptoJS.AES.decrypt(
      localStorage.getItem('data') || '',
      localStorage.getItem('token') || ''
    );
    this.userData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    this.userId = this.userData.user_id;

    this.getDepencenciaList();
    this.getUserInfo();
    this.handleCurrentRoute();
  }

  getDepencenciaList() {
    if (!this.userId) return;
    try {
      this._dependecyService.getDepedendencyStructure().subscribe({
        next: (response: any) => {
          // const { dependencias } = response;

          const responseTree = response.map(
            (item: DependencyStructureResponse) => {
              return DependenciesStructureToSidebar.depStructureToSidebarEntity(
                item
              );
            }
          );
          this.treeDependencies = limitJsonDepth(responseTree, 8);
        },
      });
    } catch (error) {
      console.log(error);
    }
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
        if (response.rol === 1) this.userType = 'Administrador';
        else if (response.rol === 3) this.userType = 'Capturista';
        else if (response.rol === 4) this.userType = 'Encargado';
        else this.userType = 'Usuario';

        localStorage.setItem('expediente_ver', response.expediente_ver);
        localStorage.setItem('user_id', response.user_id);
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

  handleCurrentRoute() {
    setTimeout(() => {
      this.currentURL = this._router.url;
    }, 200);
  }
}
