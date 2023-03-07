import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorAlphabetComponent } from './operator-alphabet.component';

describe('OperatorAlphabetComponent', () => {
  let component: OperatorAlphabetComponent;
  let fixture: ComponentFixture<OperatorAlphabetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperatorAlphabetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperatorAlphabetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
