import { TestBed } from '@angular/core/testing';

import { WorkspaceService } from './workspace.service';
import { ElectronService } from 'ngx-electronyzer';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileBlob } from '../models/file-blob';

describe('WorkspaceService', () => {
  let mockElectronService: { ipcRenderer: any; };
  let mockSnackBar = {};

  let service: WorkspaceService;

  beforeEach(() => {
    mockElectronService = {
      ipcRenderer: {
        on: (_: string, __: any) => {},
        send: jasmine.createSpy('send'),
        sendSync: jasmine.createSpy('sendSync')
      }
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: ElectronService, useValue: mockElectronService },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    });
    service = TestBed.inject(WorkspaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('save workspace', () => {
    beforeEach(() => {
      service.loadFile = jasmine.createSpy('loadFile').and.stub();
    });

    it('should save the file followed by the workspace', () => {
      service.saveWorkspace();
      expect(mockElectronService.ipcRenderer.sendSync).toHaveBeenCalledOnceWith('saveFile', jasmine.any(Object), jasmine.any(String));
      expect(mockElectronService.ipcRenderer.send).toHaveBeenCalledOnceWith('saveWorkspace');
    });
  });

  describe('reaload preview', () => {
    beforeEach(() => {
      service.loadFile = jasmine.createSpy('loadFile').and.stub();
    });

    it('should save file and send event to regenerate preview', () => {
      service.reloadPreview();
      expect(mockElectronService.ipcRenderer.sendSync).toHaveBeenCalledOnceWith('saveFile', jasmine.any(Object), jasmine.any(String));
      expect(mockElectronService.ipcRenderer.send).toHaveBeenCalledOnceWith('generatePreview');
    });
  });

  describe('download pdf', () => {
    it('should send download pdf event', () => {
      service.downloadPdf();
      expect(mockElectronService.ipcRenderer.send).toHaveBeenCalledOnceWith('downloadPdf');
    });
  });

  describe('insert string', () => {
    it('should update the value to toInsert to the new value', async () => {
      const newString = 'insert me!';
      service.insertString(newString);
      service.toInsert$.subscribe(res => {
        expect(res).toBe(newString);
      });
    });
  });

  describe('acknowledge insert', () => {
    beforeEach(() => {
      const newString = 'insert me!';
      service.insertString(newString);
    });

    it('should update the value to toInsert to an empty string', async () => {
      service.acknowledgeInsert();
      service.toInsert$.subscribe(res => {
        expect(res).toBeFalsy();
      });
    })
  });

  describe('select workspace', () => {
    it('should send event to select the workspace', () => {
      service.selectWorkspace();
      expect(mockElectronService.ipcRenderer.send).toHaveBeenCalledOnceWith('selectWorkspace');
    });
  });

  describe('save and load file', () => {
    beforeEach(() => {
      service.saveDataAsync = jasmine.createSpy('saveDataAsync').and.stub();
    });

    it('should call saveDataAsync with given file path', () => {
      const filePath = 'test Filepath';
      service.saveAndLoadFile(filePath);
      expect(service.saveDataAsync).toHaveBeenCalledOnceWith(jasmine.any(Object), filePath);
    });
  });

  describe('save data async', () => {
    const fileBlob = {contentType: 'text file'} as FileBlob;
    const newFileToLoadPath = 'new path';

    beforeEach(() => {
      (service as any).fileBlob$.next(fileBlob);
    });

    it('should send a save event', () => {
      service.saveDataAsync([] as unknown as Uint8Array, newFileToLoadPath);
      expect(mockElectronService.ipcRenderer.send).toHaveBeenCalledOnceWith('saveFileAsync', jasmine.any(Object), newFileToLoadPath);
    });
  });

  describe('save data', () => {
    beforeEach(() => {
      service.loadFile = jasmine.createSpy('loadFile').and.stub();
    });

    it('should save the file followed by the workspace', () => {
      const newPath = 'path';
      service.saveData([] as unknown as Uint8Array, newPath);
      expect(mockElectronService.ipcRenderer.sendSync).toHaveBeenCalledOnceWith('saveFile', jasmine.any(Object), newPath);
    });
  });

  describe('load file', () => {
    const testBlob = {contentType: 'test'} as FileBlob;
    beforeEach(() => {
      mockElectronService.ipcRenderer.sendSync.withArgs('getFile', jasmine.any(String)).and.returnValue(testBlob);
    });

    it('should load the file', () => {
      const newPath = 'path';
      service.loadFile(newPath);
      expect(mockElectronService.ipcRenderer.sendSync).toHaveBeenCalledOnceWith('getFile', newPath);
      service.filePath$.subscribe(path => {
        expect(path).toBe(newPath);
      });
      service.fileBlob$.subscribe(blob => {
        expect(blob).toBe(testBlob);
      });
    });
  });

  describe('create workspace', () => {
    it('should send event to create the workspace with given name if valid', async () => {
      const worksapceName = 'NAME';
      const template = 'template';
      await service.createWorkspace(worksapceName, template).then(() => {
        expect(mockElectronService.ipcRenderer.send).toHaveBeenCalledOnceWith('createWorkspace', worksapceName, template);
      });
    });

    it('should error if name not valid', async () => {
      const worksapceName = '';
      const template = 'template';
      await expectAsync(service.createWorkspace(worksapceName, template)).toBeRejectedWithError();
      expect(mockElectronService.ipcRenderer.send).not.toHaveBeenCalled();
    });
  });

  afterEach(() => {
    mockElectronService.ipcRenderer.send.calls.reset();
    mockElectronService.ipcRenderer.sendSync.calls.reset();
  })
});
