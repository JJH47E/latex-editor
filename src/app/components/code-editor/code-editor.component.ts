import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { WorkspaceService } from 'src/app/services/workspace.service';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss']
})
export class CodeEditorComponent implements OnInit {
  public options = {
    theme: 'vs-dark'
  };

  constructor(
    private workspaceService: WorkspaceService,
    private matSnackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.workspaceService.getWorkspaceId().subscribe({
      next: id => {
        //TODO: load content of main.tex into codeModel$
      },
      error: err => {
        this.matSnackBar.open('Unable to create new workspace');
      }
    })
  }

}
