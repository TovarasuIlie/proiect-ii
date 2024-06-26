import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexPageComponent } from './components/site-main-pages/index-page/index-page.component';
import { ToolsPageComponent } from './components/site-main-pages/tools-page/tools-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ForgotPasswordPageComponent } from './components/account-component/forgot-password-page/forgot-password-page.component';
import { ResetPasswordPageComponent } from './components/account-component/reset-password-page/reset-password-page.component';
import { SharedModule } from './components/shared/shared.module';
import { NotFoundPageComponent } from './components/site-main-pages/not-found-page/not-found-page.component';
import { MotorOilPageComponent } from './components/site-main-pages/motor-oil-page/motor-oil-page.component';
import { JwtInterceptor } from './interceptions/jwt.interceptor';
import { AccesoriesPageComponent } from './components/site-main-pages/accesories-page/accesories-page.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { SearchPageComponent } from './components/site-main-pages/search-page/search-page.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexPageComponent,
    ToolsPageComponent,
    NotFoundPageComponent,
    ForgotPasswordPageComponent,
    ResetPasswordPageComponent,
    MotorOilPageComponent,
    AccesoriesPageComponent,
    SearchPageComponent
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
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
