import { Component, OnInit } from '@angular/core';
import { GreekCharacter } from 'src/app/models/greek-character.model';
import { WorkspaceService } from 'src/app/services/workspace.service';
import characters from '../../../assets/greek-alphabet.json';

@Component({
  selector: 'app-greek-alphabet',
  templateUrl: './greek-alphabet.component.html',
  styleUrls: ['./greek-alphabet.component.scss']
})
export class GreekAlphabetComponent implements OnInit {

  public dataToDisplay: string[] = [];
  private characterList: GreekCharacter[] = characters;
  constructor(private workspaceService: WorkspaceService) { }

  ngOnInit(): void {
    this.dataToDisplay = this.characterList
      .map((gd: GreekCharacter) => [gd.templateLowerCase, gd.templateUpperCase])
      .flat(1)
      .filter(this.onlyUnique);
  }

  public insertCharacter(character: string): void {
    this.workspaceService.insertString(this.qualifyInlineInsert(character));
  }

  private onlyUnique(value: string, index: number, array: string[]) {
    return array.indexOf(value) === index;
  }

  private qualifyInlineInsert = (character: string) => `\\(${character}\\)`;

}
