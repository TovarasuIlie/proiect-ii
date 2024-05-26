import { Component, Inject, OnInit, Renderer2, ViewChild, viewChild } from '@angular/core';
import { MemberViewInterface } from '../../models/admin.model';
import { UserService } from '../../../../services/user.service';
import { AdminService } from '../../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../shared/services/toast.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-user-details-page',
  templateUrl: './user-details-page.component.html',
  styleUrl: './user-details-page.component.css'
})
export class UserDetailsPageComponent implements OnInit {
  id: string = '';
  member: MemberViewInterface = {
    id: '',
    userName: '',
    email: '',
    fullName: '',
    phone: '',
    address: '',
    roles: [],
    dateCreated: new Date(),
    isLocked: false,
    lockoutEnd: ''
  };
  editForm: FormGroup = new FormGroup({});
  errorMessages: string[] = [];
  roles: string[] = [];
  rolesForm:  any;


  @ViewChild('closeModalDelete') closeModalDelete: any;
  @ViewChild('closeModalEdit') closeModalEdit: any;
  @ViewChild('closeModalUnblock') closeModalUnblock: any;
  @ViewChild('closeModalBlock') closeModalBlock: any;

  constructor(public userService: UserService, private adminService: AdminService, private activedroute: ActivatedRoute, private toastService: ToastService, private formBuilder: FormBuilder, private router: Router, private _renderer2: Renderer2, @Inject(DOCUMENT) private _document: Document) {
  }

  ngOnInit(): void {
    this.activedroute.paramMap.subscribe({
      next: (params) => {
        const id = params.get('idUser');
        if(id) {
          this.id = id;
        }
      },
    });
    this.initializeMember();
    this.initializeForm();
  }

  ngAfterViewInit() {
    const script = this._renderer2.createElement('script');
    script.src = "/assets/js/index-page.js";
    this._renderer2.appendChild(this._document.body, script);
  }

  initializeMember() {
    this.adminService.getMember(this.id).subscribe({
      next: (value) => {
        this.member = value;
        this.initializeForm();
        this.roles = value.roles;
      },
      error: (response) => {
        console.log(response);
      }
    })
  }

  handleRoles(e: any) {
    this.rolesForm = this.editForm.get('roles') as FormArray;
    console.log(this.rolesForm.value);
    if(e.target.checked && e.target.value && !this.rolesForm.value.includes(e.target.value)) {
      console.log(e.target.value);
      this.rolesForm.push(new FormControl(e.target.value));
    } else {
      let  i = 0;
      this.rolesForm.controls.forEach(
        (r: any) => {
          if(r.value == e.target.value) {
            this.rolesForm.removeAt(i);
          }
          i++;
        }
      )
    }
  }

  initializeForm() {
    this.editForm = this.formBuilder.group({
      id: [this.member.id],
      userName: [this.member.userName, [Validators.required]],
      fullName: [this.member.fullName, [Validators.required]],
      phone: [this.member.phone, [Validators.required]],
      address: [this.member.address, [Validators.required]],
      roles: this.formBuilder.array(this.member.roles)
    });
  }

  unlockUser() {
    this.adminService.unlockMember(this.id).subscribe({
      next: (value) => {
        this.closeModalUnblock.nativeElement.click();
        this.initializeMember();
        this.toastService.show({title: "Cont deblocat!", message: "Contul a fost deblocat cu success!", classname: "text-success"});
      },
      error: (response) => {
        console.log(response);
        this.toastService.show({title: response.error.title, message: response.error.message, classname: "text-danger"});
      }
    })
  }

  lockUser() {
    this.adminService.lockMember(this.id).subscribe({
      next: (value) => {
        this.closeModalBlock.nativeElement.click();
        this.initializeMember();
        this.toastService.show({title: "Cont blocat!", message: "Contul a fost blocat cu success!", classname: "text-success"});
      },
      error: (response) => {
        console.log(response);
        this.toastService.show({title: response.error.title, message: response.error.message, classname: "text-danger"});
      }
    })
  }

  editUser() {
    if(this.editForm.valid) {
      if(this.member.userName != localStorage.getItem('userName')) {
        this.adminService.editMember(this.editForm.value).subscribe({
          next: (response: any) => {
            console.log(response);
            this.closeModalEdit.nativeElement.click();
            this.toastService.show({title: response.value.title, message: response.value.message, classname: "text-success"});
            this.initializeMember();
          },
          error: (response) => {
            console.log(response);
            this.toastService.show({title: response.error.title, message: response.error.message, classname: "text-danger"});
          }
        })
      } else {
        this.errorMessages.pop();
        this.errorMessages.push("Nu iti poti edita singur contul!")
      }
    } else {
      this.errorMessages.pop();
      this.errorMessages.push("Toate campurile trebuie sa fie completate!")
    }
  }

  deleteUser() {
    this.adminService.deleteMember(this.id).subscribe({
      next: (response) => {
        this.closeModalDelete.nativeElement.click();
        setTimeout(() => {
          this.router.navigateByUrl('/dashboard/utilizatori');
        }, 500);
        this.toastService.show({title: "Utilizator sters!", message: "Utilizatorul a fost sters cu succes!", classname: "text-success"});
      },
      error: (response) => {
        console.log(response);
        this.toastService.show({title: response.error.title, message: response.error.message, classname: "text-danger"});
      }
    })
  }
}
