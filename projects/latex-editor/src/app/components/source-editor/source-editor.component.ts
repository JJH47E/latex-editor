import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject, Observable } from 'rxjs';
import { FileBlob } from 'src/app/models/file-blob';
import { WorkspaceService } from 'src/app/services/workspace.service';

@Component({
  selector: 'app-source-editor',
  templateUrl: './source-editor.component.html',
  styleUrls: ['./source-editor.component.scss']
})
export class SourceEditorComponent implements OnInit {
  public useImagePreview$ = new BehaviorSubject<boolean>(false);
  public fileBlob$: Observable<FileBlob>;

  constructor(
    private workspaceService: WorkspaceService
  ) {
    this.fileBlob$ = this.workspaceService.fileBlob$;
  }

  ngOnInit(): void {
    this.workspaceService.fileBlob$
      .subscribe(blob => {
        this.useImagePreview$.next(blob.contentType.startsWith('image'));
      });
  }

}
