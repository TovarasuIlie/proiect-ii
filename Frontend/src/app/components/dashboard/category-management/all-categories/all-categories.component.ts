import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2, ViewChild, viewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from '../../../../services/user.service';
import { CategoriesService } from '../../services/categories.service';
import { CategoryInterface } from '../../models/category-interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-all-categories',
  templateUrl: './all-categories.component.html',
  styleUrl: './all-categories.component.css'
})
export class AllCategoriesComponent implements OnInit {

  categories: CategoryInterface[] = [];
  categoryImage!: File;
  categoryForm: FormGroup = new FormGroup({});
  resultPerPage: FormGroup = new FormGroup({});
  errorMessages: string[] = [];
  @ViewChild('closeModal') closeModal: any;
  categoryID: number = 0;
  formSubmited!: boolean;
  @ViewChild('paginate') paginate: any;

  totalItems!: number;
  currentPage!: number;
  itemsPerPage!: number;
  totalPages!: number;

  constructor(private titleService: Title, private _renderer2: Renderer2, @Inject(DOCUMENT) private _document: Document, public userService: UserService, private categoryService: CategoriesService, 
              private formBuilder: FormBuilder, private toastService: ToastService) {
    this.titleService.setTitle("Dashboard - La Verucu' SRL");
  }

  ngOnInit(): void {
    this.initializeGategory();
    this.initializeForm();
    this.initializePagination();
  }

  ngAfterViewInit() {
    const script = this._renderer2.createElement('script');
    script.src = "/assets/js/index-page.js";
    this._renderer2.appendChild(this._document.body, script);
  }

  initializeGategory() {
    this.categoryService.getCategoriesPagination(parseInt(sessionStorage.getItem('currentPage') || '1'), parseInt(sessionStorage.getItem('itemsPerPage') || '10')).subscribe({
      next: (categories) => {
        this.categories = categories;
      }
    });
  }

  initializePagination() {
    if(sessionStorage.getItem("totalItems") && sessionStorage.getItem("itemsPerPage") && sessionStorage.getItem("currentPage")) {
      this.totalItems = parseInt(sessionStorage.getItem('totalItems') || '10');
      this.itemsPerPage = parseInt(sessionStorage.getItem('itemsPerPage') || '10');
      this.currentPage = parseInt(sessionStorage.getItem('currentPage') || '1');
    } else {
      this.categoryService.getCategoryCount().subscribe({
        next: (value) => {
          sessionStorage.setItem("totalItems", value.toString());
          this.totalItems = value;
        }
      });
      sessionStorage.setItem('itemsPerPage', '10');
      sessionStorage.setItem('currentPage', '1');
      this.itemsPerPage = 2;
      this.currentPage = 1;
    }
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  }

  initializeForm() {
    this.categoryForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      imageFilename: ['', [Validators.required]],
      image: []
    });
    this.resultPerPage = this.formBuilder.group({
      itemsPerPage: [this.itemsPerPage]
    })
  }

  onChange($event: any) {
    this.categoryForm.patchValue({
      image: $event.target.files[0]
    });
  }

  addCategory() {
    this.formSubmited = true;
    if(this.categoryForm.valid) {
      console.log(this.categoryForm.value);
      this.categoryService.addCategory(this.categoryForm.value).subscribe({
        next: (response) => {
          console.log(response);
          this.closeModal.nativeElement.click();
          this.initializeGategory();
          this.toastService.show({title: "Categorie adaugata!", message: "Categoria " + this.categoryForm.get('name')?.value + " a fosta adaugata cu succes!", classname: "text-success"});
          this.categoryForm.reset();
          this.categoryForm.clearValidators()
        },
        error: (response) => {
          console.log(response);
          this.errorMessages.pop();
          this.errorMessages.push(response.error);
        }
      })
    } else {
      this.errorMessages.pop();
      this.errorMessages.push("Ambele campuri trebuie obligatoriu completate!");
    }
  }

  deleteCategoyr(id: number) {
    this.categoryService.deleteCategory(id).subscribe({
      next: (response) => {
        this.initializeGategory();
        this.toastService.show({title: "Categorie stersa!", message: "Categoria a fosta stearsa cu succes!", classname: "text-success"});
      },
      error: (response) => {
        console.log(response);
      }
    })
  }

  editCategory() {
    if(this.categoryForm.valid) {
      console.log(this.categoryForm.value);
      const editCategory: CategoryInterface = {
        id: this.categoryID,
        name: this.categoryForm.get('name')?.value,
        imageFilename: this.categoryForm.get('name')?.value.replaceAll("/ ", '').replaceAll(",", '').replaceAll(" ", "-") + '.png',
        categoryNameSearch: this.categoryForm.get('name')?.value.replaceAll("/ ", '').replaceAll(",", '').replaceAll(" ", "-")
      }
      this.categoryService.updateCategory(editCategory).subscribe({
        next: (response) => {
          this.closeModal.nativeElement.click();
          this.initializeGategory();
          this.toastService.show({title: "Categorie editata!", message: "Categoria " + this.categoryForm.get('name')?.value + " a fosta adaugata cu succes!", classname: "text-success"});
          this.categoryForm.reset();
          this.categoryForm.clearValidators()
        },
        error: (response) => {
          console.log(response);
          this.errorMessages.pop();
          this.errorMessages.push(response.error.errors);
        }
      })
    } else {
      
    }
  }

  setCategoryID(id: number) {
    this.categoryID = id;
    this.initializeGategory();
  }

  changePage(page: number) {
    sessionStorage.setItem('currentPage', page.toString());
    this.initializeGategory();
  }

  test() {
    this.itemsPerPage = this.resultPerPage.get('itemsPerPage')?.value;
    sessionStorage.setItem('itemsPerPage', this.itemsPerPage.toString());
    this.initializeGategory();
    this.itemsPerPage = parseInt(sessionStorage.getItem('itemsPerPage') || '10');
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    console.log(this.totalPages);
  }
}
