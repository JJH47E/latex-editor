import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AssetService } from 'src/app/services/asset.service';

@Component({
  selector: 'app-alphabet',
  templateUrl: './alphabet.component.html',
  styleUrls: ['./alphabet.component.scss']
})
export class AlphabetComponent implements OnInit {

  @Input()
  public fileName!: string;

  @Output()
  public insertStringEmitter = new EventEmitter<string>();

  public dataToDisplay$ = new BehaviorSubject<string[]>([]);
  constructor(
    private assetService: AssetService
  ) { }

  ngOnInit(): void {
    this.assetService.getJsonData<string>(this.fileName).subscribe(data => {
      this.dataToDisplay$.next(data);
    });
  }

  public insertCharacter(character: string): void {
    this.insertStringEmitter.emit(character);
  }

}
