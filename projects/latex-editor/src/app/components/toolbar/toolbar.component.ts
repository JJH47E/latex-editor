import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MacroHelperComponent } from '../macro-helper/macro-helper.component';
import { HelpViewComponent } from '../help-view/help-view.component';
import { MenuBar } from 'src/app/Enums/menu-bar.enum';
import { ToolbarActions } from 'src/app/Enums/toolbar-actions.enum';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { NewWorkspaceComponent } from '../new-workspace/new-workspace.component';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  public ToolbarActions = ToolbarActions;
  public fileActions = [
    {title: MenuBar.NewWorkspace, action: () => this.openNewWorkspace()},
    {title: MenuBar.SaveWorkspace, action: () => this.saveWorkspace()},
    {title: MenuBar.OpenWorkspace, action: () => this.openWorkspace()}
  ];

  public editActions = [
    {title: MenuBar.EditWorkspaceSettings, action: () => {this.workspaceService.loadFile('/images/rick.jpg')}}
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
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.workspaceService.workspaceName$.subscribe(name => {
      this.workspaceName$.next(name);
      this.changeDetectorRef.detectChanges();
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(MacroHelperComponent, {
      width: '750px',
      maxHeight: '90%',
      height: 'auto',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(_ => { });
  }

  openHelp(): void {
    this.dialog.open(HelpViewComponent, {
      autoFocus: false
    });
  }

  openNewWorkspace(): void {
    const dialogRef = this.dialog.open(NewWorkspaceComponent, {
      //TODO: adjust for phones etc
      width: '750px',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(_ => { });
  }

  openWorkspace(): void {
    this.workspaceService.selectWorkspace();
  }

  saveWorkspace(): void {
    this.workspaceService.saveWorkspace();
  }
}
