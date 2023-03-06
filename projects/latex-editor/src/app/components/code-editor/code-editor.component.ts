import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { WorkspaceService } from 'src/app/services/workspace.service';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss']
})
export class CodeEditorComponent implements OnInit {
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
}
