import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { tap, catchError, throwError, shareReplay } from 'rxjs';

const apiUrl = environment.API_URL;


@Injectable({
  providedIn: 'root'
})
export class GroupsService {



  constructor(private http: HttpClient) { }
  
  getGroupById(idGroup: number): Observable<Object> {
    return this.http.get<Object>(apiUrl + 'grups/' + idGroup);
  }
  
  getUsersByGrupId(idGroup: number, is_confirmed?: 1 | 0): Observable<Object[]>{
    let url = apiUrl + 'grups/usuaris/' + idGroup;
    if (is_confirmed == 1 || is_confirmed == 0) {
      url += `?is_confirmed=${is_confirmed}`;
    }
    return this.http.get<Object[]>(url);
  }

  //retorna grup + nom professor ("professor")
  getGroupsByUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(apiUrl + `usuaris/${userId}/grups`);
  }

  getGroupsByTeacher(profeId: number): Observable<Object[]>{
    return this.http.get<Object[]>(apiUrl + 'profe-grups/' + profeId).pipe(shareReplay(1), catchError(err => []));
  }

  createGrup(nomG: string, descrG: string, profeId: number): Observable<{id_grup: number}>{
    const body = { nom: nomG, descripcio: descrG, profe_id: profeId };
    return this.http.post<{id_grup:number}>(apiUrl + 'grup-add', body);
  }
  

  addGrupUsuari(userId: number, groupId: number, isConfirmed: 1 | 0) {
    return this.http.post(apiUrl + `grup-usuaris-add`, { usuari_id: userId, grup_id: groupId, is_confirmed: isConfirmed }, {responseType: "text"})
      .pipe(catchError(error => {
        if (error.status === 500) {
          console.log(error);
        } else {
          alert('Error inesperat. Si us plau, intenti-ho més tard.');
        }
        return throwError(() => new Error(error));
      }));
  }

  confirmGrupUsuari(userId: number, groupId: number) {
    return this.http.put(apiUrl + `grup-usuaris-confirm/${userId}/${groupId}`, {});
  }
  

deleteGrupUsuari(idGroup: number, idUser: number): Observable<any> {
  return this.http.delete<any>(apiUrl + `grup-usuaris-delete/${idGroup}/${idUser}`, { responseType: 'text' as 'json' }).pipe(tap(resp => {
    console.log(`Usuari amb id ${idUser} esborrat correctament del grup ${idGroup}`);
    console.log(resp);
    }),
    catchError( error => {
      console.error("Error en l'esborrament de grups d'usuari: " + JSON.stringify(error));
      return throwError(()=>error);
    }
  ));
}
  
  deleteGrupAndUsuaris(idGroup: number) {
    return this.http.delete(apiUrl + 'grups-delete/' + idGroup, { responseType: 'text' as 'json' });
  }

  }

  //veure sol·licituds a grup fetes com a alumne?
  //veure sol·licituds a grup fetes com a profe?
  //veure sol·licituds a grup rebudes


