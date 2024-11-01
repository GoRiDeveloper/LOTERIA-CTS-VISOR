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
  type?: string;
  url?:string;
}

export interface DependencyStructureUserResponse {
  dependencias: DependencyStructureResponse[];
}


export interface ChildrensIDResponse {
  ContadorDependencias: number;
  Dependencias:         DependenciaID[];
}

export interface DependenciaID {
  id: number;
}


// Fetch Documents

export interface SearchFilesByQueryResponse {
  results: Result[];
}

export interface Result {
  dependencia_id: number;
  documento_id:   number;
  nombre_archivo: string;
  nombre_campo:   string;
  descripcion:    string;
}
