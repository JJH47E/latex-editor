import { Component, OnInit } from '@angular/core';
import { CodeModel } from '@ngstack/code-editor';
import { of } from 'rxjs';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss']
})
export class CodeEditorComponent implements OnInit {
  public codeModel$ = of({language: 'tex', value: 'test'} as CodeModel);

  constructor() { }

  ngOnInit(): void {
  }

}
