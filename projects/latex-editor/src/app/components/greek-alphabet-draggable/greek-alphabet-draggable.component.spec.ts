import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GreekAlphabetDraggableComponent } from './greek-alphabet-draggable.component';

describe('GreekAlphabetDraggableComponent', () => {
  let component: GreekAlphabetDraggableComponent;
  let fixture: ComponentFixture<GreekAlphabetDraggableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GreekAlphabetDraggableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GreekAlphabetDraggableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
