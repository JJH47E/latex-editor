import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MacroModel } from 'src/app/macros/macro.model';

@Component({
  selector: 'app-macro-list',
  templateUrl: './macro-list.component.html',
  styleUrls: ['./macro-list.component.scss']
})
export class MacroListComponent implements OnInit {

  @Input()
  public macroList: MacroModel[] = [];

  @Output()
  public macroSelected = new EventEmitter<MacroModel>();

  constructor() { }

  ngOnInit(): void {
  }

  public onSelect(macro: MacroModel): void {
    this.macroSelected.emit(macro);
  }

}
