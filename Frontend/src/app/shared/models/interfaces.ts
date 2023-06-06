//ordenar o per feature o per ordre alfabètic

export interface Login {
    email: string,
    password: string
}
  
export interface User {
user_id: number,
nom: string,
email: string,
password?: string,
id_last_act: number | null,
role: 0 | 1,
is_automatic?: 0 | 1,
img?: string,
created_at?: string,
  points: number,
  is_confirmed?: 0 | 1,
  token?: string
};

export interface Grup {
id_grup: number,
id_profe: number,
nom: string,
descripcio?: string
}

export interface SignUpForm {
  inputNom: string,
  inputEmail: string,
  inputKey: string,
  inputRepKey: string,
  inputRole: "0" | "1"
}

export interface Frase {
    start: string,
    end?: string,
    solution?: string | boolean
}

export interface Exercici {
    ambit?: string,
    tema?: string,
    subtema?: string,
    num?: number,
    id?: number,
    frases: Frase[],
    punts: number
}

export interface ExFormGroup {
    formFrases: string[];
}

export interface Activitat {
    id_activitat: number,
    tipus: string,
    ambit: string,
    tema?: string,
    subtema?: string,
    number: number,
    enunciat: string,
    text: string,
    resposta: string,
    punts: number,
}

export interface Deures {
  id_deures: string,
  id_grup: number
  nom_deures: string,
  data_limit: Date,
  isChecked: 0 | 1
  }

export interface Deures_activitat {
  id_user: number,
  id_activitat: number,
  id_deures: string,
  is_deures: number,
  is_completed: number,
  resp_usuari: string,
  punts: number,
  errors: number,
  data?: Date
}

export interface Tema {
  nom: string;
  subtemes: Map<string, Activitat[]>;
}

export interface Ambit {
  nom: string;
  temes: Map<string, Tema>;
}

export type AmbitName = 'ortografia' | 'literatura' | 'gramàtica' | 'dialectes';


