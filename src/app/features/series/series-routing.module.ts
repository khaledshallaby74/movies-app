import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from 'src/app/core/auth.guard';
import { SeriesHomeComponent } from './pages/series-home/series-home.component';
import { MovieDetailsComponent } from 'src/app/shared/components/movie-details/movie-details.component';
import { SeasonDetailsComponent } from 'src/app/shared/components/season-details/season-details.component';
import { SeriesComponent } from './series.component';
import { EpisodeDetailsComponent } from 'src/app/shared/components/episode-details/episode-details.component';

const routes: Routes = [
  // المسار الأول: يحتوي على الـ Home والتفاصيل (داخل الـ Layout الخاص بالمسلسلات)
  { 
    path: "", 
    component: SeriesComponent, 
    children: [
      { path: "", component: SeriesHomeComponent }, 
      { path: ":id/:title", component: MovieDetailsComponent, data: { type: 'tv' } },
      { path: ":id/season/:season_number",  canActivate: [authGuard],  component: SeasonDetailsComponent },
      { 
  path: ":id/season/:season_number/episode/:episode_number", 
  component: EpisodeDetailsComponent // الكومبوننت اللي هتعرض فيه السيرفر أو تفاصيل الحلقة
}
    ] 
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeriesRoutingModule { }
