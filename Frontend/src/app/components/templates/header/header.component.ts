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
  userRegister: User = {
    name: "",
    email: "",
    password: "",
    phone: "",
    address: ""
  }

  user: UserLogin = {
    email: "",
    password: ""
  }

  registerFrom = this.formBuilder.group({
    name: ['', [Validators.required, UserValidator.nameValidator]],
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
    if(this.registerFrom.valid) {
      this.userService.addNewUser(this.userRegister).subscribe({
        next: (user1) => {
          console.log(user1);
        }
      });
    } else {
      console.log("laso asa");
    }
  }

  loginUser() {
    if(this.registerFrom.valid) {
      console.log(this.user);
    } else {
      console.log("laso asa");
    }
  }

}
