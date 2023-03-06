import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { VariableTemplate } from 'src/app/models/variable-template.model';

@Component({
  selector: 'app-sub-macro',
  templateUrl: './sub-macro.component.html',
  styleUrls: ['./sub-macro.component.scss']
})
export class SubMacroComponent implements OnInit {
  public templates = [
    { 
      name: 'Bra',
      template: '\\langle\\phi|'
    },
    { 
      name: 'Ket',
      template: '|\\varphi\\rangle'
    },
    {
      name: 'Bra-ket',
      template: '\\langle\\phi|\\varphi\\rangle'
    }
  ];

  constructor(
    public dialogRef: MatDialogRef<SubMacroComponent>
  ) { }

  ngOnInit(): void {
  }

  public closeDialog(template: VariableTemplate) {
    if (!template) {
      this.dialogRef.close();
    }
    this.dialogRef.close(template.template);
  }
}
