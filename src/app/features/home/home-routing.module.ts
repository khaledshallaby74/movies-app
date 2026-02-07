import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from 'src/app/core/auth.guard';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { MovieDetailsComponent } from 'src/app/shared/components/movie-details/movie-details.component';

const routes: Routes = [
  {path: "", canActivate:[authGuard], component:HomePageComponent},
  {path:":id/:title", canActivate:[authGuard], component:MovieDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
