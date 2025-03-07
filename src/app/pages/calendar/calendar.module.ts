import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './calendar.component';
import { DirectivesModule } from '../../theme/directives/directives.module';

export const routes: Routes = [
  { path: '', component: CalendarComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DirectivesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    CalendarComponent
  ]
})
export class CalendarModule { }
