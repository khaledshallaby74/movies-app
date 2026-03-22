import { Component } from '@angular/core';
import { filter, forkJoin, map, Observable, switchMap } from 'rxjs';
import { CardArray, Filters } from 'src/app/core/model/card';
import { PostsService } from 'src/app/core/services/posts.service';

@Component({
  selector: 'app-homePage',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  //Observable holding the combined movies and TV data coming from PostsService.content$.
  allData$!: Observable<CardArray[]>;
  //Current page number for pagination.
  pageNumber:number=1;
  //Total pages returned by TMDB API Used for rendering pagination controls.
  totalPages:number=0 ;

  constructor(private _PostsService:PostsService){}
  ngOnInit(){
    this.getData()
  } 
    /**
   * Subscribes to the shared content$ observable from PostsService.
   *
   * Handles two scenarios:
   * 1. Search results (res.results exists)
   * 2. Discover / merged movies + TV (res.movies + res.tv)
   *
   * Maps the raw API data into a consistent format with media_type.
   */
  getData() {
    this.allData$ = this._PostsService.content$.pipe(
      map(res => {
        const mapped = this._PostsService.mapMediaData(res);
        this.totalPages = mapped.totalPages; // Pagination info
        return mapped.data; // Observable<CardArray[]>
      })
    );
  }
  // Update the current page and trigger new data fetch via PostsService BehaviorSubject.
  loadData(page:number){
    this._PostsService.setPage(page);
  }
 
}
