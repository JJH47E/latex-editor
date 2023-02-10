import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electronyzer';
import { Subject } from 'rxjs';
import { FileBlob } from '../models/file-blob';
import { WorkspaceConfig } from '../models/workspace-config';
import { isNullOrWhitespace } from '../utils/string.utils';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  public workspaceName$ = new Subject<string>();
  public workspaceId$ = new Subject<string>();
  public workspaceFiles$ = new Subject<string[]>();
  public fileBlob$ = new Subject<FileBlob>();
  public filePath$ = new Subject<string>();

  constructor(
    private electronService: ElectronService
  ) {
    this.electronService.ipcRenderer.on('selectWorkspace-reply', (event, path: string) => {
      console.log('GOT IT');
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
      this.workspaceName$.next(workspaceConfig.name);
      this.workspaceFiles$.next(workspaceConfig.filePaths);
      if (!workspaceConfig.filePaths.some(x => x === 'main.tex')) {
        console.log(`Warning: main.tex is not in the workspace`);
      } else {
        this.loadFile('main.tex');
      }
    });
  }

  public selectWorkspace(): void {
    this.electronService.ipcRenderer.send('selectWorkspace');
  }

  public loadFile(filePath: string) {
    let fileBlob = this.electronService.ipcRenderer.sendSync('getFile', filePath);
    if (!fileBlob) {
      console.log(`reading file: ${filePath} failed, refer to main process console for more information`);
      throw new Error();
    }
    this.filePath$.next(filePath);
    this.fileBlob$.next(fileBlob);
    console.log(`loaded: ${filePath}`);
  }

  public async createWorkspace(workspaceName: string): Promise<boolean> {
    if (isNullOrWhitespace(workspaceName)) {
      throw new Error(`Workspace name must have a non-whitespace value. Value: ${workspaceName}`);
    }

    console.log('sending');
    this.electronService.ipcRenderer.send('createWorkspace', workspaceName);

    return Promise.resolve(true);

    // return await this.indexedDbService.createWorkspace(workspaceName).then(id => {
    //   this.setWorkspaceName(workspaceName);
    //   this.setWorkspaceId(id);
    //   return true;
    // }).catch(_ => false);
  }
}
