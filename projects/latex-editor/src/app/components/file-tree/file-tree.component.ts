import { NestedTreeControl } from '@angular/cdk/tree';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { TreeNode } from 'src/app/models/tree-node.model';
import { WorkspaceService } from 'src/app/services/workspace.service';

@Component({
  selector: 'app-file-tree',
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.scss']
})
export class FileTreeComponent implements OnInit {

  public filePaths$ = new BehaviorSubject<TreeNode[]>([]);

  treeControl = new NestedTreeControl<TreeNode>(node => node.children);

  constructor(
    private workspaceService: WorkspaceService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.workspaceService.workspaceFiles$.pipe(map(path => path)).subscribe(paths => {
      let nodes: TreeNode[] = [];
      let counter = 0;
      paths.reduce((r, path) => {
        path.split('/').reduce((o, name, _) => {
            var temp = (o.children = o.children || []).find(q => q.name === name);
            if (!temp) o.children.push(temp = { name, children: [], id: counter++ });
            return temp;
        }, r);
        return r;
      }, { children: nodes });

      console.log(JSON.stringify(nodes));
      
      this.filePaths$.next(nodes);
      this.changeDetectorRef.detectChanges();
    });

    this.workspaceService.filePath$.subscribe(_ => this.changeDetectorRef.detectChanges());
  }
  
  public isFileSelected(fileName: string): Observable<boolean> {
    return this.workspaceService.filePath$.pipe(map(path => path.endsWith(fileName)));
  }

  public log(id: number): void {
    const newFilePath = this.findNodeFromId(id);
    console.log(`clicked: ${newFilePath}`);
    this.workspaceService.saveAndLoadFile(newFilePath);
  }

  private findNodeFromId(id: number): string {
    const searchResult = this.filePaths$.getValue().map(node => {
      return this.findNodeAndParents(node, id).reverse().join('/');
    }).filter(x => x.length > 0);

    if (searchResult.length !== 1) {
      throw Error(`Unable to find definitive node with Id: ${id}`);
    }

    let toReturn = searchResult[0];
    if (toReturn.startsWith('/')) {
      return toReturn.slice(1);
    }

    return toReturn;
  }

  private findNodeAndParents(node: TreeNode, id: number, path: string[] = []): string[] {
    if (node.id === id) {
      path.unshift(node.name);
      return path;
    }
    for (const child of node.children) {
      const result = this.findNodeAndParents(child, id, [...path, node.name]);
      if (result.length > 0) {
        return result;
      }
    }
    return [];
  }

  hasChild = (_: number, node: TreeNode) => !!node.children && node.children.length > 0;
}
