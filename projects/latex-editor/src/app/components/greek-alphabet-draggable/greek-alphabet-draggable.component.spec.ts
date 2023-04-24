import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GreekAlphabetDraggableComponent } from './greek-alphabet-draggable.component';
import { WorkspaceService } from 'src/app/services/workspace.service';

describe('GreekAlphabetDraggableComponent', () => {
  let mockWorkspaceService = {};

  let component: GreekAlphabetDraggableComponent;
  let fixture: ComponentFixture<GreekAlphabetDraggableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GreekAlphabetDraggableComponent ],
      providers: [
        { provide: WorkspaceService, useValue: mockWorkspaceService }
      ]
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
