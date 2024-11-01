
export interface User {
    username:  string;
    is_active: boolean;
}
export interface Auth {
    username: string;
    password: string; 
}
export interface UserProfile {
    token: string;
    user_id: number;
    email: string;
    first_name: string;
    last_name: string;
    rol: number;
    id_externo: number;
  }


export interface UserStatus {
    username    : string;
    is_active   : boolean;
    
}
export interface Users {
    count       : number;
    next        : number;
    previous    : number;
    results     : UserProfile[];
}


export interface UsersSearch{
    nombre         : string; 
    apPaterno      : string; 
    apMaterno      : string; 
    tipoPerfil     : string; 
}

export interface UserDependecieInterface {
    dependencia_indice : string
    id                 :number
    nombre2            :string

}