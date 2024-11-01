export interface AddFileNewDepResponse {
    id:              number;
    idDependencia:   number;
    idDocumentoTipo: number;
}

export interface AddNewFileResponse {
    id:                    number;
    "Nombre documento":    string;
    dependenciaIndice:     string;
    dependenciaSuperiorId: number;
    tipo_id:               string;
    archivo:               string;
    palabrasOCR:           boolean;
}
