import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { authGuard } from './core/auth.guard';
import { AuthLayoutComponent } from './core/layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';


const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: 'full' },
  // Auth Layout 
  {
    path: "",
    component: AuthLayoutComponent,
    children: [
      { path: "login", component: LoginComponent },
      { path: "register", component: RegisterComponent },
      {path: "resetPassword", component: ForgotPasswordComponent}
    ]
  },

  // Main Layout
  {
    path: "",
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: "home", loadChildren: () => import("./features/home/home.module").then(m => m.HomeModule) },
      { path: "movie", loadChildren: () => import("./features/movies/movies.module").then(m => m.MoviesModule) },
      { path: "tv", loadChildren: () => import("./features/series/series.module").then(m => m.SeriesModule) },
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
