import { Component, OnInit } from '@angular/core';
import { MacroModel } from 'src/app/macros/macro.model';

@Component({
  selector: 'app-macro-helper',
  templateUrl: './macro-helper.component.html',
  styleUrls: ['./macro-helper.component.scss']
})
export class MacroHelperComponent implements OnInit {

  public testMacro: MacroModel = {
    name: "Simple Equation",
    template: "{{%c%}} = \\pm\\sqrt{{{%a%}}^2 + {{%b%}}^2}",
    variables: [
      "a",
      "b",
      "c"
    ]
  };

  constructor() { }

  ngOnInit(): void {
  }

}
