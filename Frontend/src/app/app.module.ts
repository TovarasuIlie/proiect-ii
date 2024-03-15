import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexPageComponent } from './components/index-page/index-page.component';
import { HeaderComponent } from './components/templates/header/header.component';
import { FooterComponent } from './components/templates/footer/footer.component';
import { TiresPageComponent } from './components/tires-page/tires-page.component';
import { ToolsPageComponent } from './components/tools-page/tools-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarPartsComponent } from './components/car-parts-page/car-parts/car-parts.component';
import { NotFoundPageComponent } from './components/templates/not-found-page/not-found-page.component';
import { RegisterModalComponent } from './components/templates/register-modal/register-modal.component';
import { LoginModalComponent } from './components/templates/login-modal/login-modal.component';
import { DashboardIndexPageComponent } from './components/dashboard/index-page/index-page.component';
import { OrdersPageComponent } from './components/profile-page/orders-page/orders-page.component';
import { ProfilePageComponent } from './components/profile-page/profile-page/profile-page.component';
import { WishlistPageComponent } from './components/profile-page/wishlist-page/wishlist-page.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexPageComponent,
    FooterComponent,
    HeaderComponent,
    RegisterModalComponent,
    LoginModalComponent,
    TiresPageComponent,
    ToolsPageComponent,
    CarPartsComponent,
    NotFoundPageComponent,
    DashboardIndexPageComponent,
    OrdersPageComponent,
    ProfilePageComponent,
    WishlistPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
