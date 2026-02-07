import { Component, Input } from '@angular/core';
import { Card, CardArray } from 'src/app/core/model/card';

@Component({
  selector: 'app-owlcarousel',
  templateUrl: './owlcarousel.component.html',
  styleUrls: ['./owlcarousel.component.scss']
})
export class OwlcarouselComponent {
  imgPrifix:string = "https://image.tmdb.org/t/p/w500";
  @Input() owlData:CardArray[]=[]
breakpoints = {
  0: { slidesPerView: 2 },      
  600: { slidesPerView: 4 },    
  1000: { slidesPerView: 6 },   
  1400: { slidesPerView: 8 } 
};
  trackByFn(index: number, item: CardArray) {
    return item.id;
  }

ngOnInit(){

}

  
}
