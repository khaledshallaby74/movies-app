import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(private _AuthService:AuthService, private _Router:Router){}
  isLogin:boolean = false;
  ngOnInit(){
    this._AuthService.userData.subscribe( ()=>{
        if(this._AuthService.userData.getValue() != null){
          this.isLogin = true
        }else{
          this.isLogin = false
        }
    } )    
  }
  logOut(){
    this._AuthService.logOut()
  }

}
