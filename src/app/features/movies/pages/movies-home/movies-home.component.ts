import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CardArray } from 'src/app/core/model/card';
import { PostsService } from 'src/app/core/services/posts.service';

@Component({
  selector: 'app-moviesHome',
  templateUrl: './movies-home.component.html',
  styleUrls: ['./movies-home.component.scss']
})
export class MoviesHomeComponent {
  constructor(private _PostsService:PostsService){};
  //Observable holding the combined movies data coming from PostsService.content$.
  allMovies$!:Observable<CardArray[]>;
  //Current page number for pagination.
  pageNumber:number = 1;
  //Total pages returned by TMDB API Used for rendering pagination controls.
  totalPages:number = 0;
  ngOnInit() {
    this.getData();
  }
  /**
   * Fetches movie shows from the global content$ stream,
   * maps data for consistent structure, updates pagination,
   * and filters out only items with media_type 'movie'.
   */
  getData() {
    this.allMovies$ = this._PostsService.content$.pipe(
      map(res => {
        const mapped = this._PostsService.mapMediaData(res);
        this.totalPages = mapped.totalPages;
        const onlyMovies = mapped.data.filter(item => item.media_type === 'movie');
        return onlyMovies;
      })
    );
  };
  // Update the current page and trigger new data fetch via PostsService BehaviorSubject.
  loadData(page: number) {
    this._PostsService.setPage(page);
  }
}
