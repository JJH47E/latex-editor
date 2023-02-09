import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MacroHelperComponent } from '../macro-helper/macro-helper.component';
import { HelpViewComponent } from '../help-view/help-view.component';
import { MenuBar } from 'src/app/Enums/menu-bar.enum';
import { ToolbarActions } from 'src/app/Enums/toolbar-actions.enum';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { NewWorkspaceComponent } from '../new-workspace/new-workspace.component';
import { ElectronService } from 'ngx-electronyzer';
import { WorkspaceConfig } from 'src/app/models/workspace-config';
import { IpcService } from 'src/app/services/ipc.service';
import { BehaviorSubject, map, Observable } from 'rxjs';

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
    {title: MenuBar.OpenWorkspace, action: () => this.openWorkspace()}
  ];

  public editActions = [
    {title: MenuBar.EditWorkspaceSettings, action: () => {}}
  ];

  public helpActions = [
    {title: MenuBar.About, action: () => {}},
    {title: MenuBar.OpenSourceNotes, action: () => {}},
    {title: MenuBar.Help, action: () => this.openHelp()}
  ];

  public workspaceName$ = new BehaviorSubject<string>('LaTeX Editor');

  constructor(
    public dialog: MatDialog,
    public workspaceService: WorkspaceService,
    private ipcService: IpcService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.ipcService.setupLoadFileHandlers();
    this.workspaceService.workspaceName$.subscribe(name => {
      this.workspaceName$.next(name);
      this.changeDetectorRef.detectChanges();
    });
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
    this.dialog.open(HelpViewComponent, { });
  }

  openNewWorkspace(): void {
    const dialogRef = this.dialog.open(NewWorkspaceComponent, {
      //TODO: adjust for phones etc
      width: '750px',
    });

    dialogRef.afterClosed().subscribe(_ => { });
  }

  openWorkspace(): void {
    this.workspaceService.selectWorkspace();
  }
}
