import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserValidator, passwordConfirmValidator } from '../../../validators/register-form.validator';
import { UserService } from '../../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmEmailComponent } from '../../account-component/confirm-email/confirm-email.component';
import { ToastComponent } from '../toast/toast.component';
import { ToastService } from '../services/toast.service';
import { EmojiValidator } from '../../../validators/emoji-input.validator';

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrl: './register-modal.component.css',
})
export class RegisterModalComponent implements OnInit {
  
  registerForm: FormGroup = new FormGroup({});
  registerFormSubmited: boolean = false;
  errorMessages: string[] = [];
  registerSuccess: boolean = false;
  @ViewChild(ConfirmEmailComponent) confirmEmailComponent: any;
  emailConfirmed: boolean = false;
  @ViewChild('closeModal') closeModal: any;

  constructor(private userService: UserService, private formBuilder: FormBuilder, private router: Router, private toastService: ToastService) {

  }

  ngOnInit(): void {
    this.initializerForm();
  }

  initializerForm() {
    this.registerForm = this.formBuilder.group({
      fullName: ['', [Validators.required, UserValidator.nameValidator, EmojiValidator.hasEmoji]],
      email: ['', [Validators.required, Validators.email, EmojiValidator.hasEmoji]],
      password: ['', [Validators.required, UserValidator.passwordStrengthValidator, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, EmojiValidator.hasEmoji]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]*'), EmojiValidator.hasEmoji]],
      address: ['', [Validators.required, EmojiValidator.hasEmoji]]
    },
    {
      validators: passwordConfirmValidator
    }
    )
  }

  addNewUser() {
    this.registerFormSubmited = true;
    this.errorMessages = [];
    if(this.registerForm.valid) {
      this.userService.addNewUser(this.registerForm.value).subscribe({
        next: (response: any) => {
          this. router.navigateByUrl('/');
          this.closeModal.nativeElement.click();
          this.registerForm.reset();
          this.toastService.show({title: response.value.title, message: response.value.message, classname: "text-success"});
          this.markControlsUntouched();
        },
        error: (response) => {
          this.errorMessages.pop();
          this.errorMessages.push(response.error);
        } 
      });
    } else {
      this.registerForm.reset();
    }
  }

  private markControlsUntouched(): void {
    Object.keys(this.registerForm.controls).forEach((key: string) => {
        const abstractControl = this.registerForm.controls[key];
        abstractControl.setErrors(null);
    });
  }
}
