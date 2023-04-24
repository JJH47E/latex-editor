import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileTreeComponent } from './file-tree.component';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { BehaviorSubject } from 'rxjs';

describe('FileTreeComponent', () => {
  let mockWorkspaceService = {
    workspaceFiles$: new BehaviorSubject<string[]>([]),
    filePath$: new BehaviorSubject<string>('')
  };
  
  let component: FileTreeComponent;
  let fixture: ComponentFixture<FileTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileTreeComponent ],
      providers: [
        {
          provide: WorkspaceService, useValue: mockWorkspaceService
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
