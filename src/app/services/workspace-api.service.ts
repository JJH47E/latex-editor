import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WorkspaceInfo } from '../models/WorkspaceInfo';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceApiService {
  apiRoot = 'http://localho.st:5275/';
  workspaceRoot = 'workspace/';

  constructor(private http: HttpClient) { }

  public createWorkspace(workspaceName: string): Observable<WorkspaceInfo> {
    return this.http.post<WorkspaceInfo>(`${this.apiRoot}${this.workspaceRoot}create`, {name: workspaceName});
  }
}
