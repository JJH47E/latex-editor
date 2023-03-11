import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { filter } from 'rxjs';
import { WorkspaceService } from 'src/app/services/workspace.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit, AfterViewInit {

  public pdfSrc: string = '';
  public zoom = 1;

  @ViewChild(PdfViewerComponent)
  pdfViewerComponent: PdfViewerComponent | undefined;

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
  
  ngAfterViewInit(): void { }

  public fitToScreen(): void {
    // TODO: Find a better way of achieving this
    if (!this.pdfViewerComponent) {
      console.log('PDF Viewer component not loaded, unable to reset zoom');
      return;
    }
    this.zoom = 1;
    this.pdfViewerComponent.updateSize();
    this.changeDetectorRef.detectChanges();
  }

  public zoomIn() {
    this.zoom += 0.1;
    this.changeDetectorRef.detectChanges();
  }

  public zoomOut() {
    this.zoom -= 0.1;
    this.changeDetectorRef.detectChanges();
  }
}
