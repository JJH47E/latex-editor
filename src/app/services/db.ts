import Dexie, { Table } from 'dexie';

export interface Workspace {
    id: string;
    title: string;
}

export interface Data {
    id: string;
    files: File[];
}

export interface File {
    name: string;
    fileData: Blob;
}

export class AppDB extends Dexie {
    workspace!: Table<Workspace, string>;

    constructor() {
        super('ngdexieliveQuery');
        this.version(3).stores({
            workspace: '++id',
        });
        this.on('populate', () => this.populate());
    }

    async populate() {
        //! Test db here
        // const todoListId = await db.todoLists.add({
        //   title: 'To Do Today',
        // });
        // await db.todoItems.bulkAdd([
        //   {
        //     todoListId,
        //     title: 'Feed the birds',
        //   },
        //   {
        //     todoListId,
        //     title: 'Watch a movie',
        //   },
        //   {
        //     todoListId,
        //     title: 'Have some sleep',
        //   },
        // ]);
    }
}

export const db = new AppDB();