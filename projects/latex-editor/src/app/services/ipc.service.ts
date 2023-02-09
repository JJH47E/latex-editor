import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electronyzer';
import { WorkspaceConfig } from '../models/workspace-config';
import { WorkspaceService } from './workspace.service';

@Injectable({
  providedIn: 'root'
})
export class IpcService {
  private isLoadSetup = false;

  constructor(
    private electronService: ElectronService,
    private workspaceService: WorkspaceService
  ) { }

  public setupLoadFileHandlers() {
    if (this.isLoadSetup) {
      // Nothing more to setup
      return;
    }

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
      this.workspaceService.workspaceName$.next(workspaceConfig.name);
      this.workspaceService.workspaceFiles$.next(workspaceConfig.filePaths);
    });

    this.isLoadSetup = true;
  }
}
