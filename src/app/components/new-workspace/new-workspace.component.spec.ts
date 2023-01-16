import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewWorkspaceComponent } from './new-workspace.component';

describe('NewWorkspaceComponent', () => {
  let component: NewWorkspaceComponent;
  let fixture: ComponentFixture<NewWorkspaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewWorkspaceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
