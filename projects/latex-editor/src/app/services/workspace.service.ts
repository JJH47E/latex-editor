import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electronyzer';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { WorkspaceConfig } from '../models/workspace-config';
import { isNullOrWhitespace } from '../utils/string.utils';
import { IpcService } from './ipc.service';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  private mainFileName = 'main.tex';
  public workspaceName = new BehaviorSubject<string>('');
  public workspaceId = new BehaviorSubject<string>('');

  constructor(
    private electronService: ElectronService
  ) { }

  public setWorkspaceName(name: string) {
    this.workspaceName.next(name);
  }

  public setWorkspaceId(id: string) {
    this.workspaceId.next(id);
  }

  public getWorkspaceName(): Observable<string> {
    return this.workspaceName.asObservable();
  }

  public getWorkspaceId(): Observable<string> {
    return this.workspaceId.asObservable();
  }

  // public getMainContent(id: string): Observable<string> {
  //   return from(this.indexedDbService.getFileContent(id, this.mainFileName));
  // }

  public selectWorkspace(): void {
    console.log('sending');
    this.electronService.ipcRenderer.send('selectWorkspace');
    console.log('sent');
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
