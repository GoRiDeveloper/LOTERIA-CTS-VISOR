import {
  dependencyStructure,
  DependencyStructureResponse,
} from 'src/app/interfaces/dependencyStructure.interface';

export class DependenciesStructureToSidebar {
  static depStructureToSidebarEntity(
    dependency: DependencyStructureResponse
  ): dependencyStructure {
    return {
      key: dependency.id.toString(),
      label: dependency.nombre,
      data: dependency.nombre2,
      icon: dependency.children ? 'bi bi-folder-fill' : 'bi bi-file-fill',
      children: dependency.children
        ? dependency.children.map((child) =>
            this.depStructureToSidebarEntity(child)
          )
        : undefined,
      type: 'url',
      url: dependency.children
        ? '/dashboard/home/carpetas/'
        : '/dashboard/home/documentos/',
    };
  }
}
