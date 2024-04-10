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
  errorMessages: string[] = [];
  @ViewChild('closeModal') closeModal: any;
  categoryID: number = 0;
  formSubmited!: boolean;

  constructor(private titleService: Title, private _renderer2: Renderer2, @Inject(DOCUMENT) private _document: Document, public userService: UserService, private categoryService: CategoriesService, 
              private formBuilder: FormBuilder, private toastService: ToastService) {
    this.titleService.setTitle("Dashboard - La Verucu' SRL");
  }

  ngOnInit(): void {
    this.initializeGategory();
    this.initializeForm();
  }

  ngAfterViewInit() {
    const script = this._renderer2.createElement('script');
    script.src = "/assets/js/index-page.js";
    this._renderer2.appendChild(this._document.body, script);
  }

  initializeGategory() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;      
      },
    })
  }

  initializeForm() {
    this.categoryForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      imageFilename: ['', [Validators.required]],
      image: []
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
  }
}
