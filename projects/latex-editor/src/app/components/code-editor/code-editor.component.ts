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

  ngOnInit(): void { }
}
