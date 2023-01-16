import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WorkspaceService } from 'src/app/services/workspace.service';

@Component({
  selector: 'app-new-workspace',
  templateUrl: './new-workspace.component.html',
  styleUrls: ['./new-workspace.component.scss']
})
export class NewWorkspaceComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<NewWorkspaceComponent>,
    private workspaceService: WorkspaceService
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

  public async createWorkspace() {
    if (this.form.invalid) {
      return;
    }

    //TODO: tidy this up
    const name = this.form.get('workspaceName')?.value!;
    await this.workspaceService.createWorkspace(name)
      .then(response => this.dialogRef.close(response));
  }
}
