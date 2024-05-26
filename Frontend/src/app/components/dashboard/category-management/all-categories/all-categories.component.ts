import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from '../../../../services/user.service';
import { CategoriesService } from '../../services/categories.service';
import { CategoryInterface } from '../../models/category-interface';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../../shared/services/toast.service';
import { PaginateConfig } from '../../../../models/paginate.model';
import { ActivatedRoute, Router } from '@angular/router';
import { EmojiValidator } from '../../../../validators/emoji-input.validator';

@Component({
  selector: 'app-all-categories',
  templateUrl: './all-categories.component.html',
  styleUrl: './all-categories.component.css'
})
export class AllCategoriesComponent implements OnInit {

  categories: CategoryInterface[] = [];
  categoryImage!: File;
  categoryForm: FormGroup = new FormGroup({});
  categoryFormEdit: FormGroup = new FormGroup({});
  resultPerPage: FormGroup = new FormGroup({});
  errorMessages: string[] = [];
  @ViewChild('closeAddModal') closeAddModal: any;
  @ViewChild('closeEditModal') closeEditModal: any;
  @ViewChild('categoryEditImage') categoryEditImage: any; 
  categoryID: number = 0;
  formSubmited!: boolean;
  loading: boolean = true;

  paginatorConfig: PaginateConfig = {
    currentPageName: 'categorii',
    totalItems: 10,
    itemsPerPage: 10,
    currentPage: 1
  }

  pondOptions = {
    class: 'my-filepond',
    multiple: false,
    labelIdle: 'Click or drop image here',
    acceptedFileTypes: 'image/jpeg, image/png, image/jpg',
  }

  constructor(private titleService: Title, private _renderer2: Renderer2, @Inject(DOCUMENT) private _document: Document, public userService: UserService, private categoryService: CategoriesService, 
              private formBuilder: FormBuilder, private toastService: ToastService, private router: ActivatedRoute) {
    this.titleService.setTitle("Vizualizare Categori - La Verucu' SRL");
    this.categoryService.getCategoryCount().subscribe({
      next: (value) => {
        this.paginatorConfig.totalItems = value;
      }
    });
  }

  ngOnInit(): void {
    this.initializePagination();
    this.initializeForm();
    this.initializeGategory();
  }

  ngAfterViewInit() {
    const script = this._renderer2.createElement('script');
    script.src = "/assets/js/index-page.js";
    this._renderer2.appendChild(this._document.body, script);
  }

  initializeGategory() {
    const paginatorConfig = sessionStorage.getItem("paginatorConfig");
    if(paginatorConfig) {
        this.paginatorConfig = JSON.parse(paginatorConfig);
    }
    this.categoryService.getCategoriesPagination(this.paginatorConfig.currentPage, this.paginatorConfig.itemsPerPage).subscribe({
      next: (categories) => {
        this.loading = false;
        this.categories = categories;
      }
    });
  }

  initializePagination() {
    const paginatorConfig = sessionStorage.getItem("paginatorConfig");
    if(paginatorConfig && paginatorConfig.includes(this.router.snapshot.url[0].path)) {
        this.paginatorConfig = JSON.parse(paginatorConfig);
        this.categoryService.getCategoryCount().subscribe({
          next: (value) => {
            this.paginatorConfig.totalItems = value;
          }
        });
    } else {
      this.categoryService.getCategoryCount().subscribe({
        next: (value) => {
          this.paginatorConfig.totalItems = value;
        }
      });
    }
    const totalPages = Math.ceil(this.paginatorConfig.totalItems / this.paginatorConfig.itemsPerPage);
    if(this.paginatorConfig.currentPage > totalPages) {
      this.paginatorConfig.currentPage = totalPages
    }
    sessionStorage.setItem('paginatorConfig', JSON.stringify(this.paginatorConfig));
  }

  initializeForm() {
    this.categoryForm = this.formBuilder.group({
      name: [null, [Validators.required, EmojiValidator.hasEmoji]],
      image: [null, [Validators.required]]
    });
    this.categoryFormEdit = this.formBuilder.group({
      name: [null, [Validators.required, EmojiValidator.hasEmoji]],
      image: []
    });
    this.resultPerPage = this.formBuilder.group({
      itemsPerPage: [this.paginatorConfig.itemsPerPage]
    })
  }

  onChange($event: any) {
    this.categoryForm.patchValue({
      image: $event.file.file
    });
  }

  onChangeEdit($event: any) {
    this.categoryFormEdit.patchValue({
      image: $event.file.file
    });
  }

  onRemove($event: any) {
    this.categoryForm.patchValue({
      image: []
    });
  }

  onRemoveEdit($event: any) {
    this.categoryFormEdit.patchValue({
      image: []
    });
  }

  addCategory() {
    this.formSubmited = true;
    if(this.categoryForm.valid) {
      this.categoryService.addCategory(this.categoryForm.value).subscribe({
        next: (response) => {
          this.closeAddModal.nativeElement.click();
          this.initializeGategory();
          this.initializePagination();
          this.toastService.show({title: "Categorie adaugata!", message: "Categoria " + this.categoryForm.get('name')?.value + " a fost adaugata cu succes!", classname: "text-success"});
          this.categoryForm.reset();
        },
        error: (response) => {
          this.errorMessages.pop();
          this.errorMessages.push(response.error);
        }
      })
    }
  }

  deleteCategory(id: number) {
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
    this.formSubmited = true;
    if(this.categoryFormEdit.valid) {
      this.categoryFormEdit.addControl("id", new FormControl(this.categoryID));
      this.categoryService.updateCategory(this.categoryFormEdit.value).subscribe({
        next: (response) => {
          this.closeEditModal.nativeElement.click();
          this.initializeGategory();
          this.toastService.show({title: "Categorie editata!", message: "Categoria " + this.categoryFormEdit.get('name')?.value + " a fost editata cu succes!", classname: "text-success"});
          this.categoryForm.reset();
          this.categoryForm.clearValidators()
        },
        error: (response) => {
          const message = response.error.error || response.error.errors
          this.errorMessages.pop();
          this.errorMessages.push(message);
        }
      })
    }
  }

  setCategoryID(id: number) {
    if(id != 0) {
      this.categoryID = id;
      this.categoryService.getCategory(this.categoryID).subscribe({
        next: (value) => {
          this.categoryFormEdit.patchValue({name: value.name});
          this.categoryFormEdit.patchValue({id: id});
        }
      });
      this.initializeGategory();
    } else {
      this.categoryForm.patchValue({name: ''});
    }
  }

  changePage(page: number) {
    this.paginatorConfig.currentPage = page;
    sessionStorage.setItem('paginatorConfig', JSON.stringify(this.paginatorConfig));
    this.initializeGategory();
  }


  resultPerPageChange() {
    this.paginatorConfig.itemsPerPage = this.resultPerPage.get('itemsPerPage')?.value;
    sessionStorage.setItem('paginatorConfig', JSON.stringify(this.paginatorConfig));
    const paginatorConfig = sessionStorage.getItem("paginatorConfig");
    if(paginatorConfig) {
      this.paginatorConfig = JSON.parse(paginatorConfig);
    }
    const totalPages = Math.ceil(this.paginatorConfig.totalItems / this.paginatorConfig.itemsPerPage);
    if(this.paginatorConfig.currentPage > totalPages) {
      this.paginatorConfig.currentPage = totalPages
    }
    this.initializeGategory();
  }

  public markControlsUntouched(): void {
    Object.keys(this.categoryForm.controls).forEach((key: string) => {
        const abstractControl = this.categoryForm.controls[key];
        abstractControl.setErrors(null);
    });
  }
}
