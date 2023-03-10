import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GreekCharacter } from 'src/app/models/greek-character.model';
import characters from '../../../assets/greek-alphabet.json';

@Component({
  selector: 'app-greek-alphabet',
  templateUrl: './greek-alphabet.component.html',
  styleUrls: ['./greek-alphabet.component.scss']
})
export class GreekAlphabetComponent implements OnInit {

  @Output()
  public toInsertEmitter = new EventEmitter<string>();

  public dataToDisplay: string[] = [];
  private characterList: GreekCharacter[] = characters;
  constructor() { }

  ngOnInit(): void {
    this.dataToDisplay = this.characterList
      .map((gd: GreekCharacter) => [gd.templateLowerCase, gd.templateUpperCase])
      .flat(1)
      .filter(this.onlyUnique);
  }

  public insertCharacter(character: string): void {
    this.toInsertEmitter.emit(character);
  }

  private onlyUnique(value: string, index: number, array: string[]) {
    return array.indexOf(value) === index;
  }

}
