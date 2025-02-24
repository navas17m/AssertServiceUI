

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CapitalizePipe, ddlBrPipes, ExtendDatePipe, FilterLikePipes, FilterPipes, FilterTwoValuePipes, GroupByPipe, NotEqualPipes, SearchDynamicFilter, SearchPipeForm } from './app.pipe';



@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    declarations: [FilterPipes, ExtendDatePipe, GroupByPipe, NotEqualPipes, FilterTwoValuePipes, SearchPipeForm, SearchDynamicFilter, FilterLikePipes, CapitalizePipe, ddlBrPipes],
    exports: [FilterPipes, ExtendDatePipe, GroupByPipe, NotEqualPipes, FilterTwoValuePipes, SearchPipeForm, SearchDynamicFilter, FilterLikePipes, CapitalizePipe, ddlBrPipes]
})
export class PipesCustomModule { }
