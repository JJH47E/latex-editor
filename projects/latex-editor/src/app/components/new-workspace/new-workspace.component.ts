import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TeXTemplate } from 'src/app/models/tex-template.model';
import { WorkspaceService } from 'src/app/services/workspace.service';
import templateData from '../../../assets/templates.json';

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

  public workspaceNameControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(30)
  ]);

  public workspaceTemplateControl = new FormControl('', [ ]);

  public form = new FormGroup({
    workspaceName: this.workspaceNameControl,
    workspaceTemplate: this.workspaceTemplateControl
  });

  public dataToDisplay: TeXTemplate[] = templateData;

  ngOnInit(): void {
    console.log('templates:');
    console.log(this.dataToDisplay);
  }

  public async createWorkspace() {
    if (this.form.invalid) {
      return;
    }

    //TODO: tidy this up
    const name = this.form.get('workspaceName')?.value!;
    const template = this.form.get('workspaceTemplate')?.value!;
    await this.workspaceService.createWorkspace(name, template)
      .then(response => this.dialogRef.close(response));
  }
}
