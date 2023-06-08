import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, shareReplay, tap } from 'rxjs';
import { AccountService } from './account.service';
import { ExercisesService } from './exercises.service';
import { GroupsService } from './groups.service';

const apiUrl = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class PointsService {



  private pointsSubj = new BehaviorSubject<string>("0");
  // points$ = this.pointsSubj.asObservable();

  private pointsOrtogSubj = new BehaviorSubject<number>(0);
  pointsOrtog$ = this.pointsOrtogSubj.asObservable();

  private pointsLiteSubj = new BehaviorSubject<number>(0);
  pointsLite$ = this.pointsLiteSubj.asObservable();

  private pointsDialSubj = new BehaviorSubject<number>(0);
  pointsDial$ = this.pointsDialSubj.asObservable();

  private pointsGramSubj = new BehaviorSubject<number>(0);
  pointsGram$ = this.pointsGramSubj.asObservable();

  // updatePoints(points: string) {
  //   this.pointsSubj.next(points);
  // }

  updatePointsOrtog(points: number) {
    this.pointsOrtogSubj.next(points);
  }

  updatePointsLite(points: number) {
    this.pointsLiteSubj.next(points);
  }
  
  updatePointsDial(points: number) {
    this.pointsDialSubj.next(points);
  }
  
  updatePointsGram(points: number) {
    this.pointsGramSubj.next(points);
  }

 constructor(private groupService: GroupsService, private http: HttpClient, private exService: ExercisesService, private accService: AccountService) {}

  getTotalPointsFromUser(idUser: number): Observable<string> {
    return this.http.get<string>(apiUrl + 'usuari-punts/' + idUser).pipe(shareReplay(1));
  }

  // ------------------------------------
  //Potser ens podem estalviar points fent-ho suma dels altres
  //Versió amb caché. Tindria sentit si ho volguessis fer reactiu
  //per exemple si a exframe es veiessin punts totals, o a sidebar
  points$: Observable<string>;
  //crec q es podria tenir Subject donant startWith
  updatePointsSubject = new BehaviorSubject("");
  updatePoints$ = this.updatePointsSubject.asObservable();

  getPoints(idUser: number): Observable<string> {
    if (!this.points$) {
      // Si no hay observable cacheado, hacemos la llamada HTTP y cacheamos la respuesta
      this.points$ = this.http.get<string>(apiUrl + 'usuari-punts/' + idUser).pipe(
        shareReplay({ bufferSize: 1, refCount: true })
      );
    }
    return this.points$;
  }

  //quan es resol exercici, es reinicia caché i s'avisa components perquè tornin a fetchejar
  updatePoints() {
    this.points$ = null;
    this.updatePointsSubject.next("");
  }


  //----------

  getPointsOfOrtografia(idUser: number): Observable<string> {
    return this.http.get<string>(apiUrl + 'usuari-punts/' + idUser + `?ambit=ortografia`).pipe(tap(punts => { this.pointsSubj.next(punts['puntsTotals']) }), shareReplay(1));
  }
  
  getPointsOfLiteratura(idUser: number): Observable<string> {
    return this.http.get<string>(apiUrl + 'usuari-punts/' + idUser + `?ambit=literatura`).pipe(tap(punts => { this.pointsSubj.next(punts['puntsTotals']) }), shareReplay(1));
  }

  getPointsOfDialectes(idUser: number): Observable<string> {
    return this.http.get<string>(apiUrl + 'usuari-punts/' + idUser + `?ambit=dialectes`).pipe(tap(punts => { this.pointsDialSubj.next(punts['puntsTotals']) }), shareReplay(1));
  }
  
  getPointsOfGramatica(idUser: number): Observable<string> {
    return this.http.get<string>(apiUrl + 'usuari-punts/' + idUser + `?ambit=gramatica`).pipe(tap(punts => { this.pointsGramSubj.next(punts['puntsTotals']) }), shareReplay(1));
  }
}
