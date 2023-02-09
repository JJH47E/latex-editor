import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electronyzer';
import { Subject } from 'rxjs';
import { isNullOrWhitespace } from '../utils/string.utils';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  public workspaceName$ = new Subject<string>();
  public workspaceId$ = new Subject<string>();
  public workspaceFiles$ = new Subject<string[]>();

  constructor(
    private electronService: ElectronService
  ) { }

  public selectWorkspace(): void {
    this.electronService.ipcRenderer.send('selectWorkspace');
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
