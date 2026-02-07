import { Component } from '@angular/core';
import { CardArray } from 'src/app/core/model/card';
import { PostsService } from 'src/app/core/services/posts.service';


@Component({
  selector: 'app-seriesHome',
  templateUrl: './series-home.component.html',
  styleUrls: ['./series-home.component.scss']
})
export class SeriesHomeComponent {
  constructor(private _PostsService:PostsService){}
  allSeries:CardArray[] = [];
  title:string = 'TV';
  pageNumber:number=1;
  totalPages:number=0
  loadData(page:number){
    this._PostsService.getAll("tv", page).subscribe( (res) =>{
      this.allSeries = res.results     
      this.pageNumber = res.page;
      this.totalPages = res.total_results;      
    })
  }
  ngOnInit(){
    this.loadData(1)
  }
}
