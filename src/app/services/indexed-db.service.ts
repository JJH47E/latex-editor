import { Injectable } from '@angular/core';
import { db } from './db';

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {

  constructor() { }

  public async createWorkspace(name: string): Promise<boolean> {
    return await db.workspace.add({
      id: '1',
      title: name
    }).then(_ => true)
      .catch(_ => false);
  }
}
