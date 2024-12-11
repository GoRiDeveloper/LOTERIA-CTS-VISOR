export interface DependencyStructureResponse {
  id: string;
  nombre: string;
  nombre2: string;
  dependencia_indice: string;
  dependencia_superior?: string | null;
  children?: DependencyStructureResponse[];
}

export interface dependencyStructure {
  key?: string;
  label?: string;
  data?: string;
  icon?: string;
  children?: dependencyStructure[];
  parent?: dependencyStructure;
  dependencia_superior?: string | null;
  totalFiles?: number;
  type?: string;
  url?: string;
}

export interface DependencyStructureUserResponse {
  dependencias: DependencyStructureResponse[];
}

export interface ChildrensIDResponse {
  ContadorDependencias: number;
  Dependencias: DependenciaID[];
}

export interface DependenciaID {
  id: number;
}

export interface Ruta {
  id: number;
  has_sub: boolean;
  has_doc: boolean;
  nombre: string;
  nombre2: string;
  dependencia_indice: string;
  dependencia_superior: null;
}

export interface DependencyByIDResponse {
  dependencias: Dependencia[];
  rutas: Ruta[];
  archivos: any[];
}

export interface Dependencia {
  id: number;
  has_sub: boolean;
  has_doc: boolean;
  nombre: string;
  nombre2: string;
  dependencia_indice: string;
  dependencia_superior: number;
  Todos_los_documentos: number;
  Documentos_vinculados: number;
  Documentos_sin_vincular: number;
}

// Fetch Documents

export interface SearchFilesByQueryResponse {
  results: Result[];
}

export interface Result {
  dependencia_id: number;
  documento_id: number;
  nombre_archivo: string;
  nombre_campo: string;
  descripcion: string;
}
