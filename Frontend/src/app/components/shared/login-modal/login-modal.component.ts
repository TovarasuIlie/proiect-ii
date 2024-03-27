import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';

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

  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router, private toastService: ToastService) {}

  ngOnInit(): void {
    this.initializerForm();
  }

  initializerForm() {
    this.loginForm = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  loginUser() {
    this.loginFormSubmited = true;
    this.errorMessages = [];
    if(this.loginForm.valid) {
      this.userService.loginUser(this.loginForm.value).subscribe({
        next: (response: any) => {
          console.log(response);
          this.router.navigateByUrl('/');
          this.closeModal.nativeElement.click();
          this.toastService.show({title: "Autentificare cu succes!", message: "Sunteti autentificat in contul dumnevoastra!", classname: "text-success"});
        },
        error: (response) => {
          console.log(response);
          this.errorMessages.pop();
          this.errorMessages.push(response.error);
        } 
      });
    } else {
      this.loginForm.reset();
    }
  }
}
