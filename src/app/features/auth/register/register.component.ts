import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
error:string =''
constructor(private _AuthService:AuthService, private _Router:Router){}

// Form group definition with validation rules
registerForm: FormGroup = new FormGroup({
  name: new FormControl(null, [Validators.required, Validators.minLength(3)]),
  email: new FormControl(null, [Validators.required, Validators.email]),
  password: new FormControl(null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/)]),
  rePassword: new FormControl(null, [Validators.required]),
  phone: new FormControl(null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)])
}, { validators: this.confirmPassword }); // ربط الـ Validator هنا

// Custom validator to ensure password and rePassword match
confirmPassword(control: AbstractControl) {
  let password = control.get('password')?.value;
  let rePassword = control.get('rePassword')?.value;
  // Returns null if match, otherwise returns mismatch error object
  return password === rePassword ? null : { mismatch: true };
}

// Helper to check control validity and interaction state
validate(controlName:string):boolean{
  let control = this.registerForm.get(controlName)
  return !!(control?.invalid && (control?.dirty || control?.touched))
}
//Show / Hide Password
isPasswordVisible: boolean = false;
// Toggle password visibility
togglePasswordVisibility(): void {
  this.isPasswordVisible = !this.isPasswordVisible;
}


// Handle form submission
submitRegisterForm(registerForm: FormGroup) {
  if (registerForm.valid) {
    this._AuthService.register(registerForm.value).subscribe({
      //Status 200 (Success)
      next: (res) => {
        if (res.message === 'success') {
          this._Router.navigate(['login']);
        }
      },
      error: (err) => {
        this.error = err.error.message; 
      }
    });
  }
}


}
