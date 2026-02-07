import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from 'src/app/core/services/posts.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent {
  imgPrifix:string = "https://image.tmdb.org/t/p/w500";

id:string = "";
media_type:string="";

postDetails:any ={}
constructor(private _ActivatedRoute:ActivatedRoute, private _PostsService:PostsService){}
ngOnInit(){
  this._ActivatedRoute.params.subscribe( (param)=>{
    this.id = param?.['id']
    this.media_type = this._ActivatedRoute.snapshot.data['type'];    
  } )
  this._PostsService.getDetails(this.media_type , this.id).subscribe( (res)=>{
    this.postDetails = res
    console.log(this.postDetails);
        
  } )

}
}
