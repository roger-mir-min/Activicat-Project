import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, Subscription, catchError, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { User, SignUpForm } from '../models/interfaces';
import { environment } from 'src/environments/environment';
import jwt_decode from 'jwt-decode';

const apiUrl = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private router: Router, private http: HttpClient) { } 


  //Observables of isLoggedin and currentUser, so that header-component can subscribe
  //Subscription for isLoggedIn
  isLoggedIn: boolean;
  private data = new BehaviorSubject<boolean>(false);
  data$ = this.data.asObservable();
  subscData: Subscription = this.data$.subscribe(res => this.isLoggedIn = res);

  changeData(data: boolean) {
    this.data.next(data);
  }

  //Subscription for currentUser
  currentUser: User; //current logged in user
  private currUser = new BehaviorSubject<User | null>(null);
  currUser$ = this.currUser.asObservable();
  subscUser: Subscription = this.currUser$.subscribe(res => this.currentUser = res)
    
  //potser no cal, podem fer .next directament. pro així és més clar
  changeUser(user: User) {
    this.currUser.next(user);
  }

  //Subscription for currentUser image
  userImage: string | ArrayBuffer;
  private userImg = new BehaviorSubject<string | ArrayBuffer>("");
  userImg$ = this.userImg.asObservable();
  subscImg: Subscription = this.userImg$.subscribe(res => this.userImage = res);

  changeImg(img) {
    this.userImg.next(img);
  }

  //JWT

  decodeToken(token: string): any {
  try {
    const decoded = jwt_decode(token);
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

  //LOGIN
  login(formValue: {inputEmail: string, inputKey: string}, isOnlyCheck?: boolean): Observable<object> {
    return this.http.post(apiUrl + `login`, { email: formValue['inputEmail'], password: formValue['inputKey'] }).pipe(
      tap(response => {
        //Descodifiquem el token
          const decodedToken = jwt_decode(response['token']);
          // console.log("decoded token is: ");
          // console.log(decodedToken);

        if (!isOnlyCheck) {
          // Guardem en objecte user les propietats descodificades del token
          const user: User = {
            user_id: decodedToken['user_id'],
            email: decodedToken['email'],
            nom: decodedToken['nom'],
            token: response['token'],
            role: decodedToken['role'],
            is_confirmed: decodedToken['is_confirmed'],
            is_automatic: decodedToken['is_automatic'],
            id_last_act: decodedToken['id_last_act'],
            points: decodedToken['points'],
            img: decodedToken['img']
          };

          //Guardem a localstorage i a servei
          localStorage.setItem("currentUserProj", JSON.stringify(user));
          this.currUser.next(user);
          this.changeData(true);
          console.log("New user logged in.");
          this.navAfterLogin();
        }
      }),
        catchError((error) => {
          if (error.status === 400) {
            console.log(error);
          } else {
            alert('Error inesperat. Si us plau, intenti-ho més tard.');
          }
          return throwError(() => new Error(error));
      })
    );
  }
  
  //SIGNUP
  signup(formValue: SignUpForm): Observable<Object> {
    //en principi no cal comprovar que l'email no existeixi pq és unique a phpMyAdmin
    const user = {
      nom: formValue['inputNom'],
      email: formValue['inputEmail'], 
      password: formValue['inputKey'],
      role: formValue['inputRole'] == "1"? 1 : 0,
      is_automatic: 0,
      img: ""
    }
    return this.http.post(apiUrl + `signup`, user).pipe(
      catchError((error) => {
        if (error.status === 400) {
          console.log(error);
        } else {
          alert('Error inesperat. Si us plau, intenti-ho més tard.');
        }
        return throwError(() => new Error(error));
      })
    );
  }

  //Funció per actualitzar tot de cop l'usuari. Potser m'aniria bé
  //Fixa't que canvia localStorage i fa currUser.next --ara no sé com actualizava reactive jo
    // updateJWT(id: string, params: any) {
    //     return this.http.put(`${environment.apiUrl}FALTA URL${id}`, params)
    //         .pipe(map(x => {
    //             // update stored user if the logged in user updated their own record
    //             if (id == this.currentUser.user_id.toString(), 10) {
    //                 // update local storage
    //                 const user = { ...this.currentUser, ...params };
    //                 localStorage.setItem('user', JSON.stringify(user));

    //                 // publish updated user to subscribers
    //                 this.currUser.next(user);
    //             }
    //             return x;
    //         }));
    // }

    // deleteJWT(id: string) {
    //     return this.http.delete(`${environment.apiUrl}/users/${id}`)
    //         .pipe(map(x => {
    //             // auto logout if the logged in user deleted their own record
    //             if (id == this.currentUser?.user_id.toString()) {
    //                 this.logout();
    //             }
    //             return x;
    //         }));
    // }



  //---------------------------------------------------------------------------
  //LOGOUT
    logout() {
    this.changeUser(undefined);
    this.changeData(false);
    localStorage.removeItem("currentUserProj");
    this.router.navigate(["login"]);
    console.log("logout succeeded.");
  }

  //he de fer tipus d'input
  //compte amb is_automatic, he posat per defecte = 0

  getLocalStorageUser() {
    if (!this.currentUser && localStorage.getItem("currentUserProj") != undefined) {
    this.currentUser = JSON.parse(localStorage.getItem("currentUserProj")!);
    this.changeData(true);
    this.changeUser(this.currentUser);
    console.log("current user gotten from localStorage");
    //part repetida de navbar component:
      this.navAfterLogin();
    } 
    return of(this.currentUser);
  }

  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(apiUrl + `usuaris/${userId}`);
  }
  
  //falta gestió d'error
  getUserByEmail(email: string): Observable<any> {
  return this.http.get(apiUrl + `usuari-by-email/${email}`);
  }

  navAfterLogin() {
    if (this.currentUser.role == 1) {
        this.router.navigate(["user/teacher"]);
      } else {
        this.router.navigate(["user/student"]);
      }
    console.log("navafterlog");
  }

    //per a usuaris no registrats
  addRandomUser(name: string): Observable<Object> {
    const body = { nom: name };
    return this.http.post(apiUrl + 'add-random-user', body);
  }

  changeLastAct(newAct: number) {
    const url = apiUrl + 'usuaris/' + this.currentUser.user_id + '/last_act';
    this.http.put(url, { newLastAct: newAct }, { responseType: 'text' }).subscribe({
      next: response => {
        this.getUserById(this.currentUser.user_id).subscribe(x => {
            this.changeUser(x);
          });
      },
      error: error => {
        console.error("Error en l'enregistrament de la imatge: " + JSON.stringify(error));
      }
    });
  }

  changeNom(nom: string) {
    const url = apiUrl + 'usuaris/' + this.currentUser.user_id + '/nom';
    return this.http.put(url, { newNom: nom }, { responseType: 'text' });
  }

  changeEmail(newEmail: string) {
    const url = apiUrl + 'usuaris/' + this.currentUser.user_id + '/email';
    return this.http.put(url, { newEmail: newEmail }, { responseType: 'text' });
  }

  //S'ha d'adaptar a JWT!!!
  changePassword(password: string) {
    const url = apiUrl + 'usuaris/' + this.currentUser.user_id + '/password';
    return this.http.put(url, { newPassword: password }, { responseType: 'text' });
  }

//IMATGE
//GET
  getUserImage(): Observable<string | ArrayBuffer> {
    if (this.currentUser) {
      return new Observable(observer => {
        this.http.get(apiUrl + `profile/${this.currentUser.user_id}`, { responseType: 'blob' })
          .subscribe(response => {
            let reader = new FileReader();
            reader.addEventListener("load", () => {
              observer.next(reader.result);
              observer.complete();
              this.userImg.next(reader.result);
            }, false);

            if (response) {
              reader.readAsDataURL(response);
            }
          });
      });
    } else {
      console.log("No es pot obtenir imatge perquè no hi ha usuari loggejat.");
      return of("");
    }
}
//POST
postUserImage(formData: FormData): Observable<string> {
  return this.http.post(apiUrl + 'profile', formData, {responseType: 'text'});
}


  //
  
  ngOnDestroy() {
    if (this.subscData) {
      this.subscData.unsubscribe();
    }
    if (this.subscUser) {
      this.subscUser.unsubscribe();
    }
  }

}
