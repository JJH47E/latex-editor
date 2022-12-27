import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isNullOrWhitespace } from '../utils/string.utils';
import { IndexedDbService } from './indexed-db.service';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  public workspaceName = new BehaviorSubject<string>('');

  constructor(private indexedDbService: IndexedDbService) { }

  public setWorkspaceName(name: string) {
    this.workspaceName.next(name);
  }

  public getWorkspaceName(): Observable<string> {
    return this.workspaceName.asObservable();
  }

  public async createWorkspace(workspaceName: string): Promise<boolean> {
    if (isNullOrWhitespace(workspaceName)) {
      throw new Error(`Workspace name must have a non-whitespace value. Value: ${workspaceName}`);
    }

    return await this.indexedDbService.createWorkspace(workspaceName).then(_ => {
      this.setWorkspaceName(workspaceName);
      return true;
    }).catch(_ => false);
  }
}
