import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexPageComponent } from './components/index-page/index-page.component';
import { TiresPageComponent } from './components/tires-page/tires-page.component';
import { ToolsPageComponent } from './components/tools-page/tools-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarPartsComponent } from './components/car-parts-page/car-parts/car-parts.component';
import { DashboardIndexPageComponent } from './components/dashboard/index-page/index-page.component';
import { ForgotPasswordPageComponent } from './components/account-component/forgot-password-page/forgot-password-page.component';
import { ResetPasswordPageComponent } from './components/account-component/reset-password-page/reset-password-page.component';
import { SharedModule } from './components/shared/shared.module';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexPageComponent,
    TiresPageComponent,
    ToolsPageComponent,
    CarPartsComponent,
    NotFoundPageComponent,
    DashboardIndexPageComponent,
    ForgotPasswordPageComponent,
    ResetPasswordPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
