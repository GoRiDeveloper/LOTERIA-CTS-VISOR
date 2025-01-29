import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TreeNode } from 'primeng/api';
import {
  Dependencia,
  DependencyByIDResponse,
  dependencyStructure,
  DependencyStructureResponse,
} from 'src/app/interfaces/dependencyStructure.interface';
import { DirectoriosServicesService } from 'src/app/services/directorios-services.service';
import { dependencyStructureMapper } from '../../../../../infraestructure/mappers/dependency-estructure.mapper';
import { ToastrService } from 'ngx-toastr';
import { transforArray } from 'src/app/utils/transformArray';
import { formatNumberWithCommas } from '../../../../../utils/formatedWithComas';
import { CacheService } from 'src/app/services/Cache.service';

@Component({
  selector: 'app-view-files-upload',
  templateUrl: './view-files-upload.component.html',
  styleUrls: ['./view-files-upload.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ViewFilesUploadComponent implements OnInit {
  public isLoadingScreen: boolean = true;
  public isLoadingTree: boolean = true;
  public isLoadingChart: boolean = false;
  public chartData: any;
  public dependenciesList!: dependencyStructure[];
  public dependenciesChildren?: dependencyStructure[];
  public selectedDep?: TreeNode;
  public chartOptions?: any;
  public initialDependencies: dependencyStructure[] = [];
  public totalSumFiles: string = '';

  // Data chart
  private labelChart?: string[][];
  private countVinculados?: string[];
  private countNoVinculados?: string[];

  constructor(
    public _dependencyService: DirectoriosServicesService,
    private _toastr: ToastrService,
    private _cacheService: CacheService
  ) {}
  //dependencia/total_documentos/

  ngOnInit() {
    this.getDependencyStructure();
    this.getDependenciesInitial();
  }

  getDependencyStructure() {
    // Obtener árbol de dependencias del cache si está disponible
    const cachedTree = this._cacheService.get('treeDependencies');
    if (cachedTree) {
      this.dependenciesList = cachedTree;
      this.isLoadingTree = false;
      return;
    }

    // Si el árbol de dependencias no está en el cache, se carga desde la API
    this._dependencyService.getDepedendencyStructure().subscribe({
      next: (resp) => {
        this.dependenciesList = resp.map(
          (dependency: DependencyStructureResponse) =>
            dependencyStructureMapper.dependencyStructureToEntity(dependency)
        );

        this.isLoadingTree = false;

        // Almacera en cache árbol de dependencias
        this._cacheService.set('treeDependencies', this.dependenciesList);
      },
      error: (err) => {
        this._toastr.error('Error: ' + err);
      },
    });
  }

  getDependenciesInitial() {
    // Obtener datos de las dependencias iniciales del cache si está disponible
    const dependenciasIniciales = this._cacheService.get('initialDependencies');
    if (dependenciasIniciales) {
      this.initialDependencies = dependenciasIniciales;
      return;
    }

    this._dependencyService.getDepedenciesInitialStructure().subscribe({
      next: (resp) => {
        this.initialDependencies = resp.map(
          (dependency: DependencyStructureResponse) =>
            dependencyStructureMapper.dependencyStructureToEntity(dependency)
        );

        const totalFiles = this.initialDependencies.reduce(
          (total: number, dep: dependencyStructure) => {
            total += dep.totalFiles!;
            return total;
          },
          0
        );
        console.log(totalFiles);

        this.totalSumFiles = formatNumberWithCommas(totalFiles);

        // Almacera en cache árbol de dependencias
        this._cacheService.set('initialDependencies', this.initialDependencies);
      },
      complete() {},
      error: (err) => {
        this._toastr.error('Error: ' + err);
      },
    });
  }

  nodeSelect(dependencie?: dependencyStructure) {
    this.isLoadingChart = true;
    const id = dependencie?.key;

    if (id) {
      this.selectedDep = dependencie;
      // Obtener datos de la dependencia seleccionadada desde el grupo de botones
      this.setDataChart(id);
    } else {
      // Obtener datos de la dependencia seleccionadada desde el árbol de dependencias
      const indiceDep = this.selectedDep?.key;

      // Filtrar dependencias hijas para mostrar su data en la gráfica
      this.setDataChart(indiceDep!);
    }
  }

  setDataChart(indiceDep: string) {
    const id = indiceDep;

    this._dependencyService.countFiles(id).subscribe({
      next: (response: DependencyByIDResponse) => {
        const { dependencias } = response;

        const arrayNameDependencies = dependencias.reduce(
          (acc: string[], dep: Dependencia) => {
            if (dep.nombre) {
              acc.push(dep.nombre);
            }
            return acc;
          },
          []
        );

        this.labelChart = transforArray(arrayNameDependencies);

        this.countVinculados = dependencias.reduce(
          (acc: string[], dep: Dependencia) => {
            if (dep.Documentos_vinculados) {
              acc.push(dep.Documentos_vinculados.toString());
            }
            return acc;
          },
          []
        );
        this.countNoVinculados = dependencias.reduce(
          (acc: string[], dep: Dependencia) => {
            if (dep.Documentos_sin_vincular) {
              acc.push(dep.Documentos_sin_vincular.toString());
            }
            return acc;
          },
          []
        );

        // Configure chart options
        this.chartData = {
          labels: this.labelChart,
          datasets: [
            {
              label: 'Archivos cargados',
              backgroundColor: '#1d40a0',
              hoverBackgroundColor: '#102e81',
              data: this.countVinculados,
            },
            {
              label: 'Archivos no cargados',
              backgroundColor: '#a01d1d',
              hoverBackgroundColor: '#6d0d0d',
              data: this.countNoVinculados,
            },
          ],
        };

        this.chartOptions = {
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
            title: {
              display: true,
              text: this.selectedDep?.label,
              color: 'white',
              font: {
                size: 20,
              },
            },
          },
          scales: {
            x: {
              ticks: {
                align: 'start',
                color: 'white', // Cambiar color de las etiquetas en el eje x
                autoSkip: false, // No omitir etiquetas
                maxRotation: 90, // Rotación máxima de 90 grados
                minRotation: 90, // Rotación mínima de 90 grados
                font: {
                  size: 10, // Cambiar tamaño de la fuente
                },
              },
            },
            y: {
              ticks: {
                color: 'white', // Cambiar color de las etiquetas en el eje y
                font: {
                  size: 15, // Cambiar tamaño de la fuente
                },
              },
            },
          },
        };
        this.isLoadingChart = false;
      },
    });
  }

  expandAll() {
    this.dependenciesList?.forEach((node) => {
      this.expandRecursive(node, true);
    });
  }

  collapseAll() {
    this.dependenciesList?.forEach((node) => {
      this.expandRecursive(node, false);
    });
  }

  expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach((childNode) => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }
}
