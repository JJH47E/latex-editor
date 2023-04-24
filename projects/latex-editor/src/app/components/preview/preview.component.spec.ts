import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewComponent } from './preview.component';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { BehaviorSubject } from 'rxjs';
import { FileBlob } from 'src/app/models/file-blob';
import { By } from '@angular/platform-browser';
import { PdfViewerComponent } from 'ng2-pdf-viewer';

describe('PreviewComponent', () => {
  let workspaceServiceMock = { previewPdfBlob$: new BehaviorSubject<FileBlob>({} as FileBlob)}

  let component: PreviewComponent;
  let fixture: ComponentFixture<PreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewComponent, PdfViewerComponent ],
      providers: [
        { provide: WorkspaceService, useValue: workspaceServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // describe('fitToScreen', () => {
  //   it('should reset zoom to 1, and call updateSize', () => {
  //     component.fitToScreen();
  //     let pdfComponent = fixture.debugElement.query(By.directive(PdfViewerComponent)).componentInstance;
  //     pdfComponent.updateSize = () => {};
  //     const functionSpy = spyOn(pdfComponent, 'updateSize').and.callFake(() => {});
  //     expect(functionSpy).toHaveBeenCalled();
  //     expect(component.zoom).toBe(1);
  //   });
  // });

  describe('zoomIn', () => {
    it('should increment zoom by 0.1', () => {
      component.zoomIn();
      expect(component.zoom).toBe(1.1);
    });
  });

  describe('zoomOut', () => {
    it('should decrement zoom by 0.1', () => {
      component.zoomOut();
      expect(component.zoom).toBe(0.9);
    });
  });
});
