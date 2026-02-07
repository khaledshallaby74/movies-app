import { Component } from '@angular/core';
import { CardArray } from 'src/app/core/model/card';
import { PostsService } from 'src/app/core/services/posts.service';

@Component({
  selector: 'app-personsHome',
  templateUrl: './persons-home.component.html',
  styleUrls: ['./persons-home.component.scss'],

})
export class personsHomeComponent {
  constructor(private _PostsService:PostsService){}
  allPersons:CardArray[] = [];
  title:string = 'People'
  pageNumber:number=1;
  totalPages:number=0
  loadData(page:number){
    this._PostsService.getAll("person", page).subscribe( (res) =>{
      this.allPersons = res.results     
      this.pageNumber = res.page;
      this.totalPages = res.total_results;      
    })
  }
ngOnInit(){
    this.loadData(1)

}
}
