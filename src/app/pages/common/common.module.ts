import { MultiSelectModule } from 'primeng/multiselect';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
//import { SignaturePadModule } from 'angular2-signaturepad';
import { LaddaModule } from 'angular2-ladda';
import { CKEditorModule } from 'ng2-ckeditor';
import { AddButtonComponent } from './addbutton.component';
import { BackButtonComponent } from './backbutton.component';
import { DatepickerDirective } from './datepicker.component';
import { DateTimepickerDirective } from './datetimepicker.component';
import { DeleteButtonComponent } from './deletebutton.component';
import { DisplayformnameComponent } from './displayformname.component';
import { DownloadButtonComponent } from './downloadbutton.component';
//import { DynamicTableSorter } from './dynamictablesorter.component';
import { EditButtonComponent } from './editbutton.component';
import { EditorComponent } from './editor.component';
//import { MultiselectDropdown } from './multiselectdropdown.component';
import { NotificationComponent } from './notification.component';
import { SignatureComponent } from './signature.component';
import { SubmitButtonComponent } from './submitbutton.component';
import { Tab } from './tab';
import { Tabs } from './tabs';
import { TimerComponent } from './timer.component';
import { ViewButtonComponent } from './viewbutton.component';
import { ViewDisableComponent } from './viewdisable.component';
import { PreviewNextButtonComponent} from './previewnextbutton.component'
import { AutoSavedMessageComponent} from './autosavedmessage.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PipesCustomModule} from '../pipes/pipes.module';
import { NgxdatatableComponent } from './ngxdatatable.component';
import { AngularSignaturePadModule } from '@almothafar/angular-signature-pad';
import { PageSizeComponent } from './pagesizeoption';

@NgModule({
    imports: [CommonModule, CKEditorModule, FormsModule, ReactiveFormsModule,
      MultiSelectModule,//MultiselectDropdownModule,
      LaddaModule,NgxDatatableModule,PipesCustomModule,
      AngularSignaturePadModule ],
    declarations: [TimerComponent,SignatureComponent,NotificationComponent,
      //MultiselectDropdown,
      DownloadButtonComponent,
         EditorComponent, Tab, Tabs, DateTimepickerDirective, DatepickerDirective, AddButtonComponent, EditButtonComponent, SubmitButtonComponent,
          DeleteButtonComponent, ViewButtonComponent, BackButtonComponent, ViewDisableComponent, //DynamicTableSorter,
           DisplayformnameComponent,
          PreviewNextButtonComponent,AutoSavedMessageComponent,NgxdatatableComponent,PageSizeComponent],
    exports: [TimerComponent, SignatureComponent, NotificationComponent,
      //MultiselectDropdown,
      DownloadButtonComponent, AddButtonComponent,
         EditorComponent, DatepickerDirective, DateTimepickerDirective, EditButtonComponent, DeleteButtonComponent, ViewButtonComponent,
         SubmitButtonComponent, ViewDisableComponent, BackButtonComponent, //DynamicTableSorter,
         DisplayformnameComponent,
         PreviewNextButtonComponent,AutoSavedMessageComponent,NgxdatatableComponent,NgxDatatableModule,PageSizeComponent],
})
export class CommonInfoModule { }
