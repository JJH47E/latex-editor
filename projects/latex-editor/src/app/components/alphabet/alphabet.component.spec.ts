import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphabetComponent } from './alphabet.component';

describe('OperatorAlphabetComponent', () => {
  let component: AlphabetComponent;
  let fixture: ComponentFixture<AlphabetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlphabetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphabetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
