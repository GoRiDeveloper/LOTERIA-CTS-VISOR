export interface AddDependencie {
  nombre: string;
  dependenciaIndiceBase: string;
  dependenciaSuperior: string;
  // encabezado: string[];
}

export interface AddDependencieResponse {
  id:                  string;
  nombre:              string;
  nombre2:             string;
  dependenciaIndice:   string;
  fonatur:             number;
  dependenciaSuperior: string;
  DependenciaAgregada: string;
}
