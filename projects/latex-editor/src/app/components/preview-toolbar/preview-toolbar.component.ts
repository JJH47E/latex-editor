import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { WorkspaceService } from 'src/app/services/workspace.service';

@Component({
  selector: 'app-preview-toolbar',
  templateUrl: './preview-toolbar.component.html',
  styleUrls: ['./preview-toolbar.component.scss']
})
export class PreviewToolbarComponent implements OnInit {

  @Output()
  public fitToScreenEmitter = new EventEmitter<boolean>();

  @Output()
  public zoomInEmitter = new EventEmitter<boolean>();

  @Output()
  public zoomOutEmitter = new EventEmitter<boolean>();

  constructor(private workspaceService: WorkspaceService) { }

  ngOnInit(): void {
  }

  public reloadPreview(): void {
    this.workspaceService.reloadPreview();
  }

  public downloadPdf(): void {
    this.workspaceService.downloadPdf();
  }

  public fitToScreen(): void {
    this.fitToScreenEmitter.emit(true);
  }

  public zoomIn(): void {
    this.zoomInEmitter.emit(true);
  }

  public zoomOut(): void {
    this.zoomOutEmitter.emit(true);
  }

  public moreClicked(): void {}
}
