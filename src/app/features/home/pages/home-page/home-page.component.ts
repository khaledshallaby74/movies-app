import { Component } from '@angular/core';
import { CardArray } from 'src/app/core/model/card';
import { PostsService } from 'src/app/core/services/posts.service';

@Component({
  selector: 'app-homePage',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  constructor(private _PostsService:PostsService){}
  title:string = 'Movies And Series'
  allTrending:CardArray[] = [];
  pageNumber:number=1;
  totalPages:number=0
  loadData(page:number){
    this._PostsService.getAll("all", page).subscribe( (res) =>{
      this.allTrending = res.results     
      this.pageNumber = res.page;
      this.totalPages = res.total_results;  
    
    })
  }
  ngOnInit(){
    this.loadData(1)
  }  
}
