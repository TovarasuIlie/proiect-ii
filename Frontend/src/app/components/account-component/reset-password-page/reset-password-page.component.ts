import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { UserService } from '../../../services/user.service';
import { UserValidator, passwordConfirmValidator } from '../../../validators/register-form.validator';
import { ResetPassword, UserInteface } from '../../../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-reset-password-page',
  templateUrl: './reset-password-page.component.html',
  styleUrl: './reset-password-page.component.css'
})
export class ResetPasswordPageComponent implements OnInit {

  resetPasswordForm: FormGroup = new FormGroup({});
  resetPasswordFormSubmited: boolean = false;
  errorMessages: string[] = [];

  email: string | undefined;
  token: string | undefined;

  constructor(private titleService: Title, private formBuilder: FormBuilder, private router:Router, private activatedRoute: ActivatedRoute, private userService: UserService, private toastService: ToastService) {
    this.titleService.setTitle("Recuperare Parola - La Vericu' SRL");
  }

  ngOnInit(): void {
    this.initializerForm();
    localStorage.removeItem("resend-email-delay");
    this.userService.user$.pipe(take(1)).subscribe({
      next: (user: UserInteface | null) => {
        if(user) {
          this.router.navigateByUrl('/');
        } else {
          this.activatedRoute.queryParamMap.subscribe({
            next: (params: any) => {
              this.email = params.get('email');
              this.token = params.get('token');
              if(!this.email || !this.token) {
                this.router.navigateByUrl('/');
              }
            }
          })
        }
      }
    });
  }

  initializerForm() {
    this.resetPasswordForm = this.formBuilder.group({
      resetPassword: ['', [Validators.required, UserValidator.passwordStrengthValidator, Validators.minLength(8)]],
      resetPasswordConfirm: ['', [Validators.required]]
    },
    {
      validators: passwordConfirmValidator
    })
  }

  resetPassword() {
    this.resetPasswordFormSubmited = true;
    this.errorMessages = [];
    if(this.email && this.token && this.resetPasswordForm.valid) {
      const resetPassword: ResetPassword = {
        email: this.email,
        token: this.token,
        newPassword: this.resetPasswordForm.get('resetPassword')?.value
      };

      this.userService.resetPassword(resetPassword).subscribe({
        next: (response: any) => {
          this.router.navigateByUrl('/');
          this.toastService.show({title: response.value.title, message: response.value.message, classname: "bg-success"});
        },
        error: (response) => {
          this.errorMessages.pop();
          this.errorMessages.push(response.error);
        }
      });
    }
  }
}
