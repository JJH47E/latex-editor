import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { MacroModel } from 'src/app/macros/macro.model';
import { AssetService } from 'src/app/services/asset.service';
import { WorkspaceService } from 'src/app/services/workspace.service';

@Component({
  selector: 'app-macro-helper',
  templateUrl: './macro-helper.component.html',
  styleUrls: ['./macro-helper.component.scss']
})
export class MacroHelperComponent implements OnInit {

  public equationList$ = new BehaviorSubject<MacroModel[]>([]);

  public isMacroSelected = false;
  public selectedMacro: MacroModel | null = null;
  public currentEquation: string = '';

  constructor(
    private worksapceService: WorkspaceService,
    private assetService: AssetService,
    private dialogRef: MatDialogRef<MacroHelperComponent>
  ) { }

  ngOnInit(): void {
    this.assetService.getJsonData<MacroModel>('equation-template').subscribe(templates => {
      this.equationList$.next(templates);
    });
  }

  public selectMacro(macro: MacroModel): void {
    this.selectedMacro = macro;
    this.isMacroSelected = true;
  }

  public unselectMacro(): void {
    this.isMacroSelected = false;
    this.selectedMacro = null;
  }

  public equationToInsert(equation: string): void {
    this.currentEquation = equation;
  }

  public insertAndCloseDialog(): void {
    this.worksapceService.insertString(this.currentEquation);
    this.dialogRef.close();
  }

}
