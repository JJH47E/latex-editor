import { Component, OnInit } from '@angular/core';
import { WorkspaceService } from 'src/app/services/workspace.service';
import characters from '../../../assets/operators.json';

@Component({
  selector: 'app-operator-alphabet',
  templateUrl: './operator-alphabet.component.html',
  styleUrls: ['./operator-alphabet.component.scss']
})
export class OperatorAlphabetComponent implements OnInit {

  public dataToDisplay: string[] = [];
  private characterList: string[] = characters;
  constructor(private workspaceService: WorkspaceService) { }

  ngOnInit(): void {
    this.dataToDisplay = this.characterList
  }

  public insertCharacter(character: string): void {
    this.workspaceService.insertString(this.qualifyInlineInsert(character));
  }

  private qualifyInlineInsert = (character: string) => `\\(${character}\\)`;

}
