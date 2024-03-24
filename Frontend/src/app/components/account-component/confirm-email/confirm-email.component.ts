import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEmail, UserInteface } from '../../../models/user.model';
import { take } from 'rxjs';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.css'
})
export class ConfirmEmailComponent implements OnInit {
  toaster: any = {
    title: 'Test',
    message: 'test'
  };
  // registerSuccess: boolean = true;
  emailConfirmed: boolean = false;

  progressBarValue: number = 0;

  constructor(private userService: UserService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.userService.user$.pipe(take(1)).subscribe({
      next: (user: UserInteface | null) => {
        if(user) {
          this.router.navigateByUrl('/');
        } else {
          this.activatedRoute.queryParamMap.subscribe({
            next: (params: any) => {
              const confirmEmail: ConfirmEmail = {
                email: params.get("email"),
                token: params.get("token")
              }
              this.userService.confirmEmail(confirmEmail).subscribe({
                next: (response: any) => {
                  this.progressBarValue += 25;
                  setInterval(() => {
                    this.progressBarValue += 25;
                    if(this.progressBarValue == 100) {
                      setTimeout(() => {
                        this.router.navigateByUrl("/");
                      }, 500);
                    }
                  }, 600);
                },
                error: response => {
                  this.emailConfirmed = true;
                  this.toaster.title = "Eroare la validare";
                  this.toaster.message = response.error;
                  this.router.navigateByUrl("/");
                }
              });
            },
          });
        }
      }
    })
  }

}
