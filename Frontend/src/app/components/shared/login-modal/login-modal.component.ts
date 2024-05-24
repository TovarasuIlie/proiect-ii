import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { ShippingCartService } from '../../../services/shipping-cart.service';
import { EmojiValidator } from '../../../validators/emoji-input.validator';

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
  @Output() loginEvent = new EventEmitter();

  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router, private toastService: ToastService, private shoppingCartService: ShippingCartService) {}

  ngOnInit(): void {
    this.initializerForm();
  }

  initializerForm() {
    this.loginForm = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.email, EmojiValidator.hasEmoji]],
      password: ['', [Validators.required, Validators.minLength(6), EmojiValidator.hasEmoji]]
    })
  }

  loginUser() {
    this.loginFormSubmited = true;
    this.errorMessages = [];
    if(this.loginForm.valid) {
      this.userService.loginUser(this.loginForm.value).subscribe({
        next: (response: any) => {
          this.shoppingCartService.loginSignal();
          this.router.navigateByUrl('/');
          this.closeModal.nativeElement.click();
          this.toastService.show({title: "Autentificare cu succes!", message: "Sunteti autentificat in contul dumnevoastra!", classname: "text-success"});
          this.loginForm.reset();
          this.loginForm.clearValidators();
        },
        error: (response) => {
          console.log(response);
          if(response.error instanceof String || typeof response.error === "string") {
            this.errorMessages.pop();
            this.errorMessages.push(response.error);
          } else {
            this.errorMessages.pop();
            this.errorMessages.push("Ne pare rau, momenat aplicatia nu functioneaza :(. Te rugam sa reincerci mai tarziu!");
          }
        } 
      });
    } else {
      this.loginForm.reset();
    }
  }
}
