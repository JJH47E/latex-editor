import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrebuiltAlphabetComponent } from './prebuilt-alphabet.component';

describe('PrebuiltAlphabetComponent', () => {
  let component: PrebuiltAlphabetComponent;
  let fixture: ComponentFixture<PrebuiltAlphabetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrebuiltAlphabetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrebuiltAlphabetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
