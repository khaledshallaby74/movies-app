import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonsRoutingModule } from './persons-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PersonsComponent } from './persons.component';
import { personsHomeComponent } from './pages/persons-home/persons-home.component';


@NgModule({
  declarations: [
    PersonsComponent,
    personsHomeComponent
  ],
  imports: [
    CommonModule,
    PersonsRoutingModule,
    SharedModule
  ]
})
export class PersonsModule { 
  
 }
