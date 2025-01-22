import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { TreeNode } from 'primeng/api';
import { dependencyStructureMapper } from 'src/app/infraestructure/mappers/dependency-estructure.mapper';
import {
  dependencyStructure,
  DependencyStructureResponse,
} from 'src/app/interfaces/dependencyStructure.interface';
import { UserDataInterface } from 'src/app/interfaces/Users.interface';
import { CacheService } from 'src/app/services/Cache.service';

import { DirectoriosServicesService } from 'src/app/services/directorios-services.service';

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TreeViewComponent implements OnInit {
  @Input() dependenciesUser?: dependencyStructure[];
  @Input() isToCreateUser?: boolean;
  @Input() dataUser?: UserDataInterface;
  @Output() selectedDepChange: EventEmitter<TreeNode<any>[]> = new EventEmitter<
    TreeNode[]
  >();

  loadingDep: boolean = true;
  files!: TreeNode<any>[];
  selectedDep?: TreeNode<any>[];
  arrStringDep: string[] = [];

  constructor(
    private _dependencyService: DirectoriosServicesService,
    private _cacheService: CacheService
  ) {}

  ngOnInit(): void {
    this.getDepStructure();
  }

  getDepStructure() {
    //Asignar las dependencias que ya tiene seleccionado el usuario
    //sólo en caso de que se requiera actualizar el usuario
    if (this.dependenciesUser && !this.isToCreateUser) {
      this.selectedDep = this.dependenciesUser;
    }

    // Obtener árbol de dependencias del cache si está disponible
    const cachedTree = this._cacheService.get('treeDependencies');
    if (cachedTree) {
      this.files = cachedTree;

      this.selectNodesProgrammatically();
      this.loadingDep = false;
      return;
    }
    // Si el árbol de dependencias no está en el cache, se carga desde la API
    this._dependencyService.getDepedendencyStructure().subscribe({
      next: (resp) => {
        this.files = resp.map((dependency: DependencyStructureResponse) =>
          dependencyStructureMapper.dependencyStructureToEntity(dependency)
        );
        this.loadingDep = false;

        // Almacera en cache árbol de dependencias
        this._cacheService.set('treeDependencies', this.files);
        this.selectNodesProgrammatically();
      },
      error: (err) => {
        console.error('Error al cargar la estructura de dependencias:', err);
        this.loadingDep = false;
      },
    });
  }

  onSelectionChange() {
    this.selectedDepChange.emit(this.selectedDep);
  }

  expandAll() {
    this.files.forEach((node) => {
      this.expandRecursive(node, true);
    });
  }

  collapseAll() {
    this.files.forEach((node) => {
      this.expandRecursive(node, false);
    });
  }
  selectNodes(tree: TreeNode[], checkedNodes: TreeNode[], keys: string[]) {
    let count = tree.length;
    for (const node of tree) {
      // Seleccionar solo si la clave coincide
      if (node.key && keys.includes(node.key)) {
        checkedNodes.push(node);
        count--;
      }

      // Recursivamente seleccionar nodos hijos
      if (node.children) {
        this.selectNodes(node.children, checkedNodes, keys);
      }
    }

    // Verificar si el parent está parcialmente seleccionado
    if (tree.length > 0 && tree[0].parent) {
      tree[0].parent.partialSelected = count > 0 && count != tree.length;
    }
  }

  // Llamada al método selectNodes con los keys que quieres seleccionar
  selectNodesProgrammatically() {
    if (!this.dataUser?.dependencias) return;
    const numberArray = this.dataUser?.dependencias;
    const keysToBeSelected = numberArray.map((num) => num.toString());

    this.selectNodes(this.files, this.selectedDep ?? [], keysToBeSelected);
    this.onSelectionChange(); // Emitir el cambio de selección
  }

  private expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach((childNode) => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }
}
