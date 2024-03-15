import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexPagaComponent } from './index-page.component';

describe('IndexPagaComponent', () => {
  let component: IndexPagaComponent;
  let fixture: ComponentFixture<IndexPagaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndexPagaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IndexPagaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
