import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
constructor(private _AuthService:AuthService, private _Router:Router){}
error:string = ""
loginForm:FormGroup = new FormGroup ({
  email: new FormControl(null, [Validators.required, Validators.email]),
  password: new FormControl(null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/)])
})
// Helper to check control validity and interaction state
validate(controlName:string):boolean{
  let control = this.loginForm.get(controlName);
  return !! (control?.invalid && (control?.touched || control?.dirty))
}
// Show / Hide Password
isPasswordVisible: boolean = false;
// Toggle password visibility
togglePasswordVisibility(): void {
  this.isPasswordVisible = !this.isPasswordVisible;
}
// Handle form submission
submitLoginForm(loginForm:FormGroup){
  this._AuthService.login(loginForm.value).subscribe({
    next: (res)=>{      
      if(res.message == "success"){
        localStorage.setItem('userToken', res.token)
        this._AuthService.saveUserData()
        this._Router.navigate(['home'])
      }
    }, 
    error: (err)=>{
      this.error = err.error.message;
    } 
  })
}



}

