import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-confirm-email-modal',
  templateUrl: './confirm-email-modal.component.html',
  styleUrl: './confirm-email-modal.component.css'
})

export class ConfirmEmailModalComponent implements OnInit {
  confirmForm: FormGroup = new FormGroup({});
  errorMessages: string[] = [];
  confirmFormSubmited: boolean = false;
  @ViewChild('closeModal') closeModal: any;

  constructor(private userService: UserService, private formBuilder: FormBuilder, private toasterService: ToastService) {}

  ngOnInit(): void {
    this.confirmForm = this.formBuilder.group({
      userName: [null, [Validators.required, Validators.email]]
    });
  }

  resendEmail() {
    this.confirmFormSubmited = true;
    this.errorMessages= [];
    if(this.confirmForm.valid) {
      this.userService.resendEmailLink(this.confirmForm.value.userName).subscribe({
        next: (response: any) => {
          console.log(response);
          this.closeModal.nativeElement.click();
          this.toasterService.show({title: response.value.title, message: response.value.message, classname: "text-success"});
        },
        error: (response) => {
          this.errorMessages.pop();
          this.errorMessages.push(response.error.message);
        }
      })
    } else {
      this.confirmForm.reset();
    }
  }
}
