import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AdminService } from '../../services/admin.service';
import { UserService } from '../../../../services/user.service';
import { MemberViewInterface } from '../../models/admin.model';
import { DOCUMENT } from '@angular/common';
import { PaginateConfig } from '../../../../models/paginate.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserInteface } from '../../../../models/user.model';

@Component({
  selector: 'app-all-users-page',
  templateUrl: './all-users-page.component.html',
  styleUrl: './all-users-page.component.css'
})
export class AllUsersPageComponent implements OnInit {
  members: MemberViewInterface[] = [];
  paginatorConfig: PaginateConfig = {
    currentPageName: 'utilizatori',
    totalItems: 10,
    itemsPerPage: 10,
    currentPage: 1
  }
  filterForm: FormGroup = new FormGroup({});

  constructor(public userService: UserService, private titleService: Title, private adminService: AdminService, private _renderer2: Renderer2, @Inject(DOCUMENT) private _document: Document, private router: ActivatedRoute, private formBuilder: FormBuilder) {
    this.titleService.setTitle("Roluri Utilizatori - La Verucu' SRL");
  }

  ngOnInit(): void {
    this.initializePagination();
    this.initializeMembers();
    this.initializeForm();
  }

  initializeMembers() {
    const paginatorConfig = sessionStorage.getItem("paginatorConfig");
    if(paginatorConfig) {
        this.paginatorConfig = JSON.parse(paginatorConfig);
    }
    this.adminService.getMembersPagination(this.paginatorConfig.currentPage, this.paginatorConfig.itemsPerPage).subscribe({
      next: (members) => {
        this.members = members;
      }
    });
  }

  initializeForm() {
    this.filterForm = this.formBuilder.group({
      itemsPerPage: [this.paginatorConfig.itemsPerPage],
      orderListType: ['ASC']
    })
  }

  ngAfterViewInit() {
    const script = this._renderer2.createElement('script');
    script.src = "/assets/js/index-page.js";
    this._renderer2.appendChild(this._document.body, script);
  }

  initializePagination() {
    const paginatorConfig = sessionStorage.getItem("paginatorConfig");
    if(paginatorConfig && paginatorConfig.includes(this.router.snapshot.url[0].path)) {
        this.paginatorConfig = JSON.parse(paginatorConfig);
    } else {
      this.adminService.getMembersCount().subscribe({
        next: (value) => {
          this.paginatorConfig.totalItems = value;
        }
      });
    }
    const totalPages = Math.ceil(this.paginatorConfig.totalItems / this.paginatorConfig.itemsPerPage);
    if(this.paginatorConfig.currentPage > totalPages) {
      this.paginatorConfig.currentPage = totalPages
    }
    console.log(this.paginatorConfig);
    sessionStorage.setItem('paginatorConfig', JSON.stringify(this.paginatorConfig));
  }

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
