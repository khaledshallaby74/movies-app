import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { authGuard } from './core/auth.guard';


const routes: Routes = [
  {path:"", redirectTo:"home", pathMatch:'full'},
  {path:"tv" , canActivate:[authGuard], loadChildren: ()=> import("./features/series/series.module")
    .then( (m:any) => m.SeriesModule )
  },
  {path:"person" , canActivate:[authGuard], loadChildren: ()=> import("./features/persons/persons.module")
    .then( (m:any) => m.PersonsModule )
  },
  {path:"movie", canActivate:[authGuard], loadChildren: ()=> import("./features/movies/movies.module")
    .then( (m:any)=> m.MoviesModule )
  },
  {path:"home", canActivate:[authGuard], loadChildren: ()=> import("./features/home/home.module")
    .then( (m:any)=> m.HomeModule )
  },
  {path:"login" , component:LoginComponent}, 
  {path:"register" , component:RegisterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
