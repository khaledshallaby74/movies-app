import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeriesRoutingModule } from './series-routing.module';
import { SeriesComponent } from './series.component';
import { SeriesHomeComponent } from './pages/series-home/series-home.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    SeriesComponent,
    SeriesHomeComponent
  ],
  imports: [
    CommonModule,
    SeriesRoutingModule,
    SharedModule
  ]
})
export class SeriesModule { }
