import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AdminService } from '../../services/admin.service';
import { UserService } from '../../../../services/user.service';
import { MemberViewInterface } from '../../models/admin.model';
import { DOCUMENT } from '@angular/common';
import { PaginateConfig } from '../../../../models/paginate.model';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-all-users-page',
  templateUrl: './all-users-page.component.html',
  styleUrl: './all-users-page.component.css'
})
export class AllUsersPageComponent implements OnInit {
  members: MemberViewInterface[] = [];
  paginatorConfig: PaginateConfig = {
    totalItems: 10,
    itemsPerPage: 10,
    currentPage: 1
  }
  filterForm: FormGroup = new FormGroup({});

  constructor(public userService: UserService, private titleService: Title, private adminService: AdminService, private _renderer2: Renderer2, @Inject(DOCUMENT) private _document: Document) {
    this.titleService.setTitle("Roluri Utilizatori - La Verucu' SRL");
  }

  ngOnInit(): void {

  }

  initializeMembers() {
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

  // initializePagination() {
  //   const paginatorConfig = sessionStorage.getItem("paginatorConfig");
  //   if(paginatorConfig) {
  //       this.paginatorConfig = JSON.parse(paginatorConfig);
  //   } else {
  //     this.adminService.getMembersCount().subscribe({
  //       next: (value) => {
  //         this.paginatorConfig.totalItems = value;
  //       }
  //     });
  //   }
  //   const totalPages = Math.ceil(this.paginatorConfig.totalItems / this.paginatorConfig.itemsPerPage);
  //   if(this.paginatorConfig.currentPage > totalPages) {
  //     this.paginatorConfig.currentPage = totalPages
  //   }
  //   sessionStorage.setItem('paginatorConfig', JSON.stringify(this.paginatorConfig));
  // }

  resultPerPageChange() {
    this.paginatorConfig.itemsPerPage = this.filterForm.get('itemsPerPage')?.value;
    sessionStorage.setItem("paginatorConfig", JSON.stringify(this.paginatorConfig));
    const paginatorConfig = sessionStorage.getItem("paginatorConfig");
    if(paginatorConfig) {
      this.paginatorConfig = JSON.parse(paginatorConfig);
    }
    const totalPages = Math.ceil(this.paginatorConfig.totalItems / this.paginatorConfig.itemsPerPage);
    if(this.paginatorConfig.currentPage > totalPages) {
      this.paginatorConfig.currentPage = totalPages
    }
    this.initializeMembers();
  }

  changePage(page: number) {
    this.paginatorConfig.currentPage = page;
    sessionStorage.setItem('paginatorConfig', JSON.stringify(this.paginatorConfig));
    this.initializeMembers();
  }
}
