import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
// ==================== Constants ====================
private readonly BASE_URL ="https://ecommerce.routemisr.com/api/v1/auth";
private readonly TOKEN_KEY = "userToken"
//====================  User State ==================== 
userData = new BehaviorSubject<any>(null)
// ================= Forgot Password State =================
private otpCode:string = ''; // Temporary OTP code
private countDawn$ = new BehaviorSubject<number>(0); // Countdown timer observable
private resendDisabled$ = new BehaviorSubject<boolean>(true); // Flag to disable resend button
private countDawnTimer:any;  // JS interval reference for countdown


  constructor(private _HttpClient:HttpClient, private _Router:Router) {
    this.initializeUser(); // Decode JWT and populate userData
   }

   private initializeUser() :void{
    const token = this.getToken();
    if(token){
      this.decodeAndStoreUser(token)
    }
   }
   // Save token to localStorage
   private setToken(token:string): void{
    localStorage.setItem(this.TOKEN_KEY, token)
   }
   // Retrieve token from localStorage
   private getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
   }
   // Remove token on logout
   private clearToken(): void{
    localStorage.removeItem(this.TOKEN_KEY)
   }
   // Decode JWT and update user observable
   decodeAndStoreUser(token:string):void{
    const decode = jwtDecode(token);
    this.userData.next(decode)
   }
   // ==================== Auth API Calls ====================
   // User Registration
   register(formData:object):Observable<any>{
    return this._HttpClient.post(`${this.BASE_URL}/signup`, formData)
   }
   // User Login
  login(formData:object):Observable<any>{
    return this._HttpClient.post(`${this.BASE_URL}/signin`, formData).pipe(
      tap((res:any)=>{
        if(res.token){
          this.setToken(res.token);
          this.decodeAndStoreUser(res.token);
        }
      })
    )
  }
   // Logout
  logOut(){
    this.clearToken
    this.userData.next(null);
    this._Router.navigate(['login'])
  }
  // SOCIAL LOGIN 
  loginWithGoogle(): void{
    window.location.href = `${this.BASE_URL}/google`
  }
  loginWithFacebook(): void {
    window.location.href = `${this.BASE_URL}/facebook`;
  }


// ==================== Forgot Password ====================
 // Expose observables to component
getCountDown(){
  return this.countDawn$.asObservable();
}
isResendDisable(){
  return this.resendDisabled$.asObservable();
}
// Start countdown timer for OTP resend
private startCountDown(duration: number = 60){
  this.resendDisabled$.next(true);
  this.countDawn$.next(duration)
  if(this.countDawnTimer) clearInterval(this.countDawnTimer);
  this.countDawnTimer = setInterval( ()=> {
    let current = this.countDawn$.getValue();
    current -= 1;
    this.countDawn$.next(current)
    if(current >= 0){
      this.countDawnTimer.clearInterval();
      this.resendDisabled$.next(false)
    }
  }, 1000)
};
// Request OTP
forgetPassword(email:string):Observable<any>{
  this.getCountDown(); // Start countdown automatically
  return this._HttpClient.post(`${this.BASE_URL}/forgot-password`, {email}).pipe(
    tap( (res:any)=> this.otpCode = res.resetCode)
  )
};
// Verify OTP
verifyOtp(email:string, otp:string):Observable<boolean>{
   return this._HttpClient.post(`${this.BASE_URL}/verify-otp`, {email, otp}).pipe(
    map( ()=> true )
   )
};
// Reset password
resetPassword(email:string, newPassword:string) :Observable<any>{
  return this._HttpClient.post(`${this.BASE_URL}/reset-password`,{email , newPassword})
};
// Resend OTP
resendOtp(email:string){
  return this.forgetPassword(email)
}

}
