import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AppRoutingModule } from '../../app-routing.module';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterModalComponent } from './register-modal/register-modal.component';
import { AccountModule } from '../account-component/account.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    LoginModalComponent,
    RegisterModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
  ]
})
export class SharedModule { }
