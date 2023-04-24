import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MacroHelperComponent } from './macro-helper.component';
import { AssetService } from 'src/app/services/asset.service';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';

describe('MacroHelperComponent', () => {
  let mockWorkspaceService = {};
  let mockAssetService = {
    getJsonData: (_: string) => new BehaviorSubject<string>('')
  };
  
  let component: MacroHelperComponent;
  let fixture: ComponentFixture<MacroHelperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MacroHelperComponent ],
      providers: [
        { provide: WorkspaceService, useValue: mockWorkspaceService },
        { provide: AssetService, useValue: mockAssetService },
        { provide: MatDialogRef, useValue: {} }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MacroHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
