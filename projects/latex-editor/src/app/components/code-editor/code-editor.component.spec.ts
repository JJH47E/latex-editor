import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeEditorComponent } from './code-editor.component';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { BehaviorSubject } from 'rxjs';
import { FileBlob } from 'src/app/models/file-blob';

describe('CodeEditorComponent', () => {
  let mockWorkspaceService = {
    filePath$: new BehaviorSubject<string>(''),
    fileBlob$: new BehaviorSubject<FileBlob>({} as FileBlob),
    toInsert$: new BehaviorSubject<string>('')
  };
  
  let component: CodeEditorComponent;
  let fixture: ComponentFixture<CodeEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodeEditorComponent ],
      providers: [
        {
          provide: WorkspaceService, useValue: mockWorkspaceService
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
