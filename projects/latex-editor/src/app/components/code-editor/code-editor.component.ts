import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { WorkspaceService } from 'src/app/services/workspace.service';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss']
})
export class CodeEditorComponent implements OnInit {
  private decoder = new TextDecoder();
  private encoder = new TextEncoder();
  
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
    this.workspaceService.saveAndLoadFile$.subscribe(newFilePath => {
      if (newFilePath) {
        console.log(`Saving current file and then loading: ${newFilePath}`);
        // encode text and send to service for saving
        let encodedText = this.encoder.encode(this.textData);
        this.workspaceService.saveData(encodedText, newFilePath);
      }
    });
  }
}
