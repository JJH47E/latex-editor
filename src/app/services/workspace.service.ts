import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { isNullOrWhitespace } from '../utils/string.utils';
import { IndexedDbService } from './indexed-db.service';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  private mainFileName = 'main.tex';
  public workspaceName = new BehaviorSubject<string>('');
  public workspaceId = new BehaviorSubject<string>('');

  constructor(private indexedDbService: IndexedDbService) { }

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

  public getMainContent(id: string): Observable<string> {
    return from(this.indexedDbService.getFileContent(id, this.mainFileName));
  }

  public async createWorkspace(workspaceName: string): Promise<boolean> {
    if (isNullOrWhitespace(workspaceName)) {
      throw new Error(`Workspace name must have a non-whitespace value. Value: ${workspaceName}`);
    }

    return await this.indexedDbService.createWorkspace(workspaceName).then(id => {
      this.setWorkspaceName(workspaceName);
      this.setWorkspaceId(id);
      return true;
    }).catch(_ => false);
  }
}
