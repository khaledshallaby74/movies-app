import { Component, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  // ==================== Forms ====================
  emailForm: FormGroup; // Form for user email input
  otpForm: FormGroup;   // Form for OTP input
  resetForm: FormGroup; // Form for new password input

  userEmail: string = ''; // Store email for OTP/password reset
  loading = false;        // Loading state for buttons

  // Observables from AuthService
  resendDisable$ = this._AuthService.isResendDisable(); // Flag to disable resend button
  countDown$ = this._AuthService.getCountDown();       // Countdown observable

  // OTP input references
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>; 
  otpControls = ['digit1','digit2','digit3','digit4','digit5','digit6']; // FormControl names

  constructor(
    private _AuthService: AuthService, 
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    // ==================== Initialize Forms ====================
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.otpForm = this.fb.group({
      digit1: ['', Validators.required],
      digit2: ['', Validators.required],
      digit3: ['', Validators.required],
      digit4: ['', Validators.required],
      digit5: ['', Validators.required],
      digit6: ['', Validators.required],
    });

    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatch }); // Custom validator for password match
  }

  // ==================== Validators ====================
  passwordMatch(group: FormGroup) {
    // Return null if passwords match, otherwise return mismatch error
    return group.get('newPassword')?.value === group.get('confirmPassword')?.value
      ? null 
      : { mismatch: true };
  }

  // ==================== Stepper Actions ====================
  sendResrtCode(stepper: MatStepper) {
    if (this.emailForm.invalid) return;

    this.userEmail = this.emailForm.value.email;
    this.loading = true;

    // Call backend to send OTP
    this._AuthService.forgetPassword(this.userEmail).subscribe({
      next: () => {
        this.snackBar.open('Reset code sent', 'Close', { duration: 3000 });
        stepper.next(); // Move to OTP step
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to send code', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  verifyOtp(stepper: MatStepper) {
    if (this.otpForm.invalid) return;

    const otp = Object.values(this.otpForm.value).join(''); // Concatenate OTP digits
    this.loading = true;

    this._AuthService.verifyOtp(this.userEmail, otp).subscribe({
      next: () => {
        this.snackBar.open('OTP Verified', 'Close', { duration: 3000 });
        stepper.reset(); // Reset stepper after verification
        this.loading = false;
      }
    });
  }

  setNewPassword(stepper: MatStepper) {
    if (this.resetForm.invalid) return;

    this.loading = true;

    this._AuthService.resetPassword(this.userEmail, this.resetForm.value.newPassword).subscribe({
      next: () => {
        this.snackBar.open('Password Reset Successfully', 'Close', { duration: 3000 });
        stepper.reset();
        this.loading = false;
      }
    });
  }

  resendCode() {
    // Call backend to resend OTP
    this._AuthService.resendOtp(this.userEmail).subscribe({
      next: () => {
        this.snackBar.open('Reset code resent', 'Close', { duration: 3000 });
      }
    });
  }

  // ==================== OTP Input Handling ====================
  onOtpInput(event: any, index: number) {
    const input = event.target;
    const value = input.value;

    // Only allow digits
    if (!/^\d$/.test(value)) {
      input.value = '';
      this.otpForm.get(this.otpControls[index])?.setValue('');
      return;
    }

    // Move to next input automatically
    if (index < this.otpControls.length - 1) {
      const nextInput = this.otpInputs.toArray()[index + 1];
      nextInput.nativeElement.focus();
    }
  }

  onOtpKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace') {
      const control = this.otpForm.get(this.otpControls[index]);

      // Move back if input is empty
      if (!control?.value && index > 0) {
        const prevInput = this.otpInputs.toArray()[index - 1];
        prevInput.nativeElement.focus();
      }
    }
  }

}