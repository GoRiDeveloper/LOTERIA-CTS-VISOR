import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDropdownConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TreeNode } from 'primeng/api';
import { finalize, lastValueFrom } from 'rxjs';
import { dependencyStructureMapper } from 'src/app/infraestructure/mappers/dependency-estructure.mapper';
import { HandleErrorUser } from 'src/app/interceptors/handleErrorUser.interceptor';
import { UserDependecieInterface } from 'src/app/interfaces/Auth.interface';
import {
  dependencyStructure,
  DependencyStructureResponse,
  DependencyStructureUserResponse,
} from 'src/app/interfaces/dependencyStructure.interface';
import { UserDataInterface } from 'src/app/interfaces/Users.interface';
import * as CryptoJS from 'crypto-js';

import { DirectoriosServicesService } from 'src/app/services/directorios-services.service';
import { UsersService } from 'src/app/services/users.service';
import { StoreService } from 'src/app/store.service';
import { collectParentKeys } from 'src/app/utils/collectParentKeys';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./view-user.component.scss'],
})
export class ViewUserComponent implements OnInit, OnDestroy {
  selectedDependenciesTree?: TreeNode[];

  public isLoading: boolean = true;
  public users: UserDataInterface[] = [];
  public user: UserDataInterface = <UserDataInterface>{};
  private userId: string = '';
  public filteredDependencies: UserDependecieInterface[] = [];
  public search: string = '';
  public activos: boolean = true;
  public pageCurrent: number = 1;
  public pagemax: number = 1;
  public src: string = '';
  public isToCreateUser: boolean = false;
  public selectedDepUserUpdate?: dependencyStructure[];
  public selectedDepUserCreate?: dependencyStructure[];
  public selectedDepTree?: dependencyStructure[];
  public disableBtn: boolean = true;
  public userRol: number = NaN;
  public dependencies?: DependencyStructureResponse[];

  public userIdCreated?: string;

  public model: any;

  userForm: FormGroup = this.formBuilder.group({
    first_name: ['', Validators.required],
    username: ['', [Validators.required, Validators.email]],
    last_name: ['', Validators.required],
    password: ['', Validators.required],
    dependencias: [],
    telefono: ['', Validators.required],
    rol: ['1', Validators.required],
    descargas: [false, Validators.required],
  });

  EditUserForm: FormGroup = this.formBuilder.group({
    first_name: [''],
    username: [''],
    last_name: [''],
    password: [''],
    email: ['', Validators.email],
    // dependencias: [''],
    telefono: [''],
    rol: ['1', Validators.required],
    descargas: [false, Validators.required],
    expediente_ver: [''],
  });

  usernameUpdateForm: FormGroup = this.formBuilder.group({
    username: ['', Validators.required],
    password: [''],
  });

  constructor(
    private modalService: NgbModal,
    config: NgbDropdownConfig,
    private _userService: UsersService,
    private formBuilder: FormBuilder,
    private _toastService: ToastrService,
    private _store: StoreService,
    private _handleErrorUser: HandleErrorUser,
    private _dependencyService: DirectoriosServicesService
  ) {
    config.placement = 'right';
  }
  ngOnDestroy(): void {
    this.modalService.dismissAll();
  }

  ngOnInit(): void {
    this.getAllUsers();
    let bytes = CryptoJS.AES.decrypt(
      localStorage.getItem('data') || '',
      localStorage.getItem('token') || ''
    );

    const userData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    this.userRol = userData.rol;
  }

