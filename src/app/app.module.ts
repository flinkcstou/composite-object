import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditingComponent } from './components/editing/editing.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { ToggleClassDirective } from './directives/toggle-class.directive';
import { ExpansionPanelComponent } from './components/expansion-panel/expansion-panel.component';
import { HoverClassDirective } from './directives/hover-class.directive';
import { DragAndDropComponent } from './test/drag-and-drop/drag-and-drop.component';
import { CompositeEditorComponent } from './components/composite-editor/composite-editor.component';
import { BoSecondGridComponent } from 'src/app/components/composite-editor/bo/bo-second-grid/bo-second-grid.component';
import { BoAttrGridComponent } from './components/composite-editor/bo/bo-attr-grid/bo-attr-grid.component';
import { BoAttrGroupComponent } from 'src/app/components/composite-editor/bo/bo-attr-group/bo-attr-group.component';
import { BoAttrItemComponent } from './components/composite-editor/bo/bo-attr-item/bo-attr-item.component';
import { CheckClassDirective } from './directives/check-class.directive';
import { BoAttrItemDragComponent } from './components/composite-editor/grid-ui/bo-attr-item-drag/bo-attr-item-drag.component';
import { BoAttrItemFirstComponent } from './components/composite-editor/bo/bo-attr-item-first/bo-attr-item-first.component';
import { CoAttrGridComponent } from './components/composite-editor/co/co-attr-grid/co-attr-grid.component';
import { CoSecondGridComponent } from './components/composite-editor/co/co-second-grid/co-second-grid.component';
import { CoAttrGroupComponent } from './components/composite-editor/co/co-attr-group/co-attr-group.component';
import { CoAttrGroupDragComponent } from './components/composite-editor/grid-ui/co-attr-group-drag/co-attr-group-drag.component';
import { CoAttrItemComponent } from './components/composite-editor/co/co-attr-item/co-attr-item.component';
import { CoAttrItemDragComponent } from './components/composite-editor/grid-ui/co-attr-item-drag/co-attr-item-drag.component';
import { FindTabGroupPipe } from './components/pipes/find-tab-group.pipe';
import { environment } from 'src/environments/environment';
import { HttpServiceModule } from 'src/app/components/services/lib/http-service.module';
import { AttrDragPreviewComponent } from './components/composite-editor/grid-ui/attr-drag-preview/attr-drag-preview.component';
import { LeaderLineDirective } from './directives/leader-line.directive';
import { LinkLeaderLineDirective } from './directives/link-leader-line.directive';
import { ClickStopPropagationDirective } from 'src/app/directives/click-stop-propagation.directive';

@NgModule({
  declarations: [
    AppComponent,
    EditingComponent,
    ToggleClassDirective,
    ExpansionPanelComponent,
    HoverClassDirective,
    DragAndDropComponent,
    CompositeEditorComponent,
    BoAttrGroupComponent,
    BoSecondGridComponent,
    BoAttrGridComponent,
    BoAttrItemComponent,
    CheckClassDirective,
    BoAttrItemDragComponent,
    BoAttrItemFirstComponent,
    CoAttrGridComponent,
    CoSecondGridComponent,
    CoAttrGroupComponent,
    CoAttrGroupDragComponent,
    CoAttrItemComponent,
    CoAttrItemDragComponent,
    FindTabGroupPipe,
    AttrDragPreviewComponent,
    LeaderLineDirective,
    LinkLeaderLineDirective,
    ClickStopPropagationDirective

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DragDropModule,
    MatIconModule,
    HttpClientModule,
    HttpServiceModule.forRoot(environment.urlPrefix, environment.apiPrefix),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
