import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewToolbarComponent } from './preview-toolbar.component';
import { WorkspaceService } from 'src/app/services/workspace.service';

describe('PreviewToolbarComponent', () => {
  let mockWorkspaceService = {};
  
  let component: PreviewToolbarComponent;
  let fixture: ComponentFixture<PreviewToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewToolbarComponent ],
      providers: [
        { provide: WorkspaceService, useValue: mockWorkspaceService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
