import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarComponent } from './toolbar.component';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('ToolbarComponent', () => {
  let testWorkspaceName$ = new BehaviorSubject<string>('Test Name');
  let mockWorkspaceService = {
    workspaceName$: testWorkspaceName$,
    selectWorkspace: () => {},
    saveWorkspace: () => {}
  };
  let mockBottomSheet = { open: jasmine.createSpy('open') };
  let mockDialog = { open: jasmine.createSpy('open') };

  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatToolbarModule,
        MatMenuModule
      ],
      declarations: [ ToolbarComponent ],
      providers: [
        { provide: MatDialog, useValue: mockDialog },
        { provide: WorkspaceService, useValue: mockWorkspaceService },
        { provide: MatBottomSheet, useValue: mockBottomSheet }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when workspace name changes', () => {
    const newName = 'New workspace Name!!!!';
    beforeEach(() => {
      testWorkspaceName$.next(newName);
      fixture.detectChanges();
    });

    it('should reflect change in toolbar', () => {
      expect(fixture.debugElement.query(By.css('#workspaceName')).nativeElement.innerHTML).toBe(newName);
    })
  })

  describe('file actions', () => {    
    it('should open dialog when NewWorkspace is clicked', () => {
      component.openNewWorkspace();
      expect(mockDialog.open).toHaveBeenCalledTimes(1);
    });
  });

  describe('help actions', () => {
    it('should open dialog when Help is clicked', () => {
      component.openHelp();
      expect(mockDialog.open).toHaveBeenCalledTimes(1);
    });
  });

  describe('insert actions', () => {
    it(`should open dialog when Macro is clicked`, () => {
      component.openMacroDialog();
      expect(mockDialog.open).toHaveBeenCalledTimes(1);
    });

    it(`should open dialog when Greek Alphabet is clicked`, () => {
      component.openGreekAlphabetDialog();
      expect(mockDialog.open).toHaveBeenCalledTimes(1);
    });

    it(`should open dialog when Delimiters is clicked`, () => {
      component.openDelimitersAlphabetDialog();
      expect(mockDialog.open).toHaveBeenCalledTimes(1);
    });

    it(`should open dialog when Constructs is clicked`, () => {
      component.openConstructsAlphabetDialog();
      expect(mockDialog.open).toHaveBeenCalledTimes(1);
    });

    it(`should open dialog when Accents is clicked`, () => {
      component.openAccentsAlphabetDialog();
      expect(mockDialog.open).toHaveBeenCalledTimes(1);
    });

    it(`should open dialog when Operators is clicked`, () => {
      component.openOperatorAlphabetDialog();
      expect(mockDialog.open).toHaveBeenCalledTimes(1);
    });

    it(`should open dialog when Misc is clicked`, () => {
      component.openMiscAlphabetDialog();
      expect(mockDialog.open).toHaveBeenCalledTimes(1);
    });
  });

  afterEach(() => {
    mockDialog.open.calls.reset();
  });
});
