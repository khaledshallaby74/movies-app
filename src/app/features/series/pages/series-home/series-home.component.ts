import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CardArray } from 'src/app/core/model/card';
import { PostsService } from 'src/app/core/services/posts.service';


@Component({
  selector: 'app-seriesHome',
  templateUrl: './series-home.component.html',
  styleUrls: ['./series-home.component.scss']
})
export class SeriesHomeComponent {
  //Observable holding the combined TV data coming from PostsService.content$.
  allSeries$!:Observable<CardArray[]>;
  //Current page number for pagination.
  pageNumber:number=1;
  //Total pages returned by TMDB API Used for rendering pagination controls.
  totalPages:number=0
  constructor(private _PostsService:PostsService){}

  ngOnInit(){
    this.getData()
  }
  /**
 * Fetches TV shows from the global content$ stream,
 * maps data for consistent structure, updates pagination,
 * and filters out only items with media_type 'tv'.
 */
  getData() {
    this.allSeries$ = this._PostsService.content$.pipe(
      map(res => {
        const mapped = this._PostsService.mapMediaData(res);
        this.totalPages = mapped.totalPages;
        const onlySeries = mapped.data.filter(item => item.media_type === 'tv');
        return onlySeries;
      })
    );
  }
  // Update the current page and trigger new data fetch via PostsService BehaviorSubject.
  loadData(page: number) {
    this._PostsService.setPage(page);
  }
}
