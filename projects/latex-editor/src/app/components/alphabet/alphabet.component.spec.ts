import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphabetComponent } from './alphabet.component';
import { AssetService } from 'src/app/services/asset.service';
import { BehaviorSubject } from 'rxjs';

describe('OperatorAlphabetComponent', () => {
  let mockAssetService = {getJsonData: (_: string) => new BehaviorSubject<string>('')};
  
  let component: AlphabetComponent;
  let fixture: ComponentFixture<AlphabetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlphabetComponent ],
      providers: [
        { provide: AssetService, useValue: mockAssetService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphabetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
