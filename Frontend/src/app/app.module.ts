import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexPageComponent } from './components/index-page/index-page.component';
import { TiresPageComponent } from './components/tires-page/tires-page.component';
import { ToolsPageComponent } from './components/tools-page/tools-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarPartsComponent } from './components/car-parts-page/car-parts/car-parts.component';
import { ForgotPasswordPageComponent } from './components/account-component/forgot-password-page/forgot-password-page.component';
import { ResetPasswordPageComponent } from './components/account-component/reset-password-page/reset-password-page.component';
import { SharedModule } from './components/shared/shared.module';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { MotorOilPageComponent } from './components/motor-oil-page/motor-oil-page.component';
import { JwtInterceptor } from './interceptions/jwt.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    IndexPageComponent,
    TiresPageComponent,
    ToolsPageComponent,
    CarPartsComponent,
    NotFoundPageComponent,
    ForgotPasswordPageComponent,
    ResetPasswordPageComponent,
    MotorOilPageComponent,
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
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
