import { Component, OnInit } from '@angular/core';
import { MacroModel } from 'src/app/macros/macro.model';

@Component({
  selector: 'app-macro-helper',
  templateUrl: './macro-helper.component.html',
  styleUrls: ['./macro-helper.component.scss']
})
export class MacroHelperComponent implements OnInit {

  public testList: MacroModel[] = [{
    name: "Simple Equation",
    template: "{{#c#}} = \\pm\\sqrt{{{#a#}}^2 + {{#b#}}^2}",
  },
  {
    name: "Second Simple Equation",
    template: "{{#x#}}^{{#n#}} + {{#y#}}^{{#n#}} = {{#z#}}^{{#n#}}",//! multiple variables needs to be fixed!
  }];

  public isMacroSelected = false;
  public selectedMacro: MacroModel | null = null;

  constructor() { }

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

}
