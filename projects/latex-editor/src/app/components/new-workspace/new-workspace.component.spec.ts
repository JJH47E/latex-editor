import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewWorkspaceComponent } from './new-workspace.component';
import { MatDialogRef } from '@angular/material/dialog';
import { WorkspaceService } from 'src/app/services/workspace.service';

describe('NewWorkspaceComponent', () => {
  let mockWorkspaceService = {};
  
  let component: NewWorkspaceComponent;
  let fixture: ComponentFixture<NewWorkspaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewWorkspaceComponent ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: WorkspaceService, useValue: mockWorkspaceService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
