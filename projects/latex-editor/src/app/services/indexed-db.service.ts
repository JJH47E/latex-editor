import { Injectable } from '@angular/core';
import { db } from './db';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {

  constructor() { }

  public async createWorkspace(name: string): Promise<string> {
    const ws = await db.workspace.filter(w => w.title === name).first();
    if (!ws) {
      throw Error(`Workspace with name: ${name} already exists`);
    }
    const id = uuidv4();
    return await db.workspace.add({
      id,
      title: name
    }).then(async _ => {
      await this.createFiles(id);
      return id;
    });
  }

  public async getFileContent(id: string, fileName: string): Promise<string> {
    return await db.workspaceFiles
      .filter(ws => ws.id === id)
      .first()
      .then(data => {
        if (!data) {
          throw Error(`Cannot find workspace with id: ${id}`);
        }
        const file = data.files.find(f => f.name === fileName);
        if (!file) {
          throw Error(`Unable to find file: ${fileName} in workspace with id: ${id}`);
        }
        return file.fileData.text();
      });
  }

  private async createFiles(id: string): Promise<boolean> {
    var main = new Blob([''], {type: 'text/plain;charset=utf-8'});
    var config = new Blob([''], {type: 'text/plain;charset=utf-8'});
    return await db.workspaceFiles.add({
      id,
      files: [
        {
          name: '.config',
          fileData: config
        },
        {
          name: 'main.tex',
          fileData: main
        }
      ]
    }).then(_ => true).catch(_ => false);
  }
}
