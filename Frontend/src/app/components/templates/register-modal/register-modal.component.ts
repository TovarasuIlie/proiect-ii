import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserValidator } from '../../../validators/register-form.validator';
import { UserService } from '../../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrl: './register-modal.component.css',
})
export class RegisterModalComponent implements OnInit {
  
  registerForm: FormGroup = new FormGroup({});
  registerFormSubmited: boolean = false;
  errorMessages: string[] = [];
  toaster: any = {
    title: 'Test',
    message: 'test'
  };
  registerSuccess: boolean = false;
  @ViewChild('closeModal') closeModal: any;

  constructor(private userService: UserService, private formBuilder: FormBuilder, private router: Router) {

  }

  ngOnInit(): void {
    this.initializerForm();
  }

  initializerForm() {
    this.registerForm = this.formBuilder.group({
      fullName: ['', [Validators.required, UserValidator.nameValidator]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, UserValidator.passwordStrengthValidator, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, UserValidator.confirmPasswordValidator]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]*')]],
      address: ['', Validators.required]
    })
  }

  addNewUser() {
    this.registerFormSubmited = true;
    this.errorMessages = [];
    if(this.registerForm.valid) {
      this.userService.addNewUser(this.registerForm.value).subscribe({
        next: (response: any) => {
          this. router.navigateByUrl('/');
          this.registerSuccess = true;
          this.closeModal.nativeElement.click();
          this.toaster.title = response.value.title;
          this.toaster.message = response.value.message;
          this.registerForm.reset();
        },
        error: (response) => {
          this.errorMessages.push(response.error);
        } 
      });
    } else {
      this.registerForm.reset();
    }
  }
}
