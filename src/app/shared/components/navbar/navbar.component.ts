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
  socialMediaIconsArray = [
    { icon: 'iC-Twitter-Icon', link: 'https://www.snapchat.com/' }, { icon: 'iC-LinkedIn-Icon' }, { icon: 'iC-Facebook-Icon' },
    { icon: 'iC-Snapchat-Icon' }
  ]
  ngOnInit(){ }
  logOut(){
    this._AuthService.logOut()
  }
  

}
