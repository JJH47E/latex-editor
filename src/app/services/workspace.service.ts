import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isNullOrWhitespace } from '../utils/string.utils';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  public workspaceName = new BehaviorSubject<string>('');

  constructor() { }

  public setWorkspaceName(name: string) {
    if (isNullOrWhitespace(name)) {
      throw new Error(`Workspace name must have a non-whitespace value. Value: ${name}`);
    }
    this.workspaceName.next(name);
  }

  public getWorkspaceName(): Observable<string> {
    return this.workspaceName.asObservable();
  }
}
