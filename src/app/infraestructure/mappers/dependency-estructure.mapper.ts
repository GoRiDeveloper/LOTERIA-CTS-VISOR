import {
  dependencyStructure,
  DependencyStructureResponse,
} from 'src/app/interfaces/dependencyStructure.interface';

export class dependencyStructureMapper {
  static dependencyStructureToEntity(
    dependency: DependencyStructureResponse
  ): dependencyStructure {
    return {
      key: dependency.id.toString(),
      label: dependency.nombre,
      data: dependency.nombre2,
      icon: 'bi bi-folder-fill',
      children: dependency.children
        ? dependency.children.map((child) =>
            this.dependencyStructureToEntity(child)
          )
        : undefined,
      dependencia_superior: dependency.dependencia_superior,
      totalFiles: dependency?.TotalDocumentos,
    };
  }
}
