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
  useImagePreview = false;//TODO: make this functional (MIME types?)

  constructor(
    private workspaceService: WorkspaceService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.workspaceService.fileBlob$
      .pipe(map(fileBlob => fileBlob.data))
      .subscribe(blob => {
        const objectURL = URL.createObjectURL(blob);
        const img = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        this.thumbnail = img;
      });
  }

}
