import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MacroHelperComponent } from '../macro-helper/macro-helper.component';
import { HelpViewComponent } from '../help-view/help-view.component';
import { MenuBar } from 'src/app/Enums/menu-bar.enum';
import { ToolbarActions } from 'src/app/Enums/toolbar-actions.enum';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { NewWorkspaceComponent } from '../new-workspace/new-workspace.component';
import { BehaviorSubject } from 'rxjs';
import { GreekAlphabetDraggableComponent } from '../greek-alphabet-draggable/greek-alphabet-draggable.component';
import { AlphabetDraggableComponent } from '../alphabet-draggable/alphabet-draggable.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { WelcomeComponent } from '../welcome/welcome.component';

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

  // public editActions = [
  //   {title: MenuBar.EditWorkspaceSettings, action: () => this.workspaceService.loadFile('/images/rick.jpg')}
  // ];

  public insertActions = [
    {title: MenuBar.Macro, action: () => this.openMacroDialog()},
    {title: MenuBar.GreekAlphabet, action: () => this.openGreekAlphabetDialog()},
    {title: MenuBar.Delimiters, action: () => this.openDelimitersAlphabetDialog()},
    {title: MenuBar.Constructs, action: () => this.openConstructsAlphabetDialog()},
    {title: MenuBar.Accents, action: () => this.openAccentsAlphabetDialog()},
    {title: MenuBar.Operators, action: () => this.openOperatorAlphabetDialog()},
    {title: MenuBar.Misc, action: () => this.openMiscAlphabetDialog()}
  ]

  public helpActions = [
    //{title: MenuBar.About, action: () => {}},
    //{title: MenuBar.OpenSourceNotes, action: () => {}},
    {title: MenuBar.Help, action: () => this.openHelp()}
  ];

  public workspaceName$ = new BehaviorSubject<string>('LaTeX Editor');

  private greekAlphabetRef: MatDialogRef<GreekAlphabetDraggableComponent, any> | undefined= undefined;
  private operatorAlphabetRef: MatDialogRef<AlphabetDraggableComponent, any> | undefined= undefined;
  private delimterAlphabetRef: MatDialogRef<AlphabetDraggableComponent, any> | undefined= undefined;
  private constructsAlphabetRef: MatDialogRef<AlphabetDraggableComponent, any> | undefined= undefined;
  private accentsAlphabetRef: MatDialogRef<AlphabetDraggableComponent, any> | undefined= undefined;
  private miscAlphabetRef: MatDialogRef<AlphabetDraggableComponent, any> | undefined= undefined;

  constructor(
    public dialog: MatDialog,
    public workspaceService: WorkspaceService,
    private changeDetectorRef: ChangeDetectorRef,
    private bottomSheet: MatBottomSheet
  ) { }

  ngOnInit(): void {
    this.workspaceService.workspaceName$.subscribe(name => {
      this.workspaceName$.next(name);
      this.changeDetectorRef.detectChanges();
    });

    this.bottomSheet.open(WelcomeComponent, {
      disableClose: true
    });
  }

  openMacroDialog(): void {
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
      autoFocus: false,
      width: '500px',
    });
  }

  openNewWorkspace(): void {
    this.dialog.open(NewWorkspaceComponent, {
      //TODO: adjust for phones etc
      width: '750px',
      autoFocus: false
    });
  }

  openWorkspace(): void {
    this.workspaceService.selectWorkspace();
  }

  saveWorkspace(): void {
    this.workspaceService.saveWorkspace();
  }

  openGreekAlphabetDialog(): void {
    if (!!this.greekAlphabetRef) {
      // close current window & open a new one
      this.greekAlphabetRef.close();
    }
    this.greekAlphabetRef = this.dialog.open(GreekAlphabetDraggableComponent, {
      width: '500px',
      autoFocus: false,
      hasBackdrop: false
    });
  }

  private openOperatorAlphabetDialog(): void {
    if (!!this.operatorAlphabetRef) {
      // close current window & open a new one
      this.operatorAlphabetRef.close();
    }
    this.operatorAlphabetRef = this.dialog.open(AlphabetDraggableComponent, {
      width: '500px',
      autoFocus: false,
      hasBackdrop: false,
      data: {fileName: 'operators', headerName: MenuBar.Operators}
    });
  }

  private openDelimitersAlphabetDialog(): void {
    if (!!this.delimterAlphabetRef) {
      // close current window & open a new one
      this.delimterAlphabetRef.close();
    }
    this.delimterAlphabetRef = this.dialog.open(AlphabetDraggableComponent, {
      width: '500px',
      autoFocus: false,
      hasBackdrop: false,
      data: {fileName: 'delimiters', headerName: MenuBar.Delimiters}
    });
  }

  private openConstructsAlphabetDialog(): void {
    if (!!this.constructsAlphabetRef) {
      // close current window & open a new one
      this.constructsAlphabetRef.close();
    }
    this.constructsAlphabetRef = this.dialog.open(AlphabetDraggableComponent, {
      width: '500px',
      autoFocus: false,
      hasBackdrop: false,
      data: {fileName: 'constructs', headerName: MenuBar.Constructs}
    });
  }

  private openAccentsAlphabetDialog(): void {
    if (!!this.accentsAlphabetRef) {
      // close current window & open a new one
      this.accentsAlphabetRef.close();
    }
    this.accentsAlphabetRef = this.dialog.open(AlphabetDraggableComponent, {
      width: '500px',
      autoFocus: false,
      hasBackdrop: false,
      data: {fileName: 'accents', headerName: MenuBar.Accents}
    });
  }

  private openMiscAlphabetDialog(): void {
    if (!!this.miscAlphabetRef) {
      // close current window & open a new one
      this.miscAlphabetRef.close();
    }
    this.miscAlphabetRef = this.dialog.open(AlphabetDraggableComponent, {
      width: '500px',
      autoFocus: false,
      hasBackdrop: false,
      data: {fileName: 'miscellaneous', headerName: MenuBar.Misc}
    });
  }
}
