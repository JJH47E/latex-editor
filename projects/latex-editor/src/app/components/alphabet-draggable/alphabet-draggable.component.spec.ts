import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphabetDraggableComponent } from './alphabet-draggable.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WorkspaceService } from 'src/app/services/workspace.service';

describe('OperatorAlphabetDraggableComponent', () => {
  let mockWorkspaceService = {};
  
  let component: AlphabetDraggableComponent;
  let fixture: ComponentFixture<AlphabetDraggableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlphabetDraggableComponent ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: WorkspaceService, useValue: mockWorkspaceService }
      ]
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
