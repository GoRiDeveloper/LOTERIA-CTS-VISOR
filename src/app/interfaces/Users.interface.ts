export interface UserDataInterface {
  username?: string;
  first_name: string;
  last_name: string;
  email?: string;
  id?: string;
  id_externo?: number;
  password?: string;
  telefono?: string;
  is_active?: boolean;
  dependencias?: string[];
  rol?: number | string;
  descargas: boolean;
  expediente_ver: boolean;
  expediente: number;
  tramo: number;
}