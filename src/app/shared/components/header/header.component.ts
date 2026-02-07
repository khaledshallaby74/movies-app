import { Component, Input } from '@angular/core';
import { CardArray } from 'src/app/core/model/card';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
@Input() posts:CardArray[] =[];

}
