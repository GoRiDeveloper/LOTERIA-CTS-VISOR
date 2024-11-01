export interface AddFieldFile {
  id: number;
  descripcionId: string;
  documentosId: string;
  catalogoHeaderId: Number;
}

export interface addsHeaders {
  documentoId: number;
  descripcion: string[];
  catalogoHeaderId: number[] | undefined;
}
