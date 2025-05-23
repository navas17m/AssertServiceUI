import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { RouterModule, Routes } from '@angular/router';
import { DragulaModule } from 'ng2-dragula';
import { ResizableModule } from 'angular-resizable-element';
import { ResizableComponent } from './resizable/resizable.component';
import { DragDropComponent } from './drag-drop/drag-drop.component';
import { ToasterComponent } from './toaster/toaster.component';

export const routes: Routes = [
  { path: '', redirectTo: 'drag-drop', pathMatch: 'full'},
  { path: 'drag-drop', component: DragDropComponent, data: { breadcrumb: 'Drag and Drop' } },
  { path: 'resizable', component: ResizableComponent, data: { breadcrumb: 'Resizable' } },
  { path: 'toaster', component: ToasterComponent, data: { breadcrumb: 'Toaster' } }  
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DragulaModule.forRoot(),  
    ResizableModule,
    NgScrollbarModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    ResizableComponent, 
    DragDropComponent,
    ToasterComponent
  ]
})
export class ToolsModule { }
