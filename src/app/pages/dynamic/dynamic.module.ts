import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { CKEditorModule } from 'ng2-ckeditor';
import { BarRatingModule } from 'ngx-bar-rating';
import { CommonInfoModule } from '../common/common.module';
import { PipesCustomModule } from '../pipes/pipes.module';
import { CheckBoxListComponet } from './checkboxlist.component';
import { DynamicFormComponet } from './dynamicform.component';
import { ListBoxComponet } from './listbox.component';
import { MultiselectDropdownComponent } from './multiselectdropdown.component';
import {AutosizeModule} from 'ngx-autosize';
import {RadioListListComponet} from './radiolist.component';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
    imports: [CommonModule,AutosizeModule, BarRatingModule, CommonInfoModule, FormsModule, CKEditorModule, ReactiveFormsModule, PipesCustomModule, MultiselectDropdownModule,CalendarModule],
    declarations: [DynamicFormComponet, ListBoxComponet, CheckBoxListComponet,RadioListListComponet, MultiselectDropdownComponent],
    exports: [DynamicFormComponet, CKEditorModule, ListBoxComponet, CheckBoxListComponet, RadioListListComponet,MultiselectDropdownComponent]
})
export class DynamicModule { }
