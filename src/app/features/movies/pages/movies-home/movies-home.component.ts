import { Component } from '@angular/core';
import { CardArray } from 'src/app/core/model/card';
import { PostsService } from 'src/app/core/services/posts.service';

@Component({
  selector: 'app-moviesHome',
  templateUrl: './movies-home.component.html',
  styleUrls: ['./movies-home.component.scss']
})
export class MoviesHomeComponent {
  constructor(private _PostsService:PostsService){}
  allMovies:CardArray[] = [];
  title:string = 'Movies'
  pageNumber:number=1;
  totalPages:number=0
  loadData(page:number){
    this._PostsService.getAll("movie", page).subscribe( (res) =>{
      this.allMovies = res.results     
      this.pageNumber = res.page;
      this.totalPages = res.total_results;  
    })
  }
  ngOnInit(){
    this.loadData(1)

  }
}
