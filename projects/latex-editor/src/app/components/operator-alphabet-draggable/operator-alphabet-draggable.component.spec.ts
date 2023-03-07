import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorAlphabetDraggableComponent } from './operator-alphabet-draggable.component';

describe('OperatorAlphabetDraggableComponent', () => {
  let component: OperatorAlphabetDraggableComponent;
  let fixture: ComponentFixture<OperatorAlphabetDraggableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperatorAlphabetDraggableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperatorAlphabetDraggableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
