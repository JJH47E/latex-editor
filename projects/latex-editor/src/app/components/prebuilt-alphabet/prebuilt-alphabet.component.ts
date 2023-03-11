import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { VariableTemplate } from 'src/app/models/variable-template.model';
import templates from '../../../assets/prebuilt-constructs.json';

@Component({
  selector: 'app-prebuilt-alphabet',
  templateUrl: './prebuilt-alphabet.component.html',
  styleUrls: ['./prebuilt-alphabet.component.scss']
})
export class PrebuiltAlphabetComponent implements OnInit {

  @Output()
  public toInsertEmitter = new EventEmitter<string>();

  public templateList: VariableTemplate[] = templates;
  
  constructor() { }

  ngOnInit(): void {
  }

  public insertTemplate(template: VariableTemplate): void {
    this.toInsertEmitter.emit(template.template);
  }

}
