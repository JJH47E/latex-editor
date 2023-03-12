import { Component, Input, OnInit } from '@angular/core';
import { KatexOptions } from 'ng-katex';
import { VariableTemplate } from 'src/app/models/variable-template.model';

@Component({
  selector: 'app-variable-template-option',
  templateUrl: './variable-template-option.component.html',
  styleUrls: ['./variable-template-option.component.scss']
})
export class VariableTemplateOptionComponent implements OnInit {

  public previewOptions = {throwOnError: false} as KatexOptions;

  @Input()
  public option: VariableTemplate = {} as VariableTemplate;

  constructor() { }

  ngOnInit(): void {
  }

  public cleanInput(template: VariableTemplate): VariableTemplate {
    let newTemplate = {...template} as VariableTemplate;
    newTemplate.template = newTemplate.template.replaceAll('{{#', '');
    newTemplate.template = newTemplate.template.replaceAll('#}}', '');
    return newTemplate;
  }

}