  open(content: any) {
    this.user = <UserDataInterface>{};
    this.userForm.reset();
    this.model = null;
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      size: 'lg',
      windowClass: 'modal__window-background',
    });
  }

  openUpdateUser(content: any, user: UserDataInterface) {
    const { id } = user;
    if (id) this.userId = id;
    this.user = user;
    this.EditUserForm.reset(this.user);

    // Cargar dependencias que ya tiene seleccionado el usuario
    if (!id) return;
    this.getJerarquiaUser(id);

    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      size: 'lg',
      windowClass: 'modal__window-background',
    });
  }

  irPagina(pagina: any) {
    try {
      this.pageCurrent = parseInt(pagina);
      if (this.pageCurrent < 1) {
        this.pageCurrent = 1;
      } else if (this.pageCurrent > this.pagemax) {
        this.pageCurrent = this.pagemax;
      }
      this.getAllUsers();
    } catch (error) {}
  }

  searchEnter(search: string) {
    this.search = search;
    this.pageCurrent = 1;
    this.getAllUsers();
  }
  getAllUsers() {
    let filtros = new Map<string, any>();
    filtros.set('is_active', this.activos);
    filtros.set('page', this.pageCurrent);
    if (this.search.length > 0) {
      filtros.set('search', this.search);
    }

    // Crear una clave única basada en los filtros
    // const cacheKey = JSON.stringify(Array.from(filtros.entries()));

    // Verificar si la respuesta está en caché, si lo está toma el tree del caché
    // const cachedUsers = this._cacheService.get(cacheKey);
    // if (cachedUsers) {
    //   this.pagemax = Math.ceil((cachedUsers.count * 1.0) / 10);
    //   this.users = cachedUsers.results;
    //   this.isLoading = false;
    //   return;
    // }

    // Si no está en caché, hacer la petición HTTP
    this._userService.getAllUsersPaginado(filtros).subscribe({
      next: (response) => {
        // Guardar la respuesta en caché
        // this._cacheService.set(cacheKey, response);

        this.pagemax = Math.ceil((response.count * 1.0) / 10);
        this.users = response.results;
        this.isLoading = false;
      },
    });
  }

  async onSubmit() {
    this.selectedDepUserCreate = this.selectedDepTree;

    if (!this.userForm.valid) {
      this._toastService.warning('Todos los campos son requeridos');
      return;
    }
    if (!this.selectedDepUserCreate?.length) {
      this._toastService.warning('Debe agregar al menos una dependencia');
      return;
    }

    const idSet = new Set<string>();
    const idSup = this.selectedDepUserCreate
      .map((dependency: dependencyStructure) => dependency.dependencia_superior)
      .filter((item) => item !== null) as string[];

    this.selectedDepUserCreate.forEach((dependencia) => {
      const arrNumb = dependencia.key;
      idSup.push(arrNumb!);
      idSet.add(arrNumb!);
      collectParentKeys(dependencia, idSet);
    });

    const dependenciesId = [...idSet];
    this.userForm.get('dependencias')?.setValue([]);

    this.user = this.userForm.value;
    this.user.email = this.user.username;

    try {
      // Creación de usuario sin dependencias
      const response = await lastValueFrom(
        this._userService.postCreateUser(this.user)
      );
      this.userIdCreated = response.id;

      // Se actualiza el usuario para asignar dependencias
      if (this.userIdCreated) {
        await lastValueFrom(
          this._userService.putUpdateDepUser(this.userIdCreated, dependenciesId)
        );
        this._toastService.success('Usuario creado con éxito');
        this.getAllUsers();
        this.modalService.dismissAll();
      }
    } catch (error) {
      this._handleErrorUser.handleError(error);
    }
  }

  handleDisableUser(user: UserDataInterface) {
    let data = {
      is_active: !user.is_active,
    };
    this._userService.putUpdateStatusUser(data, user.id || '').subscribe({
      next: (response) => {
        this._toastService.success('Usuario actualizado con éxito');
        this.getAllUsers();
        this.modalService.dismissAll();
      },
    });
  }

  openModalDependencies(content: any, createUser?: boolean) {
    if (createUser) this.isToCreateUser = createUser;
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      fullscreen: true,
      windowClass: 'modal__window-background',
    });
  }

  onSubmitEditUser() {
    if (!this.EditUserForm.valid) {
      this._toastService.warning('Todos lo campos son requeridos');
      return;
    }

    // this.EditUserForm.get('dependencias')?.setValue([]);
    this.user = { ...this.user, ...this.EditUserForm.value };
    delete this.user.id_externo;
    delete this.user.id;
    delete this.user.dependencias;

    if (!this.user.password) delete this.user.password;

    this._userService.putUpdateUser(this.user, this.userId).subscribe({
      next: (resp) => {
        this._toastService.success('Datos de usuario actualizados con éxito');
        this.getAllUsers();
        this.modalService.dismissAll();

        //Actualizar las dependencias en caso de requerirlo
        if (this.selectedDepTree) {
          this.updateDepUser();
        }
      },
      error: (error: any) => {
        this._handleErrorUser.handleError(error);
      },
    });
  }

  updateDepUser() {
    if (!this.selectedDepTree) return;

    const idSet = new Set<string>();

    const idSup = this.selectedDepTree
      .map((dependency: dependencyStructure) => dependency.dependencia_superior)
      .filter((item) => item !== null) as string[];

    this.selectedDepTree.forEach((dependencia) => {
      const arrNumb = dependencia.key;
      idSup.push(arrNumb!);
      idSet.add(arrNumb!);
      collectParentKeys(dependencia, idSet);
    });

    const dependenciesId = [...idSet];
    this._userService
      .putUpdateDepUser(this.userId, dependenciesId ?? [])
      .subscribe({
        next: (resp) => {
          this._toastService.success(
            'Dependencias del usuario actualizadas con éxito'
          );
          this.getAllUsers();
          this.modalService.dismissAll();
        },
        error: (err) => {
          this._handleErrorUser.handleError(err);
        },
      });
  }

  cambiarActivos() {
    this.activos = !this.activos;
    this.getAllUsers();
  }

  handleBeforePage() {
    this.pageCurrent--;
    this.getAllUsers();
  }

  handleNextPage() {
    this.pageCurrent++;
    this.getAllUsers();
  }

  handleOpenMenu() {
    this._store.handleCanvas(true);
  }

  //Cargar depencencias que tiene el usuario
  getJerarquiaUser(id: string) {
    this.disableBtn = true;
    this._dependencyService
      .getJerarquiaUser(id)
      .pipe(
        finalize(() => {
          // Esta lógica se ejecuta siempre, independientemente de si hay un error o no.
          this.disableBtn = false;
        })
      )
      .subscribe({
        next: (resp: DependencyStructureUserResponse) => {
          const { dependencias } = resp;

          this.selectedDepUserUpdate = dependencias.map(
            (dependency: DependencyStructureResponse) =>
              dependencyStructureMapper.dependencyStructureToEntity(dependency)
          );
        },
        error: (error) => {
          this._handleErrorUser.handleError(error);
        },
      });
  }

  onSelectedDepChange(selectedFiles: TreeNode[]): void {
    this.selectedDepTree = selectedFiles;
  }

  onDependenciesObtained(dependencies: DependencyStructureResponse[]) {
    this.dependencies = dependencies;
  }
}
