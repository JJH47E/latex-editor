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
import { CodeEditorModule } from '@ngstack/code-editor';



@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    MacroHelperComponent,
    MainViewComponent,
    HelpViewComponent
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
    CodeEditorModule.forRoot(),
    MatMenuModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
