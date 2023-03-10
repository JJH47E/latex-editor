import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-alphabet-draggable',
  templateUrl: './alphabet-draggable.component.html',
  styleUrls: ['./alphabet-draggable.component.scss']
})
export class AlphabetDraggableComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {fileName: string, headerName: string}) { }

  ngOnInit(): void {
  }

}
