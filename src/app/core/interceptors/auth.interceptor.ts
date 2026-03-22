import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // const token = localStorage.getItem('userToken')
    // if(token){
    //   const cloneRequest  = request.clone({
    //     setHeaders:{
    //       Authorizaion: `Bearer ${token}` 
    //     }
    //   })
    //   return next.handle(cloneRequest)
    // }
    return next.handle(request);
  }
}
