import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AccountService } from '../services/account.service';

// Este interceptor se encarga de interceptar todas las solicitudes HTTP salientes y manejar los
//errores de la respuesta.En particular, comprueba si la respuesta es un error 401 o 403, lo que indica
//que el usuario no está autorizado para acceder al recurso solicitado.Si es así, el interceptor llama
//al método logout() del servicio AccountService para cerrar la sesión del usuario.

// Además, el interceptor maneja cualquier otro error devuelto por el servidor,
//registrándolo en la consola y devolviendo un observable que emite el mensaje de error como un objeto throwError.

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private accountService: AccountService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if ([401, 403].includes(err.status) && this.accountService.currentUser) {
                // auto logout if 401 or 403 response returned from api
                this.accountService.logout();
            }

            const error = err.error?.message || err.statusText;
            console.error(err);
            return throwError(() => error);
        }))
    }
}