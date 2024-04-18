import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() totalItems: any;
  @Input() currentPage: any;
  @Input() itemsPerPage: any;
  @Output() onClick: EventEmitter<number> = new EventEmitter();
  totalPages: number = 0;
  pageNumbers: number[] = [];

  constructor() {}

  ngOnInit(): void {
    if(this.totalItems) {
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      this.pageNumbers = Array.from({length: this.totalPages}, (_, i) => i + 1);
    } else {
      this.pageNumbers = [1]
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['itemsPerPage']) {
      this.totalPages = Math.ceil(this.totalItems / changes['itemsPerPage'].currentValue);
      this.pageNumbers = Array.from({length: this.totalPages}, (_, i) => i + 1);
    }
  }

  goToPage(pageNumber: number) {
    this.onClick.emit(pageNumber);
    this.currentPage = pageNumber;
  }

  next(page: number) {
    if(page + 1 <= this.totalPages) {
      this.currentPage = page + 1;
    }
    this.goToPage(this.currentPage);
  }

  previous(page: number) {
    if(page - 1 > 0) {
      this.currentPage = page - 1;
    }
    this.goToPage(this.currentPage);
  }

}
