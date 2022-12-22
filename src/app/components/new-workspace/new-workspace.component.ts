import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WorkspaceApiService } from 'src/app/services/workspace-api.service';

@Component({
  selector: 'app-new-workspace',
  templateUrl: './new-workspace.component.html',
  styleUrls: ['./new-workspace.component.scss']
})
export class NewWorkspaceComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<NewWorkspaceComponent>,
    private matSnackbar: MatSnackBar,
    private workspaceApiService: WorkspaceApiService
    ) { }

  public workspaceName = new FormControl('', [
    Validators.required,
    Validators.maxLength(30)
  ]) 

  public form = new FormGroup({
    workspaceName: this.workspaceName
  });

  ngOnInit(): void {
  }

  public createWorkspace() {
    if (this.form.invalid) {
      return;
    }

    //TODO: tidy this up
    const name = this.form.get('workspaceName')?.value!;
    this.workspaceApiService.createWorkspace(name).subscribe({
      next: response => {
        this.dialogRef.close(response);
      },
      error: _ => {
        this.matSnackbar.open('Unable to create workspace', 'OK', {duration: 5000});
      }
    });
  }
}
