import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Output() pageChanged = new EventEmitter<number>()
  onPageChange(page:number){
  this.pageChanged.emit(page)  
}
}
