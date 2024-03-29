import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ElectronService } from 'ngx-electronyzer';
import { BehaviorSubject, shareReplay, tap } from 'rxjs';
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
  private _toInsert$ = new BehaviorSubject<string>('');
  private encoder = new TextEncoder();

  public workspaceName$ = this._workspaceName$.pipe(shareReplay(1));
  public workspaceId$ = this._workspaceId$.pipe(shareReplay(1));
  public workspaceFiles$ = this._workspaceFiles$.pipe(shareReplay(1));
  public fileBlob$ = this._fileBlob$.pipe(shareReplay(1), tap(blob => console.log(`Recieved: ${blob.id}, ${blob.contentType} from main process`)));
  public filePath$ = this._filePath$.pipe(shareReplay(1));
  public previewPdfBlob$ = this._previewPdfBlob$.pipe(shareReplay(1));
  public toInsert$ = this._toInsert$.pipe(shareReplay(1));
  public textData = '';

  constructor(
    private electronService: ElectronService,
    private snackBar: MatSnackBar,
    private zone: NgZone
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
        this.reloadPreview();
      }
    });
    this.electronService.ipcRenderer.on('saveFileAsync-reply', (_, newFileToLoad: string) => {
      console.log(`file saved, loading new file: ${newFileToLoad}`);
      this.loadFile(newFileToLoad);
    });
    this.electronService.ipcRenderer.on('generatePreview-error', (_, errs: string[]) => {
      // display the last error, avoid potential issue with files names?
      // TODO: Needs to be tested more
      if (errs.length == 0) {
        console.log('Main process reported error, but did not return any information!');
        return;
      }
      const err = errs.at(-1);
      let line: string;
      if (err?.startsWith('Unknown')) {
        line = err;
      } else {
        line = err!.slice(7);
      }
      this.zone.run(() => {
        const snackbar = this.snackBar.open(`An error occured when generating preview. ${line}`, 'OK', { duration: 5000 });
        snackbar.onAction().subscribe(() => {
          snackbar.dismiss();
        })
      });
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

    console.log(blob.id + ' ' + blob.contentType);

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

    console.log(blob.id + ' ' + blob.contentType);

    if (blob.contentType?.includes('image')) {
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

  public async createWorkspace(workspaceName: string, template: string): Promise<boolean> {
    if (isNullOrWhitespace(workspaceName)) {
      throw new Error(`Workspace name must have a non-whitespace value. Value: ${workspaceName}`);
    }

    console.log('sending');
    this.electronService.ipcRenderer.send('createWorkspace', workspaceName, template);

    return Promise.resolve(true);
  }

  public saveWorkspace() {
    // save current file & then save workspace
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

  public insertString(toInsert: string): void {
    this._toInsert$.next(toInsert);
  }

  public acknowledgeInsert(): void {
    this._toInsert$.next('');
  }
}
