import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MacroModel } from 'src/app/macros/macro.model';
import { WorkspaceService } from 'src/app/services/workspace.service';

@Component({
  selector: 'app-macro-helper',
  templateUrl: './macro-helper.component.html',
  styleUrls: ['./macro-helper.component.scss']
})
export class MacroHelperComponent implements OnInit {

  public testList: MacroModel[] = [{
    name: "Mass-energy equivalence",
    template: "{{#E#}}={{#m#}}{{#c#}}^2",
  },
  {
    name: "Pythagorean theorem",
    template: "{{#x#}}^2 + {{#y#}}^2 = {{#z#}}^2",
  }];

  public isMacroSelected = false;
  public selectedMacro: MacroModel | null = null;
  public currentEquation: string = '';

  constructor(
    private worksapceService: WorkspaceService,
    private dialogRef: MatDialogRef<MacroHelperComponent>
  ) { }

  ngOnInit(): void {
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
