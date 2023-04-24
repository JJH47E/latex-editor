import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubMacroComponent } from './sub-macro.component';
import { MatDialogRef } from '@angular/material/dialog';

describe('SubMacroComponent', () => {
  let component: SubMacroComponent;
  let fixture: ComponentFixture<SubMacroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubMacroComponent ],
      providers: [
        { provide: MatDialogRef, useValue: {} }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubMacroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
