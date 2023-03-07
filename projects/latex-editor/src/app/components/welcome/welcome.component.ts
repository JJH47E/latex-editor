import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { NewWorkspaceComponent } from '../new-workspace/new-workspace.component';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  constructor(
    private workspaceService: WorkspaceService,
    private dialog: MatDialog,
    private bottomSheetRef: MatBottomSheetRef<WelcomeComponent>
  ) { }

  ngOnInit(): void {
    this.workspaceService.filePath$.pipe(filter(x => !!x)).subscribe(_ => {
      this.bottomSheetRef.dismiss();
    });
  }

  public newWorkspace() {
    this.dialog.open(NewWorkspaceComponent, {
      width: '750px',
      autoFocus: false
    });
  }

  public openWorkspace() {
    this.workspaceService.selectWorkspace();
  }

}
