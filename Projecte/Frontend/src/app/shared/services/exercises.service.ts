import { Injectable } from '@angular/core';
import { Activitat, Deures_activitat } from '../models/interfaces';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

const apiUrl = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class ExercisesService {

  constructor(private http: HttpClient) { }

  exDefault: Activitat = { id_activitat: 0, tipus: "null", ambit: "null", tema: "null", number:0, enunciat: ".", text: "null", resposta: "null", punts: 0 };

  //Obtenir llista de totes les activitats (per mostrar-les a main-list component)
  async getActivitatList(): Promise<Activitat[]> {
    let arrAct: Activitat[] = [];
    await fetch(apiUrl + 'activitats')
      .then(data => data.json())
      .then(acts => {
        arrAct = [...acts];
      })
    return arrAct;
  }

  
  //Com que per defecte es té id_last_act=null, hem de retornar objecte "mock"
  getActivitatfromId(id: number | null): Observable<Activitat> {
    if (id != null) {
      return this.http.get<Activitat>(apiUrl + `activitat/${id}`);
    } else {
      return of({
        id_activitat: 0,
        tipus: "complete",
        ambit: "ortografia",
        tema: "",
        number: 0,
        enunciat: "",
        text: "",
        resposta: "",
        punts: 0,
      })
    }
  }

  //
async getPreviousActivity(subtema: string, number: number): Promise<Activitat> {
  const preNumber = number - 1;
  let act: Activitat;
  const response = await fetch(apiUrl + `activitat/${subtema}/${preNumber}`);
  const data = await response.json();
  act = { ...data };
  console.log(act);
  return act;
}
  
  //
async getNextActivity(subtema: string, number: number): Promise<Activitat> {
  const preNumber = number + 1;
  let act: Activitat;
  const response = await fetch(apiUrl + `activitat/${subtema}/${preNumber}`);
  const data = await response.json();
  act = { ...data };
  console.log(act);
  return act;
}

  //
  async getLastNumberOfSubtema(subtema: string): Promise<number>{
    const response = await fetch(apiUrl + `max-number/${subtema}`);
    const data = await response.json();
    console.log("Número: " + parseInt(data.max_number));
    return parseInt(data.max_number);
  }

  //
  async getPercentageOfSubtema(exercise: Activitat, isCompleted: boolean): Promise<number>{
    if (exercise.subtema && exercise.subtema != "") {
      const response = await fetch(apiUrl + `subtema-list/${exercise.subtema}`);
      const exOfSubtema = await response.json();
      if (isCompleted == true) {
        return Math.round((exercise.number / exOfSubtema.length) * 100);
      } else {
        return Math.round(((exercise.number - 1) / exOfSubtema.length) * 100);
      }
    } else {
      if (isCompleted == true) {
        return 100;
      } else {
        return 0;
      }
    }
  }
  

}
