import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, Event } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { environment } from '../../../../../environments/environment.development';
import { UserValidator } from '../../../../validators/register-form.validator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent implements OnInit {
  editAccountForm: FormGroup = new FormGroup({});
  
  currentPath: string = '';
  errorMessages: string[] = [];
  editAccountFormSubmited: boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router, public userService: UserService) {

  }

  ngOnInit(): void {
    this.initializerForm();

    this.router.events.subscribe((event:Event) => {
      if(event instanceof NavigationEnd) {
        this.currentPath = event.url;
      }
    });
  }
  
  initializerForm() {
    const json: any = localStorage.getItem(environment.userKey);
    this.editAccountForm = this.formBuilder.group({
      fullName: [JSON.parse(json).fullName, [Validators.required, UserValidator.nameValidator]],
      address: [JSON.parse(json).address, [Validators.required]],
      phone: [JSON.parse(json).phone, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    })
  }

  editAccountDetails() {
    this.editAccountFormSubmited = true;
    console.log(this.editAccountForm.getRawValue())
  }
}
