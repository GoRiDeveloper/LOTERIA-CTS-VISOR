export interface AddFileGhost {
    dependenciaIndice: string;
    dependenciaId: string;
}

export interface AddFileGhostResponse {
    id_relacion_hoja:  number;
    id_documento:      number;
    nombre:            string;
    dependenciaIndice: string;
    archivo:           string;
}
