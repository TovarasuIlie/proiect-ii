import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterModalComponent } from './register-modal/register-modal.component';
import { RouterModule } from '@angular/router';
import { ToastComponent } from './toast/toast.component';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { UserHasRoleDirective } from '../directives/user-has-role.directive';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    LoginModalComponent,
    RegisterModalComponent,
    ToastComponent,
    UserHasRoleDirective
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NgbToastModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    ToastComponent
  ]
})
export class SharedModule { }
