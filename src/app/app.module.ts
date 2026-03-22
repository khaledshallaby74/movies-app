import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { SharedModule } from './shared/shared.module';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';
import { ToastrModule } from 'ngx-toastr';
import { ErrorInterceptorInterceptor } from './core/interceptors/error.interceptor';
import { AuthInterceptorInterceptor } from './core/interceptors/auth.interceptor';
import { AuthModule } from './features/auth/auth.module';
import { ApiKeyInterceptor } from './core/interceptors/api-key.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    AuthModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-center',
      closeButton: true,
      progressBar: true,
      timeOut: 7000,
    }),



  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass:AuthInterceptorInterceptor, multi:true} ,
    {provide: HTTP_INTERCEPTORS, useClass:ErrorInterceptorInterceptor, multi:true},
    {provide: HTTP_INTERCEPTORS, useClass: ApiKeyInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
