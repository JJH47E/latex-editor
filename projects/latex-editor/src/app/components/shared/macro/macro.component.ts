import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { KatexOptions } from 'ng-katex';
import { BehaviorSubject, map, merge, Subject, takeWhile } from 'rxjs';
import { MacroModel } from 'src/app/macros/macro.model';
import { SubMacroComponent } from '../../sub-macro/sub-macro.component';

@Component({
  selector: 'app-macro',
  templateUrl: './macro.component.html',
  styleUrls: ['./macro.component.scss']
})
export class MacroComponent implements OnInit {

  public previewOptions = {throwOnError: false} as KatexOptions;

  public macroModel$ = new BehaviorSubject<MacroModel>({} as MacroModel);
  public currentEquation$ = new Subject<string>();

  public inlineCheckboxControl = new FormControl(false);

  public form = new FormGroup({});
  public variableFormGroup = new FormGroup({});
  public equationTemplate: string = '';
  public equationVariables$ = new BehaviorSubject<string[]>([]);
  public currentVariables: string[] = [];
  public showTemplate: boolean = false;

  @Input()
  public set macro(newMacro: MacroModel) {
    this.macroModel$.next(newMacro);
    this.equationVariables$.next(this.getAllVariables(newMacro.template));
    this.equationTemplate = newMacro.template;
  };

  @Output()
  public equation = new EventEmitter<string>();

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    this.form.addControl('inlineCheckbox', this.inlineCheckboxControl);

    this.equationVariables$.subscribe(vs => {
      this.currentVariables = vs;

      this.variableFormGroup = new FormGroup({});
      vs.forEach(v => {
        this.variableFormGroup.addControl(v,
          new FormControl(v, [Validators.required])
        );
      });
      this.form.addControl('variables', this.variableFormGroup);
    });

    this.macroModel$.subscribe(macro => {
      this.equationTemplate = macro.template;
      var variables = this.getAllVariables(macro.template);
      this.equationVariables$.next(variables);
    });

    this.inlineCheckboxControl.valueChanges.subscribe(_ => {
      this.onEquationUpdate(this.qualifyEquation(this.getTemplateEquation()));
    });

    this.onEquationUpdate(this.qualifyEquation(this.getTemplateEquation()));
  }

  public getVariableControl(controlName: string): FormControl {
    if (this.variableFormGroup.contains(controlName)) {
      return (this.variableFormGroup.controls as any)[controlName];
    }
    throw new Error(`FormGroup does not contain control with name: ${controlName}`);
  }

  public renderEquation(): void {
    if (this.variableFormGroup.invalid) {
      // Emit invalid equation to disable button in parent component
      this.onEquationUpdate('');
      return;
    }

    var newEquation = this.equationTemplate;

    Object.keys(this.variableFormGroup.controls).forEach((controlName: string) => {
      newEquation = newEquation.replaceAll(this.qualifyEquationVariable(controlName), this.getVariableControl(controlName).value);
    });

    this.onEquationUpdate(this.qualifyEquation(newEquation));
    this.currentEquation$.next(newEquation);
  }

  public getTemplateEquation(): string {
    var newEquation = this.equationTemplate;

    this.currentVariables.forEach((controlName: string) => {
      newEquation = newEquation.replaceAll(this.qualifyEquationVariable(controlName), controlName);
    });

    return newEquation;
  }

  public toggleShowTemplate(): void {
    if (!this.showTemplate) {
      console.log(this.equationTemplate);
      const templateControl = new FormControl(this.equationTemplate, [Validators.required]);
      this.form.addControl('template', templateControl);
      templateControl.valueChanges.pipe(takeWhile(() => this.form.contains('template'))).subscribe(newTemplate => {
        if (newTemplate) {
          this.equationVariables$.next(this.getAllVariables(newTemplate));
          this.equationTemplate = newTemplate;
        }
      });
    } else {
      if (this.form.contains('template')) {
        this.form.removeControl('template');
      }
    }
    this.showTemplate = !this.showTemplate;
  }

  public insertVariableTemplate(control: FormControl): void {
    if (!control) {
      throw Error('Unable to find control');
    }
    const dialogRef = this.dialog.open(SubMacroComponent, {
      width: '500px',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(templateValue => {
      if (!templateValue) {
        return;
      }
      control.setValue(control.value + templateValue);
      this.renderEquation();
    });
  }

  public onEquationUpdate(equation: string): void {
    this.equation.emit(equation);
  }

  private getAllVariables(template: string): string[] {
    var next = template.split('{{#');
    var varNames: string[] = [];
    for (var i = 0; i < next.length; i++) {
      if (next[i].includes('#}}')) {
        var nextSplit = next[i].split('#}}');
        if (nextSplit[0] && !varNames.includes(nextSplit[0])) {
          varNames.push(nextSplit[0]);
        }
      }
    }

    return varNames;
  }

  private qualifyEquation = (equation: string) => this.inlineCheckboxControl.value ? `\\(${equation}\\)` : `\\[${equation}\\]`;

  private qualifyEquationVariable = (variableName: string) => `{{#${variableName}#}}`
}
