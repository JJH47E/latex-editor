import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatMenuModule} from '@angular/material/menu';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { KatexModule } from 'ng-katex';
import {MatFormFieldModule} from '@angular/material/form-field';
import {TextFieldModule} from '@angular/cdk/text-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { MacroHelperComponent } from './components/macro-helper/macro-helper.component';
import {MatDialogModule} from '@angular/material/dialog';
import { MainViewComponent } from './components/main-view/main-view.component';
import { AngularSplitModule } from 'angular-split';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { HelpViewComponent } from './components/help-view/help-view.component';
import { CodeEditorComponent } from './components/code-editor/code-editor.component';
import { PreviewComponent } from './components/preview/preview.component';
import { NewWorkspaceComponent } from './components/new-workspace/new-workspace.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { MacroComponent } from './components/shared/macro/macro.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MacroListComponent } from './components/macro-list/macro-list.component';
import {MatListModule} from '@angular/material/list';
import { FileTreeComponent } from './components/file-tree/file-tree.component';
import {MatTreeModule} from '@angular/material/tree';
import { SourceEditorComponent } from './components/source-editor/source-editor.component';
import { ImagePreviewComponent } from './components/image-preview/image-preview.component';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { SubMacroComponent } from './components/sub-macro/sub-macro.component';
import { VariableTemplateOptionComponent } from './components/variable-template-option/variable-template-option.component';
import {MatRippleModule} from '@angular/material/core';
import { PreviewToolbarComponent } from './components/preview-toolbar/preview-toolbar.component';
import { GreekAlphabetComponent } from './components/greek-alphabet/greek-alphabet.component';
import { GreekAlphabetDraggableComponent } from './components/greek-alphabet-draggable/greek-alphabet-draggable.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import { WelcomeComponent } from './components/welcome/welcome.component';
import {MatSelectModule} from '@angular/material/select';
import { DraggableDialogComponent } from './components/draggable-dialog/draggable-dialog.component';
import { AlphabetComponent } from './components/alphabet/alphabet.component';
import { AlphabetDraggableComponent } from './components/alphabet-draggable/alphabet-draggable.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    MacroHelperComponent,
    MainViewComponent,
    HelpViewComponent,
    CodeEditorComponent,
    PreviewComponent,
    NewWorkspaceComponent,
    MacroComponent,
    MacroListComponent,
    FileTreeComponent,
    SourceEditorComponent,
    ImagePreviewComponent,
    SubMacroComponent,
    VariableTemplateOptionComponent,
    PreviewToolbarComponent,
    GreekAlphabetComponent,
    GreekAlphabetDraggableComponent,
    AlphabetComponent,
    AlphabetDraggableComponent,
    WelcomeComponent,
    DraggableDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    KatexModule,
    MatFormFieldModule,
    TextFieldModule,
    BrowserAnimationsModule, // may not be an import?
    MatInputModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    AngularSplitModule,
    PdfViewerModule,
    MatMenuModule,
    MatSnackBarModule,
    HttpClientModule,
    MatCheckboxModule,
    MatListModule,
    MatTreeModule,
    CodemirrorModule,
    FormsModule,
    MatRippleModule,
    DragDropModule,
    MatBottomSheetModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
