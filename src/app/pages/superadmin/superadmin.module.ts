/// <reference path="statutorycheck.component.ts" />
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
//import { DataTableModule } from "angular2-datatable";
import { DirectivesModule } from '../../theme/directives/directives.module';
import { PipesModule } from '../../theme/pipes/pipes.module';
import { CommonInfoModule } from '../common/common.module';
import { ContactInfoModule } from '../contact/contactinfo.module';
import { DynamicModule } from '../dynamic/dynamic.module';
import { HeaderModule } from '../headers/header.module';
import { PersonalInfoModule } from '../personalinfo/personalinfo.module';
import { PipesCustomModule } from '../pipes/pipes.module';
import { APICallService } from '../services/apicallservice.service';
import { UploadDocumentsModule } from '../uploaddocument/uploaddocuments.module';
import { AgencyFieldMappingComponent } from './agencyfieldmapping.component';
import { AgencyFormMappingComponent } from './agencyformmapping.component';
import { AgencyKeyNameCnfgComponet } from './agencykeynamecnfg.component';
import { AgencyListComponet } from './agencylist.component';
import { AgencySetupComponet } from './agencysetup.component';
import { ComplianceCheckTypeCnfgComponent } from './compliancechecktypecnfg.component';
import { ComplianeCheckTypecnfgListComponent } from './compliancechecktypecnfglist.component';
import { FieldConfigComponet } from './fieldconfig.component';
import { FieldConfigListComponet } from './fieldconfiglist.component';
import { FormConfigComponet } from './formconfig.component';
import { FormConfigListComponet } from './formconfiglist.component';
import { ModuleConfigComponet } from './moduleconfig.component';
import { MouleConfigListComponet } from './moduleconfiglist.component';
import { StatutoryCheckComponet } from './statutorycheck.component';
import { StatutoryCheckListComponet } from './statutorychecklist.component';
export const routes:any = [
    { path: '', redirectTo: 'agencyformmapping/1', pathMatch: 'full' },
    { path: 'modulecnfgdata', component: ModuleConfigComponet, data: { breadcrumb: 'Module Config Entry' } },
    { path: 'fieldcnfgdata/:id', component: FieldConfigComponet, data: { breadcrumb: 'Field Config' } },
    { path: 'agencysetup/:id', component: AgencySetupComponet, data: { breadcrumb: 'Agency Setup' } },
    { path: 'agencylist/:mid', component: AgencyListComponet, data: { breadcrumb: 'Agency List' } },
    { path: 'formconfig/:id', component: FormConfigComponet, data: { breadcrumb: 'Form Config' } },
    { path: 'formconfiglist/:mid', component: FormConfigListComponet, data: { breadcrumb: 'Form Config List' } },
    { path: 'agencyformmapping', component: AgencyFormMappingComponent, data: { breadcrumb: 'Agency Form Mapping' } },
    { path: 'agencyfieldmapping/:AgencyProfileId/:FormCnfgId', component: AgencyFieldMappingComponent, data: { breadcrumb: 'Agency Field Mapping' } },
    { path: 'statutorychecklist/:id/:mid', component: StatutoryCheckListComponet, data: { breadcrumb: 'Statutory Check List' } },
    { path: 'modulecnfglist/:mid', component: MouleConfigListComponet, data: { breadcrumb: 'Module Config' } },
    { path: 'fieldcnfglist/:mid', component: FieldConfigListComponet, data: { breadcrumb: 'Field Config Entry' } },
    { path: 'compliancechecktypecnfg/:id', component: ComplianceCheckTypeCnfgComponent, data: { breadcrumb: 'Compliance Check Type cnfg' } },
    { path: 'compliancechecktypelist/:mid', component: ComplianeCheckTypecnfgListComponent, data: { breadcrumb: 'Compliance Check Type List' } },
    { path: 'agencyformmapping/:mid', component: AgencyFormMappingComponent, data: { breadcrumb: 'Agency Form Mapping' } },
    { path: 'agencyfieldmapping/:AgencyProfileId/:FormCnfgId', component: AgencyFieldMappingComponent, data: { breadcrumb: 'Agency Field Mapping' } },
    { path: 'agencykeynamevalue/:mid', component: AgencyKeyNameCnfgComponet, data: { breadcrumb: 'Application Configuration ' } },
    { path: 'statutorycheck/:mid', component: StatutoryCheckComponet, data: { breadcrumb: 'Statutory Check List' } },
];

@NgModule({
    imports: [PipesCustomModule, HeaderModule, DynamicModule, PersonalInfoModule, ContactInfoModule,
        CommonModule, UploadDocumentsModule, MultiselectDropdownModule, CommonInfoModule,
        PipesModule,
        DirectivesModule, FormsModule, ReactiveFormsModule, //DataTableModule,
        RouterModule.forChild(routes)
    ],
    providers: [APICallService],
    declarations: [
        MouleConfigListComponet, ModuleConfigComponet, FieldConfigComponet, FieldConfigListComponet,
        ComplianceCheckTypeCnfgComponent, AgencyKeyNameCnfgComponet,
        ComplianeCheckTypecnfgListComponent, StatutoryCheckListComponet, AgencySetupComponet, AgencyListComponet,
        FormConfigComponet, FormConfigListComponet, StatutoryCheckComponet,
        AgencyFieldMappingComponent, AgencyFormMappingComponent
        //HandBookComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    exports: [StatutoryCheckListComponet, StatutoryCheckComponet]
})
export class SuperAdminModule { }
