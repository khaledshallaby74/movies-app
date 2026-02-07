import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardArray } from 'src/app/core/model/card';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent {
imgPrifix:string = "https://image.tmdb.org/t/p/w500";
@Input() posts:CardArray[] =[];
@Input() title:string = '';
@Input() currentPage:number =1;
@Input() totalItems:number = 0;

constructor(){}
ngOnInit(){  }
slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
}

}
