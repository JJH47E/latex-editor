import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariableTemplateOptionComponent } from './variable-template-option.component';
import { VariableTemplate } from 'src/app/models/variable-template.model';

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
    component.option = {name: 'Test', template: '\\a'} as VariableTemplate;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
