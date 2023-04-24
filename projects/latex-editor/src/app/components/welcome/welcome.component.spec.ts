import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeComponent } from './welcome.component';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { BehaviorSubject } from 'rxjs';

describe('WelcomeComponent', () => {
  let mockWorkspaceService = {
    filePath$: new BehaviorSubject<string>('')
  };

  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WelcomeComponent ],
      providers: [
        { provide: WorkspaceService, useValue: mockWorkspaceService },
        { provide: MatDialog, useValue: {} },
        { provide: MatBottomSheetRef, useValue: {} }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
