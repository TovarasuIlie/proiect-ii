import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2, ViewChild, viewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from '../../../../services/user.service';
import { CategoriesService } from '../../services/categories.service';
import { CategoryInterface } from '../../models/category-interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-all-categories',
  templateUrl: './all-categories.component.html',
  styleUrl: './all-categories.component.css'
})
export class AllCategoriesComponent implements OnInit {

  categories: CategoryInterface[] = [];
  addCategoryForm: FormGroup = new FormGroup({});
  errorMessages: string[] = [];
  @ViewChild('closeModal') closeModal: any;

  constructor(private titleService: Title, private _renderer2: Renderer2, @Inject(DOCUMENT) private _document: Document, public userService: UserService, private categoryService: CategoriesService, private formBuilder: FormBuilder) {
    this.titleService.setTitle("Dashboard - La Verucu' SRL");
  }
  ngOnInit(): void {
    this.initializeGategory();
    this.initializeForm();
  }

  initializeGategory() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;      
      },
    })
  }

  initializeForm() {
    this.addCategoryForm = this.formBuilder.group({
      name: ['', [Validators.required]]
    })
  }

  addCategory() {
    if(this.addCategoryForm.valid) {
      this.categoryService.addCategory(this.addCategoryForm.value).subscribe({
        next: (response) => {
          console.log(response);
          this.closeModal.nativeElement.click();
          this.initializeGategory();
        },
        error: (response) => {
          console.log(response);
        }
      })
    } else {
      this.errorMessages.pop();
      this.errorMessages.push("Test");
    }
  }

  deleteCategoyr(id: string) {
    this.categoryService.deleteCategory(id).subscribe({
      next: (response) => {
        console.log(response);
        this.initializeGategory();
      },
      error: (response) => {
        console.log(response);
      }
    })
  }
}
