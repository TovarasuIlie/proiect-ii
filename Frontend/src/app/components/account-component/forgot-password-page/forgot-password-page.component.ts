import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, SelectControlValueAccessor, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-forgot-password-page',
  templateUrl: './forgot-password-page.component.html',
  styleUrl: './forgot-password-page.component.css'
})
export class ForgotPasswordPageComponent implements OnInit {
  resetPasswordForm: FormGroup = new FormGroup({});
  resetPasswordFormSubmited: boolean = false;
  errorMessages: string[] = [];
  successMessages: string[] = [];
  sendLinkSuccess:boolean = false;
  secundes: string = '';
  minutes: string = '';

  constructor(private titleService: Title, private formBuilder: FormBuilder, private userService: UserService) {
    this.titleService.setTitle("Recuperare Parola - La Vericu' SRL");
  }

  ngOnInit(): void {
    this.initializerForm();
    this.verifyDelay();
  }

  initializerForm() {
    this.resetPasswordForm = this.formBuilder.group({
      resetEmail: ['', [Validators.required, Validators.email]]
    })
  }

  makeTimer(miliseconds: number) {
    this.minutes = (Math.floor(((miliseconds / 1000) / 60))) >= 10 ? Math.floor(((miliseconds / 1000) / 60)).toString() : '0' + Math.floor(((miliseconds / 1000) / 60)).toString();
    this.secundes = (Math.floor(((miliseconds / 1000) % 60))) >= 10 ? Math.floor(((miliseconds / 1000) % 60)).toString() : '0' + Math.floor(((miliseconds / 1000) % 60)).toString();
  }

  verifyDelay() {
    var endDelayTime = localStorage.getItem("resend-email-delay");
    if(endDelayTime) {
      var current = new Date();
      var now = current.getTime();
      this.makeTimer(parseInt(endDelayTime) - now);
      this.sendLinkSuccess = true;
      const id = setInterval(() => {
        if(endDelayTime) {
          var current = new Date();
          var now = current.getTime();
          if(parseInt(endDelayTime) > now) {
            this.sendLinkSuccess = true;
            this.makeTimer(parseInt(endDelayTime) - now);
          } else {
            this.sendLinkSuccess = false;
            localStorage.removeItem("resend-email-delay");
            clearInterval(id);
          }
        }
      }, 1000);
    }
  }

  setDelay() {
    const current = new Date();
    const now = current.getTime();
    current.setMinutes(current.getMinutes() + 5);
    const delay = current.getTime();
    localStorage.setItem("resend-email-delay",  delay.toString());
    this.verifyDelay();
  }

  sendResetLink() {
    this.resetPasswordFormSubmited = true;
    if(this.resetPasswordForm.valid) {
      this.userService.sendResetLink(this.resetPasswordForm.get('resetEmail')?.value).subscribe({
        next: (response: any) => {
          if(!this.sendLinkSuccess) {
            this.setDelay();
            this.errorMessages.pop();
            this.successMessages.push(response.value.title + ". \n" + response.value.message);
          } else {
            this.successMessages.pop();
            this.errorMessages.push("Un email a fost trimis deja. Te rugam sa astepti timpul indicat!");
          }
        },
        error: (response) => {
          this.errorMessages.pop();
          this.errorMessages.push(response.error);
        }
      })
    }
  }

}
