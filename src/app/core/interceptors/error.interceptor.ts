import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError, timer, of } from 'rxjs';
import { catchError, delay, mergeMap, retry } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Injectable()
export class ErrorInterceptorInterceptor implements HttpInterceptor {

  constructor(private _Router: Router, private toastr: ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      retry({
        count: 2,
        delay: (error, retryCount) =>{
          if(error.status === 0 || (error.status >= 500 && error.status < 600)){
            return timer( (retryCount + 1) *1000 )
          }
          return throwError(()=> error)
        }
      }),
       //  Catch Final Error
       catchError((error: HttpErrorResponse) =>{
        if (error.status === 401) {
          // لو الطلب جاي من صفحة login
          if (request.url.includes('signin') || request.url.includes('login')) {
              this.toastr.error('Email or Password is incorrect', 'Login Failed');
          } 
          else {
            // لو 401 في أي مكان تاني
            localStorage.removeItem('userToken');
            this._Router.navigate(['/login']);
            this.toastr.error('Session expired. Please login again', 'Unauthorized');
          }
        }
        if(error.status === 403){
          this.toastr.warning('Access denied', 'Warning')
        }
        if(error.status === 404){
          this.toastr.info('Data not found', 'Info');
          return of(new HttpResponse({body:[]}))
        }
        if(error.status === 0){
          this.toastr.error('Network error. Please check your connection', 'Error')
        }
        let message = error.error?.message || error.message || 'Unexpected server error';
        return throwError(()=> message)
       })
    )
  }
}
