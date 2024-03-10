import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiresPageComponent } from './tires-page.component';

describe('TiresPageComponent', () => {
  let component: TiresPageComponent;
  let fixture: ComponentFixture<TiresPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TiresPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TiresPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
