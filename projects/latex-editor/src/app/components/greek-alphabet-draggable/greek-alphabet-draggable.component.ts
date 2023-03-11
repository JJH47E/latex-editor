import { Component, OnInit } from '@angular/core';
import { WorkspaceService } from 'src/app/services/workspace.service';

@Component({
  selector: 'app-greek-alphabet-draggable',
  templateUrl: './greek-alphabet-draggable.component.html',
  styleUrls: ['./greek-alphabet-draggable.component.scss']
})
export class GreekAlphabetDraggableComponent implements OnInit {

  constructor(private workspaceService: WorkspaceService) { }

  ngOnInit(): void {
  }

  public insertCharacter(str: string) {
    this.workspaceService.insertString(this.qualifyInlineInsert(str));
  }

  private qualifyInlineInsert = (str: string) => `\\(${str}\\)`;

}
