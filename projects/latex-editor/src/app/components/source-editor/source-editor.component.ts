import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { FileBlob } from 'src/app/models/file-blob';
import { WorkspaceService } from 'src/app/services/workspace.service';

@Component({
  selector: 'app-source-editor',
  templateUrl: './source-editor.component.html',
  styleUrls: ['./source-editor.component.scss']
})
export class SourceEditorComponent implements OnInit {
  public useImagePreview$ = new BehaviorSubject<boolean>(false);
  public fileBlob$ = new BehaviorSubject<FileBlob>({} as FileBlob);

  constructor(
    private workspaceService: WorkspaceService,
    private changeDetecterRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.workspaceService.fileBlob$.pipe(filter(x => !!x))
      .subscribe(blob => {
        console.log('blob loaded');
        this.useImagePreview$.next(!!blob.contentType ? blob.contentType.startsWith('image') : false);
        this.fileBlob$.next(blob);
        this.changeDetecterRef.detectChanges();
      });
  }

}
