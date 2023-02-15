import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariableTemplateOptionComponent } from './variable-template-option.component';

describe('VariableTemplateOptionComponent', () => {
  let component: VariableTemplateOptionComponent;
  let fixture: ComponentFixture<VariableTemplateOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VariableTemplateOptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VariableTemplateOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
