import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AdminService } from '../../services/admin.service';
import { UserService } from '../../../../services/user.service';
import { MemberViewInterface } from '../../models/admin.model';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-all-users-page',
  templateUrl: './all-users-page.component.html',
  styleUrl: './all-users-page.component.css'
})
export class AllUsersPageComponent implements OnInit {
  members: MemberViewInterface[] = [];

  constructor(public userService: UserService, private titleService: Title, private adminService: AdminService, private _renderer2: Renderer2, @Inject(DOCUMENT) private _document: Document) {
    this.titleService.setTitle("Roluri Utilizatori - La Verucu' SRL");
  }

  ngOnInit(): void {
    this.adminService.getMembers().subscribe({
      next: (members) => {
        this.members = members;
      }
    })
  }

  ngAfterViewInit() {
    const script = this._renderer2.createElement('script');
    script.src = "/assets/js/index-page.js";
    this._renderer2.appendChild(this._document.body, script);
  }
}
