import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
private readonly BASE_URL ="https://ecommerce.routemisr.com/api/v1/auth";
userData = new BehaviorSubject(null)
  constructor(private _HttpClient:HttpClient, private _Router:Router) {
    if(localStorage.getItem('userToken')!= null){
      this.saveUserData()
    }
   }
  register(formData:object):Observable<any>{
    return this._HttpClient.post(`${this.BASE_URL}/signup`, formData)
  }
  login(formData:object):Observable<any>{
    return this._HttpClient.post(`${this.BASE_URL}/signin`, formData)
  }
  saveUserData(){
    let encodedUserData = JSON.stringify(localStorage.getItem('userToken'))
    this.userData.next(jwtDecode(encodedUserData))
    console.log(this.userData);
  }
  logOut(){
    localStorage.removeItem('userToken');
    this.userData.next(null);
    this._Router.navigate(['login'])
  }

}
