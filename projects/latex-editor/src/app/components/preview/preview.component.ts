import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { filter } from 'rxjs';
import { WorkspaceService } from 'src/app/services/workspace.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {

  public pdfSrc: string = 'assets/test.pdf';

  constructor(
    private workspaceService: WorkspaceService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.workspaceService.previewPdfBlob$.pipe(filter(x => !!x)).subscribe(fileBlob => {
      console.log('loading new pdf');
      const blob = new Blob([fileBlob.data], { type: fileBlob.contentType });
      this.pdfSrc = URL.createObjectURL(blob);
      this.changeDetectorRef.detectChanges();
    });
  }
}
