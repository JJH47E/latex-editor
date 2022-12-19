import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { MacroHelperComponent } from '../macro-helper/macro-helper.component';
import { HelpViewComponent } from '../help-view/help-view.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Input()
  public documentName$!: Observable<string>;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(MacroHelperComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(_ => { });
  }

  openHelp(): void {
    const dialogRef = this.dialog.open(HelpViewComponent, { });

    dialogRef.afterClosed().subscribe(_ => { });
  }
}
