import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MacroComponent } from './macro.component';
import { MatDialog } from '@angular/material/dialog';

describe('MacroComponent', () => {
  let matDialogMock = {};
  
  let component: MacroComponent;
  let fixture: ComponentFixture<MacroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MacroComponent ],
      providers: [
        { provide: MatDialog, useValue: matDialogMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MacroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
