import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphabetDraggableComponent } from './alphabet-draggable.component';

describe('OperatorAlphabetDraggableComponent', () => {
  let component: AlphabetDraggableComponent;
  let fixture: ComponentFixture<AlphabetDraggableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlphabetDraggableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphabetDraggableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
