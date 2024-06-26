import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserService } from '../../services/user.service';
import { jwtDecode } from 'jwt-decode';
import { take } from 'rxjs';

@Directive({
  selector: '[appUserHasRole]'
})
export class UserHasRoleDirective implements OnInit {
  @Input() appUserHasRole: string[] = [];

  constructor(private viewContainerRef: ViewContainerRef, private templateRef: TemplateRef<any>, private userService: UserService) { }

  ngOnInit(): void {
    this.userService.user$.pipe((take(1))).subscribe({
      next: user => {
        if(user) {
          const decodedToken: any = jwtDecode(user.jwt);
          if(decodedToken.role.length == 2) {
            if(decodedToken.role.some((role: any) => this.appUserHasRole.includes(role))) {
              this.viewContainerRef.createEmbeddedView(this.templateRef);
            } else {
              this.viewContainerRef.clear();
            }
          } else {
            this.viewContainerRef.clear();
          }
        } else {
          this.viewContainerRef.clear();
        }
      }
    })
  }
}
