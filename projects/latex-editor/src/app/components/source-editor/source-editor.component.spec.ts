import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceEditorComponent } from './source-editor.component';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { BehaviorSubject } from 'rxjs';
import { FileBlob } from 'src/app/models/file-blob';

describe('SourceEditorComponent', () => {
  let mockWorkspaceService = { fileBlob$: new BehaviorSubject<FileBlob>({} as FileBlob) };
  
  let component: SourceEditorComponent;
  let fixture: ComponentFixture<SourceEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SourceEditorComponent ],
      providers: [
        { provide: WorkspaceService, useValue: mockWorkspaceService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SourceEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
