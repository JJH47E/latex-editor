import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { EquationSections } from 'src/app/Enums/equation-sections.enum';
import { JsonMapping } from 'src/app/Enums/json-mapping.enum';

@Component({
  selector: 'app-sub-macro',
  templateUrl: './sub-macro.component.html',
  styleUrls: ['./sub-macro.component.scss']
})
export class SubMacroComponent implements OnInit {

  public sections = [
    EquationSections.Prebuilt,
    EquationSections.Greek,
    EquationSections.Operators,
    EquationSections.Delimiters,
    EquationSections.Constructs,
    EquationSections.Accents,
    EquationSections.Misc,
  ];

  public JsonMapping = JsonMapping;
  public EquationSections = EquationSections;

  public selectedOption$ = new BehaviorSubject<JsonMapping | undefined>(undefined);
  public selectedOptionString$ = new Observable<string>();

  constructor(
    public dialogRef: MatDialogRef<SubMacroComponent>
  ) { }

  ngOnInit(): void {
    this.selectedOptionString$ = this.selectedOption$.pipe(map(x => {
      if (!x) {
        return '';
      } else {
        return x.toString()
      }
    }));
  }

  public openSection(section: EquationSections): void {
    this.selectedOption$.next(this.convertToJsonMapping(section));
  }

  public resetSelection(): void {
    this.selectedOption$.next(undefined);
  }

  public closeDialog(template: string): void {
    if (!template) {
      this.dialogRef.close();
    }
    this.dialogRef.close(template);
  }

  private convertToJsonMapping(section: EquationSections): JsonMapping {
    switch (section) {
      case EquationSections.Accents:
        return JsonMapping.Accents;
      case EquationSections.Constructs:
        return JsonMapping.Constructs;
      case EquationSections.Delimiters:
        return JsonMapping.Delimiters;
      case EquationSections.Greek:
        return JsonMapping.Greek;
      case EquationSections.Misc:
        return JsonMapping.Misc;
      case EquationSections.Operators:
        return JsonMapping.Operators;
      case EquationSections.Prebuilt:
        return JsonMapping.Prebuilt;
      default:
        throw Error('Unable to convert enum value to a Json mapping');
    }
  }
}
