import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { MacroModel } from 'src/app/macros/macro.model';

@Component({
  selector: 'app-macro',
  templateUrl: './macro.component.html',
  styleUrls: ['./macro.component.scss']
})
export class MacroComponent implements OnInit {

  public macroModel$ = new BehaviorSubject<MacroModel>({} as MacroModel);
  public currentEquation$ = new Subject<string>();

  public variableFormGroup = new FormGroup({});
  public equationTemplate: string = '';
  public equationVariables: string[] = [];

  @Input()
  public set macro(newMacro: MacroModel) {
    this.macroModel$.next(newMacro);
    this.equationVariables = newMacro.variables;
    this.equationTemplate = newMacro.template;
  };

  constructor() { }

  ngOnInit(): void {
    this.macroModel$.subscribe(macro => {
      this.equationTemplate = macro.template;
      this.equationVariables = macro.variables;
      this.variableFormGroup = new FormGroup({});
      macro.variables.forEach(v => {
        this.variableFormGroup.addControl(v,
          new FormControl(v, [Validators.required])
        );
      });
    });
  }

  public getVariableControl(controlName: string): FormControl {
    if (this.variableFormGroup.contains(controlName)) {
      return (this.variableFormGroup.controls as any)[controlName];
    }
    throw new Error(`FormGroup does not contain variable with name: ${controlName}`);
  }

  public renderEquation(): void {
    if (this.variableFormGroup.invalid) {
      return;
    }

    var newEquation = this.equationTemplate;

    Object.keys(this.variableFormGroup.controls).forEach((controlName: string) => {
      newEquation = newEquation.replace(this.qualifyEquationVariable(controlName), this.getVariableControl(controlName).value);
    });

    this.currentEquation$.next(newEquation);
  }

  public getTemplateEquation(): string {
    var newEquation = this.equationTemplate;

    this.equationVariables.forEach((controlName: string) => {
      newEquation = newEquation.replace(this.qualifyEquationVariable(controlName), controlName);
    });

    return newEquation;
  }

  private qualifyEquationVariable = (variableName: string) => `{{%${variableName}%}}`
}
