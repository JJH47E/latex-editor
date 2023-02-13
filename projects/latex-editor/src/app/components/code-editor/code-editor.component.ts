import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';
import { FileBlob } from 'src/app/models/file-blob';
import { WorkspaceService } from 'src/app/services/workspace.service';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss']
})
export class CodeEditorComponent implements OnInit {
  private decoder = new TextDecoder();
  
  public textData = '';
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

  @Input()
  public set fileText(uint8Array: Uint8Array) {
    this.textData = this.decoder.decode(uint8Array);
    console.log(`set text data to: ${this.textData}`);
    this.changeDetectorRef.detectChanges();
  };

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private workspaceService: WorkspaceService
  ) { }

  ngOnInit(): void {
    this.fileSelected$ = this.workspaceService.filePath$.pipe(map(path => !!path));
  }
}
