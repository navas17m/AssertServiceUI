import { CommonModule } from '@angular/common';
//import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
//import { DataTableModule } from "angular2-datatable";
import { SimpleTimer } from 'ng2-simple-timer';
import { DirectivesModule } from '../../theme/directives/directives.module';
import { CommonInfoModule } from '../common/common.module';
import { ContactInfoModule } from '../contact/contactinfo.module';
import { DynamicModule } from '../dynamic/dynamic.module';
import { FamilyInfoModule } from '../family/family.module';
//Header Module
import { HeaderModule } from '../headers/header.module';
import { PersonalInfoModule } from '../personalinfo/personalinfo.module';
import { PipesCustomModule } from '../pipes/pipes.module';
import { APICallService } from '../services/apicallservice.service';
import { SuperAdminModule } from '../superadmin/superadmin.module';
import { UploadDocumentsModule } from '../uploaddocument/uploaddocuments.module';
import { OfstedCorrespondenceData } from './ofstedcorrespondencedata.component';
import { OfstedCorrespondenceListComponent } from './ofstedcorrespondencelist.component';

export const routes: Routes = [
    { path: '', redirectTo: 'ofsted', pathMatch: 'full' },
    {
        path: 'ofstedcorrespondencelist/:mid',
        component: OfstedCorrespondenceListComponent,
        data: { breadcrumb: 'Ofsted Correspondence List' },

    },
    {
        path: 'ofstedcorrespondencedata/:Id/:mid',
        component: OfstedCorrespondenceData,
        data: { breadcrumb: 'Ofsted Correspondence' },

    },

];

@NgModule({
    imports: [DynamicModule, UploadDocumentsModule, CommonInfoModule, HttpClientModule, FamilyInfoModule, PipesCustomModule, PersonalInfoModule, ContactInfoModule,
        CommonModule, DirectivesModule, HeaderModule, SuperAdminModule, FormsModule, ReactiveFormsModule, //DataTableModule,
        RouterModule.forChild(routes)
    ],
    providers: [APICallService, SimpleTimer],
    declarations: [
        OfstedCorrespondenceListComponent, OfstedCorrespondenceData],

    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class OfstedModule { }
