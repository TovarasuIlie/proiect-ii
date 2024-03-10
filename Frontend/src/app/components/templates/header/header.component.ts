import { Component } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { User, UserLogin } from '../../../models/user.model';
import { FormBuilder, Validators } from '@angular/forms';
import { UserValidator } from '../../../validators/register-form.validator';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  currentPath: string = "";
  loginFormSubmited: boolean = false;
  registerFormSubmited: boolean = false;
  userRegister: User = {
    fullName: "",
    email: "",
    password: "",
    phone: "",
    address: ""
  }

  user: UserLogin = {
    email: "",
    password: ""
  }

  registerForm = this.formBuilder.group({
    fullName: ['', [Validators.required, UserValidator.nameValidator]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, UserValidator.passwordStrengthValidator, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required, UserValidator.confirmPasswordValidator]],
    phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]*')]],
    address: ['', Validators.required]
  })

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  })

  constructor(private router: Router, private formBuilder: FormBuilder, private userService: UserService) {
    router.events.subscribe((event:Event) => {
      if(event instanceof NavigationEnd) {
        this.currentPath = event.url;
      }
    });
  }

  addNewUser() {
    this.registerFormSubmited = true;
    if(this.registerForm.valid) {
      this.userService.addNewUser(this.userRegister).subscribe({
        next: (user) => {
          console.log(user);
        },
        error: (response) => {
          console.log(response);
        } 
      });
    } else {
      console.log("laso asa");
      this.registerForm.reset();
    }
  }

  loginUser() {
    this.loginFormSubmited = true;
    if(this.loginForm.valid) {
      console.log(this.user);
    } else {
      console.log("laso asa");
      this.loginForm.reset();
    }
  }

}
