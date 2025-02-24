import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { DataTableModule } from "angular2-datatable";
//import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { FileUploadModule } from 'ng2-file-upload';
//import { ColorPickerModule } from 'angular2-color-picker';
import { ColorPickerModule } from 'ngx-color-picker';
import { CommonInfoModule } from '../common/common.module';
import { PipesCustomModule } from '../pipes/pipes.module';
import { APICallService } from '../services/apicallservice.service';
import { AdminUploadDocumentsComponet } from './adminuploaddocuments.component';
import { FinanceUploadDocumentsComponet } from './financeuploaddocuments.component';
import { UploadDocumentsComponet } from './uploaddocuments.component';
import { UploadGalleryComponet} from './uploadgallery.component';
import { StaffAreaUploadDocumentsComponet } from './staffareauploaddocuments.component'
@NgModule({
    imports: [CommonModule, CommonInfoModule, FormsModule, ReactiveFormsModule, ColorPickerModule, FileUploadModule, PipesCustomModule],//, DataTableModule],
    declarations: [UploadDocumentsComponet, AdminUploadDocumentsComponet, FinanceUploadDocumentsComponet,
        UploadGalleryComponet,StaffAreaUploadDocumentsComponet
        //FileSelectDirective, FileDropDirective
    ],
    exports: [UploadDocumentsComponet, AdminUploadDocumentsComponet, FinanceUploadDocumentsComponet,UploadGalleryComponet,
        StaffAreaUploadDocumentsComponet],
    providers: [APICallService]
})
export class UploadDocumentsModule { }
