import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { map } from 'rxjs';
import { WorkspaceService } from 'src/app/services/workspace.service';

@Component({
  selector: 'app-source-editor',
  templateUrl: './source-editor.component.html',
  styleUrls: ['./source-editor.component.scss']
})
export class SourceEditorComponent implements OnInit {
  thumbnail: any;
  useImagePreview = false;

  constructor(
    private workspaceService: WorkspaceService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.workspaceService.fileBlob$
      .subscribe(blob => {
        const objectURL = URL.createObjectURL(new Blob([blob.data.buffer], { type: blob.contentType }));
        const img = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        this.thumbnail = img;
      });
  }

}
