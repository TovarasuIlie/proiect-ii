import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.css'
})
export class LoginModalComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({});
  loginFormSubmited: boolean = false;
  errorMessages: string[] = [];
  @ViewChild('closeModal') closeModal: any;
  loginSuccess: boolean = false;
  toaster: any;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.initializerForm();
  }

  initializerForm() {
    this.loginForm = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
  }

  loginUser() {
    this.loginFormSubmited = true;
    this.errorMessages = [];
    if(this.loginForm.valid) {
      this.userService.loginUser(this.loginForm.value).subscribe({
        next: (response: any) => {
          console.log(response);
          this. router.navigateByUrl('/');
          // this.loginSuccess = true;
          this.closeModal.nativeElement.click();
          // this.toaster.title = response.value.title;
          // this.toaster.message = response.value.message;
          // this.loginForm.reset();
        },
        error: (response) => {
          console.log(response);
          this.errorMessages.push(response.error);
        } 
      });
    } else {
      // this.loginForm.reset();
    }
  }
}
