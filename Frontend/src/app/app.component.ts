import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = "Nume Aplicatie";

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.refreshUser();
  }

  private refreshUser() {
    const jwt = this.userService.getJWT();
    if(jwt) {
      this.userService.refreshUser(jwt).subscribe({
        next: _ => {},
        error: _ => {
          this.userService.logOut();
        }
      });
    } else {
      this.userService.refreshUser(null).subscribe();
    }
  }
  
}
