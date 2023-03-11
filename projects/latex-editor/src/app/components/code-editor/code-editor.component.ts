import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { filter, map, Observable } from 'rxjs';
import { WorkspaceService } from 'src/app/services/workspace.service';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss']
})
export class CodeEditorComponent implements OnInit, AfterViewInit {
  private decoder = new TextDecoder();
  
  public fileSelected$ = new Observable<boolean>();

  public options = {
    mode:'text/x-stex',
    indentWithTabs: true,
    smartIndent: true,
    lineNumbers: true,
    lineWrapping: true,
    extraKeys: { "Ctrl-Space": "autocomplete" },
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    autoCloseBrackets: true,
    matchBrackets: true,
    lint: true
  };

  @ViewChild(CodemirrorComponent)
  codemirrorComponent: CodemirrorComponent | undefined;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    public workspaceService: WorkspaceService,
  ) { }

  ngOnInit(): void {
    this.fileSelected$ = this.workspaceService.filePath$.pipe(map(path => !!path));

    this.workspaceService.fileBlob$
      .pipe(map(blob => blob.data))
      .subscribe(data => {
        this.workspaceService.textData = this.decoder.decode(data);
        console.log(`set text data`);
        this.changeDetectorRef.detectChanges();
    });
  }

  ngAfterViewInit(): void {
    this.workspaceService.toInsert$.pipe(filter(x => !!x)).subscribe(toInsert => {
      if (!this.codemirrorComponent?.codeMirror) {
        // component not instantiated, return
        console.log('Codemirror Component to instantiated, unable to insert string');
        return;
      }
      let doc = this.codemirrorComponent.codeMirror?.getDoc();
      let cursor = doc.getCursor();
      doc.replaceRange(toInsert, cursor);
      this.workspaceService.acknowledgeInsert();
    });
  }
}
