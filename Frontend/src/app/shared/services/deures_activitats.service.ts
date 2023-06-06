import { Injectable } from '@angular/core';
import { Deures_activitat, Deures, Activitat } from '../models/interfaces';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, Subscription, map } from 'rxjs';
import { AccountService } from './account.service';
import { ExercisesService } from './exercises.service';
import { GroupsService } from './groups.service';

const apiUrl = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class Deures_activitatsService {
  
  constructor(private groupService: GroupsService, private http: HttpClient, private exService: ExercisesService, private accService: AccountService) {}


  //retorna array d'objectes deures_activitats +nom de profe i nom de grup
  getAllDeuresActivitatsIncompletsFromUser(idUser: number): Observable<any[]> {
    let urlQuery = apiUrl + 'deures-activitats/' + idUser + `?is_completed=0`;
    return this.http.get<any[]>(urlQuery);
    }


  
  getAllDeuresActivitatsCompletsFromUser(idUser: number): Observable<any[]> {
    let urlQuery = apiUrl + 'deures-activitats/' + idUser + `?is_completed=1`;
    return this.http.get<any[]>(urlQuery);
  }
  
  getAllDeuresActivitatsFromUser(idUser: number): Observable<any[]> {
    let urlQuery = apiUrl + 'deures-activitats/' + idUser;
    return this.http.get<any[]>(urlQuery);
    }

  getDeuresPendentsFromUser(idUser: number) {
    return this.http.get<any[]>(apiUrl + 'deures/' + idUser + '?is_completed=0');
  }


  addDeuresActivitats(deur_act: any) {
    //faltaria crear array específica dins de localStorage però ara no hi vull perdre temps
    //cal?
    localStorage.setItem(deur_act.activitat_id.toString(), JSON.stringify(deur_act));
    this.http.post(apiUrl + 'add-deures-activitats', deur_act, {responseType: 'text'}).subscribe({
      next: response => {
      console.log("Objecte deures_activitats guardat:");
        console.log(deur_act);
        console.log(response);
    },
      error: (error) => {
        console.error('Error al añadir el objeto a Deures_activitats:', error);
      }
  });
  }

  updateDeuresActivitats(val): Observable<object> {
    const params = `deure_id=${val['deure_id']}&activitat_id=${val['activitat_id']}&usuari_id=${val['usuari_id']}`;
    const body = {
        "resp_usuari": val['resp_usuari'],
        "punts": val['punts'],
        "num_errors": val['num_errors'],
        "completed_at": val['completed_at']
    }
    const url = apiUrl + 'update-deures-activitats?' + params;
    return this.http.put(url, body);
  }

  //potser val la pena cachejar
  getDeuresByProfeId(profe_id: number, is_checked?: 1 | 0): Observable<Object[]> {
    let url = apiUrl + `deures/profes/${profe_id}`;
    if (is_checked == 1 || is_checked == 0) {
      url += `?is_checked=${is_checked}`
    }
    return this.http.get<Object[]>(url).pipe(map((arr: any[]) => {
        //filtrem els resultats repetits
        return [...new Map(arr.map(v => [v['id_deure'], v])).values()];
      }));
  }

    //hi afegeix nom_user i data_finalitzacio
  getDeuresActivitatsByDeureId(deure_id: number): Observable<Object[]> {
    return this.http.get<Object[]>(apiUrl + `deures-activitats-by-deure/${deure_id}`);
  }

  getDeuresActivitatsByUserAndProfe(userId: number, profeId: number, is_completed?: 1 | 0): Observable<Object[]> {
    let url = apiUrl + `deures-activitats-usuari-by-prof?usuari_id=${userId}&profe_id=${profeId}`;
    if (is_completed == 1 || is_completed == 0) {
      url += `&is_completed=${is_completed}`;
    }
    return this.http.get<Object[]>(url);
  }

  updateDeuresIsChecked(deuresId: number, isChecked: 1 | 0): Observable<1 | 0> {
   return this.http.put<1 | 0>(apiUrl + `update-deures-ischecked/${deuresId}`, { is_checked: isChecked });
  }

  createHomework(grupId: number, nomDeure: string, dataFi: Date, activId: number) {
    const body = {
      grup_id: grupId,
      nom_deure: nomDeure,
      data_finalitzacio: dataFi,
      is_checked: 0
    };
    //creem obj deures
    this.http.post(apiUrl + 'create-deure', body).subscribe(res => {
      //Aquí hauríem de fer switchMap
      //obtenim l'id_deure del nou obj deures
      this.groupService.getUsersByGrupId(grupId, 1).subscribe(arr => {
        //creem un obj deures_activitats per cada alumne
        arr.forEach(user => {
          this.addDeuresActivitats({
            deure_id: res['id_deure'],
            activitat_id: activId,
            usuari_id: user['user_id'],
            resp_usuari: "",
            is_deures: 1,
            is_completed: 0,
            punts: 0,
            num_errors: 0
          });
        });
      });
    });
  }

  deleteHomework(idDeure: number): Observable<any> {
    //delete object "deures"
        
    //delete objects "deures_act"
    this.http.delete(apiUrl + 'deur-act-incomplete-delete/' + idDeure, { responseType: 'text' }).subscribe(res => {
      console.log(res);
    });

    return this.http.delete(apiUrl + 'deures-delete/' + idDeure, { responseType: 'text' });
  }

}

//esborrar els deures i els deur_act associats no complets
