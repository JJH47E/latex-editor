import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CodeModel } from '@ngstack/code-editor';
import { of } from 'rxjs';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainViewComponent implements OnInit {
  public codeModel$ = of({language: 'tex', value: 'test'} as CodeModel);

  constructor() { }

  ngOnInit(): void {
  }

  public getPdf() {
    return 'assets/test.pdf';
  }
}
