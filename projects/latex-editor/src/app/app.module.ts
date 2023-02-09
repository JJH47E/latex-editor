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
import { ReactiveFormsModule } from '@angular/forms';
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
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { FileTreeComponent } from './components/file-tree/file-tree.component';
import {MatTreeModule} from '@angular/material/tree';

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
    FileTreeComponent
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
    MonacoEditorModule.forRoot(),
    MatTreeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
