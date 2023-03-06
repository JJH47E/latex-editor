import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MacroHelperComponent } from './macro-helper.component';

describe('MacroHelperComponent', () => {
  let component: MacroHelperComponent;
  let fixture: ComponentFixture<MacroHelperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MacroHelperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MacroHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
