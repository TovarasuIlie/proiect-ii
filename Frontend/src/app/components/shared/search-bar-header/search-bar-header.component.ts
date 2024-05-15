import { Component } from '@angular/core';
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
  options: string[] = [];
  keyword!: string;
  isLoading: boolean = false;
  filteredOptions!: string[];

  constructor(private productsService: ProductsService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.productsService.getProducts().subscribe({
      next: (value) => {
        value.forEach((product: ProductsInterface) => {
          this.options.push(product.title || '');
        })
      }
    });
    this.activatedRoute.queryParams.subscribe({
      next: (value) => {
        this.searchFieldControl.setValue(value['keyword'] || '')
      }
    });
  }

  filtering(e: KeyboardEvent) {
    let value = this.searchFieldControl.value;
    this.test(e, value || '');
    console.log(e);
    this.isLoading = true;
    setTimeout(() => {
      this.filteredOptions = value ? this.filter(value) : this.options.slice();
      this.isLoading = false;
    }, 1000);
  }

  test(e: KeyboardEvent, keyword: string) {
    if(e.code === 'Enter') {
      this.searchProductsByName(keyword)
    }
  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  searchProductsByName(keyword: string) {
    const navigateExtra: NavigationExtras = {
      queryParams: { 'keyword': keyword }
    };
    this.router.navigate(['/cauta'], navigateExtra);
  }
}
