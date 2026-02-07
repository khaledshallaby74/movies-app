import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MoviesRoutingModule } from './movies-routing.module';
import { MoviesComponent } from './movies.component';
import { MoviesHomeComponent } from './pages/movies-home/movies-home.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    MoviesComponent,
    MoviesHomeComponent
  ],
  imports: [
    CommonModule,
    MoviesRoutingModule,
    SharedModule
  ]
})
export class MoviesModule { }
