import { Component, OnInit } from '@angular/core';
import { WorkspaceService } from 'src/app/services/workspace.service';

@Component({
  selector: 'app-preview-toolbar',
  templateUrl: './preview-toolbar.component.html',
  styleUrls: ['./preview-toolbar.component.scss']
})
export class PreviewToolbarComponent implements OnInit {

  constructor(private workspaceService: WorkspaceService) { }

  ngOnInit(): void {
  }

  public reloadPreview(): void {
    this.workspaceService.reloadPreview();
  }

  public downloadPdf(): void {
    this.workspaceService.downloadPdf();
  }

  public moreClicked(): void {}
}
