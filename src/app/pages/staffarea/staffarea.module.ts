import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
//import { DataTableModule } from "angular2-datatable";
import { DirectivesModule } from '../../theme/directives/directives.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonInfoModule } from '../common/common.module';
import { ContactInfoModule } from '../contact/contactinfo.module';
import { DynamicModule } from '../dynamic/dynamic.module';
import { FamilyInfoModule } from '../family/family.module';
import { HeaderModule } from '../headers/header.module';
import { PersonalInfoModule } from '../personalinfo/personalinfo.module';
import { PipesCustomModule } from '../pipes/pipes.module';
import { RecruitmentModule } from '../recruitment/recruitment.module';
import { APICallService } from '../services/apicallservice.service';
import { SuperAdminModule } from '../superadmin/superadmin.module';
import { UploadDocumentsModule } from '../uploaddocument/uploaddocuments.module';

//import { Ng2LoadingSpinnerModule } from 'ng2-loading-spinner'
import{ StaffAreaComponent } from './staffarea.component'
import { CanDeactivateGuard} from '../common/unsaveconfirmation.component'

export const routes: Routes = [
    { path: '', redirectTo: 'employeelist/6', pathMatch: 'full' },
    { path: 'staffarea/:mid', component: StaffAreaComponent, data: { breadcrumb: 'Staff Area Documents' } },
];

@NgModule({
    imports: [SuperAdminModule, MultiselectDropdownModule,NgSelectModule,//Ng2LoadingSpinnerModule
        FamilyInfoModule, UploadDocumentsModule, RecruitmentModule, DynamicModule, PipesCustomModule,
        PersonalInfoModule, ContactInfoModule,
        CommonModule, CommonInfoModule, HeaderModule, DirectivesModule, FormsModule, ReactiveFormsModule,
        //DataTableModule,
        RouterModule.forChild(routes)],
    providers: [APICallService],
    declarations: [StaffAreaComponent],
    exports: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class StaffAreaModules { }
