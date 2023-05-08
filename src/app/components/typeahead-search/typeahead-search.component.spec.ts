import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeaheadSearchComponent } from './typeahead-search.component';

describe('TypeaheadSearchComponent', () => {
  let component: TypeaheadSearchComponent;
  let fixture: ComponentFixture<TypeaheadSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeaheadSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeaheadSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
