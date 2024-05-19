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
import { OffcanvasCategoriesComponent } from './offcanvas-categories/offcanvas-categories.component';
import { ShoppingCartHeaderComponent } from './shopping-cart-header/header.component';
import { ShoppingCartFooterComponent } from './shopping-cart-footer/footer.component';
import { PaginationComponent } from './pagination/pagination.component';
import { SearchBarHeaderComponent } from './search-bar-header/search-bar-header.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfirmEmailModalComponent } from './confirm-email-modal/confirm-email-modal.component';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    LoginModalComponent,
    RegisterModalComponent,
    ToastComponent,
    UserHasRoleDirective,
    OffcanvasCategoriesComponent,
    ShoppingCartHeaderComponent,
    ShoppingCartFooterComponent,
    PaginationComponent,
    SearchBarHeaderComponent,
    ConfirmEmailModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NgbToastModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    ToastComponent,
    ShoppingCartHeaderComponent,
    ShoppingCartFooterComponent,
    PaginationComponent,
  ]
})
export class SharedModule { }
