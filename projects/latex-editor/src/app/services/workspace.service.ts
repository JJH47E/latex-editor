import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electronyzer';
import { BehaviorSubject, shareReplay } from 'rxjs';
import { FileBlob } from '../models/file-blob';
import { WorkspaceConfig } from '../models/workspace-config';
import { isNullOrWhitespace } from '../utils/string.utils';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  private _workspaceName$ = new BehaviorSubject<string>('');
  private _workspaceId$ = new BehaviorSubject<string>('');
  private _workspaceFiles$ = new BehaviorSubject<string[]>([]);
  private _fileBlob$ = new BehaviorSubject<FileBlob>({} as FileBlob);
  private _filePath$ = new BehaviorSubject<string>('');
  private _previewPdfBlob$ = new BehaviorSubject<FileBlob>({} as FileBlob);
  private encoder = new TextEncoder();

  public workspaceName$ = this._workspaceName$.pipe(shareReplay(1));
  public workspaceId$ = this._workspaceId$.pipe(shareReplay(1));
  public workspaceFiles$ = this._workspaceFiles$.pipe(shareReplay(1));
  public fileBlob$ = this._fileBlob$.pipe(shareReplay(1));
  public filePath$ = this._filePath$.pipe(shareReplay(1));
  public previewPdfBlob$ = this._previewPdfBlob$.pipe(shareReplay(1));
  public textData = '';

  constructor(
    private electronService: ElectronService
  ) {
    this.electronService.ipcRenderer.on('selectWorkspace-reply', (event, path: string) => {
      console.log(`Path selected: ${path}`)
      if (!path) {
        throw Error(`Path selected is not valid: ${path}`);
      }
      event.sender.send('loadWorkspace', path);
    });
    this.electronService.ipcRenderer.on('loadWorkspace-reply', (_, workspaceConfig: WorkspaceConfig) => {
      if (!workspaceConfig) {
        throw Error(`extractedPath is not valid: ${workspaceConfig}`);
      }
      console.log(JSON.stringify(workspaceConfig));
      this._workspaceName$.next(workspaceConfig.name);
      this._workspaceFiles$.next(workspaceConfig.filePaths);
      if (!workspaceConfig.filePaths.some(x => x === 'main.tex')) {
        console.log(`Warning: main.tex is not in the workspace`);
      } else {
        this.loadFile('main.tex');
      }
    });
    this.electronService.ipcRenderer.on('saveFileAsync-reply', (_, newFileToLoad: string) => {
      console.log(`file saved, loading new file: ${newFileToLoad}`);
      this.loadFile(newFileToLoad);
    });
    this.electronService.ipcRenderer.on('generatePreview-error', (_) => {
      console.log('An error occured when generating the PDF');
    });
    this.electronService.ipcRenderer.on('generatePreview-reply', (_, pdfData: FileBlob) => {
      console.log('PDF generated successfully, updating blob');
      this._previewPdfBlob$.next(pdfData);
    });
  }

  public selectWorkspace(): void {
    this.electronService.ipcRenderer.send('selectWorkspace');
  }

  public saveAndLoadFile(filePath: string) {
    const data = this.encoder.encode(this.textData);
    this.saveDataAsync(data, filePath);
  }

  public saveDataAsync(data: Uint8Array, newFileToLoad: string) {
    // send save request to main process
    let blob = this._fileBlob$.getValue();

    if (blob.contentType.includes('image')) {
      // hacky fix, could be done better
      this.loadFile(newFileToLoad);
      return;
    }

    blob.data = data;
    console.log(blob);
    this.electronService.ipcRenderer.send('saveFileAsync', blob, newFileToLoad);
  }

  public saveData(data: Uint8Array, newFileToLoad: string) {
    // send save request to main process
    let blob = this._fileBlob$.getValue();

    if (blob.contentType.includes('image')) {
      // hacky fix, could be done better
      this.loadFile(newFileToLoad);
      return;
    }

    blob.data = data;
    console.log(blob);
    const newFile = this.electronService.ipcRenderer.sendSync('saveFile', blob, newFileToLoad) as string;
    console.log('file saved, laoding new file');
    this.loadFile(newFile);
    return;
  }

  public loadFile(filePath: string) {
    let fileBlob = this.electronService.ipcRenderer.sendSync('getFile', filePath) as FileBlob;
    if (!fileBlob) {
      console.log(`reading file: ${filePath} failed, refer to main process console for more information`);
      throw new Error();
    }
    this._filePath$.next(filePath);
    this._fileBlob$.next(fileBlob);
    console.log(`loaded: ${filePath}`);
  }

  public async createWorkspace(workspaceName: string): Promise<boolean> {
    if (isNullOrWhitespace(workspaceName)) {
      throw new Error(`Workspace name must have a non-whitespace value. Value: ${workspaceName}`);
    }

    console.log('sending');
    this.electronService.ipcRenderer.send('createWorkspace', workspaceName);

    return Promise.resolve(true);
  }

  public saveWorkspace() {
    // save current file
    /*
      There is no nice way to do this given how saving is currently set up.
      Options:
        1. Introduce yet another observable to alert the code editor component to trigger a save (will not scale well at all)
        2. Move the NgModel used by the code editor component into the workspace server (could get nasty)
        3. Use IPC to send a message to main process that is then relayed back (not nice)
        4.

        2 is probably the best option here
    */
    // send request to save workspace
    this.saveData(this.encoder.encode(this.textData), this._filePath$.getValue());
    this.electronService.ipcRenderer.send('saveWorkspace');
  }

  public reloadPreview(): void {
    this.saveData(this.encoder.encode(this.textData), this._filePath$.getValue());
    this.electronService.ipcRenderer.send('generatePreview');
  }

  public downloadPdf(): void {
    this.electronService.ipcRenderer.send('downloadPdf');
  }
}
