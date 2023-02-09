import { NestedTreeControl } from '@angular/cdk/tree';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
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
      paths.reduce((r, path) => {
        path.split('/').reduce((o, name) => {
            var temp = (o.children = o.children || []).find(q => q.name === name);
            if (!temp) o.children.push(temp = { name, children: [] });
            return temp;
        }, r);
        return r;
      }, { children: nodes });

      console.log(JSON.stringify(nodes));
      
      this.filePaths$.next(nodes);
      this.changeDetectorRef.detectChanges();
    });
  }

  hasChild = (_: number, node: TreeNode) => !!node.children && node.children.length > 0;

}
