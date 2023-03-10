import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AssetService } from 'src/app/services/asset.service';
import { WorkspaceService } from 'src/app/services/workspace.service';

@Component({
  selector: 'app-alphabet',
  templateUrl: './alphabet.component.html',
  styleUrls: ['./alphabet.component.scss']
})
export class AlphabetComponent implements OnInit {

  @Input()
  public fileName!: string;
  public dataToDisplay$ = new BehaviorSubject<string[]>([]);
  constructor(
    private workspaceService: WorkspaceService,
    private assetService: AssetService
  ) { }

  ngOnInit(): void {
    this.assetService.getJsonData<string>(this.fileName).subscribe(data => {
      this.dataToDisplay$.next(data);
      console.log(data);
    });
  }

  public insertCharacter(character: string): void {
    this.workspaceService.insertString(this.qualifyInlineInsert(character));
  }

  private qualifyInlineInsert = (character: string) => `\\(${character}\\)`;

}
