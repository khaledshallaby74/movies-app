import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedRoutingModule } from './shared-routing.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { OwlcarouselComponent } from './components/owlcarousel/owlcarousel.component';
import { PostsComponent } from './components/posts/posts.component';
import { MovieDetailsComponent } from './components/movie-details/movie-details.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { HeaderComponent } from './components/header/header.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { SeasonDetailsComponent } from './components/season-details/season-details.component';
import { EpisodeDetailsComponent } from './components/episode-details/episode-details.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { ɵInternalFormsSharedModule } from "@angular/forms";

@NgModule({
  declarations: [
    NavbarComponent,
    OwlcarouselComponent,
    PostsComponent,
    MovieDetailsComponent,
    HeaderComponent,
    PaginationComponent,
    SeasonDetailsComponent,
    EpisodeDetailsComponent,
    SideMenuComponent,
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    NgxPaginationModule,
    ɵInternalFormsSharedModule,
      ReactiveFormsModule

],
  exports:[
    NavbarComponent,
    SideMenuComponent,
    OwlcarouselComponent,
    PostsComponent,
    MovieDetailsComponent,
    NgxPaginationModule,
    HeaderComponent,
    PaginationComponent,
    SeasonDetailsComponent,
    EpisodeDetailsComponent,

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
