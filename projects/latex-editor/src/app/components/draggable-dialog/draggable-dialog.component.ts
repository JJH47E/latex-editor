import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-draggable-dialog',
  templateUrl: './draggable-dialog.component.html',
  styleUrls: ['./draggable-dialog.component.scss']
})
export class DraggableDialogComponent implements OnInit {

  @Input()
  public dialogTitle = '';

  constructor() { }

  ngOnInit(): void {
  }

}
