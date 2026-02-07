import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from 'src/app/core/auth.guard';
import { MoviesHomeComponent } from './pages/movies-home/movies-home.component';
import { MovieDetailsComponent } from 'src/app/shared/components/movie-details/movie-details.component';
import { MoviesComponent } from './movies.component';

const routes: Routes = [
  {path: "", canActivate:[authGuard], component:MoviesHomeComponent},
  {path:":id/:title", canActivate:[authGuard], component:MovieDetailsComponent, data: { type: 'movie' }}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MoviesRoutingModule { }
