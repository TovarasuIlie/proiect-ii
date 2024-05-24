import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { ProductsService } from '../../dashboard/services/products.service';
import { ProductsInterface } from '../../dashboard/models/products.model';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-search-bar-header',
  templateUrl: './search-bar-header.component.html',
  styleUrl: './search-bar-header.component.css'
})
export class SearchBarHeaderComponent {
  searchFieldControl = new FormControl('');
  @ViewChild('searchBar') searchBar: any;
  keyword!: string;
  isLoading: boolean = false;
  filteredOptions: string[] = [];

  constructor(private productsService: ProductsService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe({
      next: (value) => {
        this.searchFieldControl.setValue(value['keyword'] || '')
      }
    });
  }

  filtering(e: KeyboardEvent, string: string) {
    this.enterPressed(e, string);
    if(e.key.length == 1 || e.code === 'Backspace') {
      if(string !== '') {
        this.isLoading = true;
        setTimeout(() => {
          this.productsService.getProductsByName(string).subscribe({
            next: (value) => {
              this.filteredOptions = [];
              value.forEach((product: ProductsInterface) => {
                this.filteredOptions.push(product.title || '');
              })
            }
          });
          this.isLoading = false;
        }, 1000);
      } else {
        this.filteredOptions = [];
      }
    }
  }

  enterPressed(e: KeyboardEvent, keyword: string) {
    if(e.code === 'Enter') {
      e.preventDefault();
      this.searchProductsByName(keyword);
      this.filteredOptions = [];
    }
  }

  searchProductsByName(keyword: string) {
    if(this.filteredOptions.length > 0) {
      const navigateExtra: NavigationExtras = {
        queryParams: { 'keyword': keyword }
      };
      this.router.navigate(['/cauta'], navigateExtra).then(() => {
        window.location.reload();
      });;
      this.searchBar.nativeElement.blur();
    }
  }

  focus(value: string) {
    this.isLoading = true;
    setTimeout(() => {
      this.productsService.getProductsByName(value).subscribe({
        next: (value) => {
          this.filteredOptions = [];
          value.forEach((product: ProductsInterface) => {
            this.filteredOptions.push(product.title || '');
          })
        }
      });
      this.isLoading = false;
    }, 1000);
  }
}
