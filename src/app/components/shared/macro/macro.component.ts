import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-macro',
  templateUrl: './macro.component.html',
  styleUrls: ['./macro.component.scss']
})
export class MacroComponent implements OnInit {

  public current$ = new BehaviorSubject<string>('');
  public name$ = new BehaviorSubject<string>('');
  public template$ = new BehaviorSubject<string>('');

  @Input()
  public set name(newName: string) {
    this.name$.next(newName);
  };

  @Input()
  public set template(newTemplate: string) {
    this.template$.next(newTemplate);
  };

  constructor() { }

  ngOnInit(): void {
    this.current$.next(this.template$.getValue());
  }
}
