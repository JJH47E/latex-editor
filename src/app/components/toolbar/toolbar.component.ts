import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { MacroHelperComponent } from '../macro-helper/macro-helper.component';
import { HelpViewComponent } from '../help-view/help-view.component';
import { MenuBar } from 'src/app/Enums/menu-bar.enum';
import { ToolbarActions } from 'src/app/Enums/toolbar-actions.enum';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { NewWorkspaceComponent } from '../new-workspace/new-workspace.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  public ToolbarActions = ToolbarActions;
  public fileActions = [
    {title: MenuBar.NewWorkspace, action: () => this.openNewWorkspace()},
    {title: MenuBar.SaveWorkspace, action: () => {}},
    {title: MenuBar.OpenWorkspace, action: () => {}}
  ];

  public editActions = [
    {title: MenuBar.EditWorkspaceSettings, action: () => {}}
  ];

  public helpActions = [
    {title: MenuBar.About, action: () => {}},
    {title: MenuBar.OpenSourceNotes, action: () => {}},
    {title: MenuBar.Help, action: () => this.openHelp()}
  ];

  public workspaceName$ = this.workspaceService.getWorkspaceName();

  constructor(public dialog: MatDialog, public workspaceService: WorkspaceService) { }

  ngOnInit(): void {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(MacroHelperComponent, {
      width: '750px',
      maxHeight: '90%',
      height: 'auto'
    });

    dialogRef.afterClosed().subscribe(_ => { });
  }

  openHelp(): void {
    const dialogRef = this.dialog.open(HelpViewComponent, { });

    dialogRef.afterClosed().subscribe(_ => { });
  }

  openNewWorkspace(): void {
    const dialogRef = this.dialog.open(NewWorkspaceComponent, {
      //TODO: adjust for phones etc
      width: '750px',
    });

    dialogRef.afterClosed().subscribe(_ => { });
  }
}
