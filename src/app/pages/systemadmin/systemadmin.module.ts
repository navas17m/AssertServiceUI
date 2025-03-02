
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
//import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
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
import { AgencySignatureCnfgComponent } from './agencysignaturecnfg.component';
import { AreaOfficeSetupComponet } from './areaofficesetup.component';
//import { FieldConfigComponet } from './fieldconfig.component';
//import { FieldConfigListComponet } from './fieldconfiglist.component';
//import { ModuleConfigComponet } from './moduleconfig.component';
//import { MouleConfigListComponet } from './moduleconfiglist.component';
//import { ComplianceCheckTypeCnfgComponent} from './compliancechecktypecnfg.component'
//import { ComplianeCheckTypecnfgListComponent} from './compliancechecktypecnfglist.component'
//import { StatutoryCheckListComponet} from './statutorychecklist.component'
import { AreaOfficeSetupListComponet } from './areaofficesetuplist.component';
import { CarerFinancialGuidelinesComponent } from './carerfinancialguidelines.component';
import { CarerSocialWorkerMappingComponent } from './carersocialworkermapping.component';
import { ChangePasswordComponent } from './changepassword.component';
import { DropdownComponet } from './dropdown.component';
import { FormNotificationComponent } from './formnotification.component';
import { FosterCarerPoliciesComponent } from './fostercarerpolicies.component';
import { GDPRNotification } from './gdprnotification.component';
import { HandBookComponent } from './handbook.component';
import { LocalAuthorityListComponent } from './localauthoritylist.component';
//import { AgencySetupComponet } from './agencysetup.component';
//import { AgencyListComponet} from './agencylist.component'
//import { FormConfigComponet} from './formconfig.component'
//import { FormConfigListComponet} from './formconfiglist.component'
//import { AgencyFieldMappingComponent } from './agencyfieldmapping.component';
//import { AgencyFormMappingComponent } from './agencyformmapping.component';
import { LocalAuthorityComponent } from './localauthoritysetup.component';
import { LocalAuthoritySWInfoDataComponent } from './localauthorityswInfodata.component';
import { LocalAuthoritySWInfoListComponent } from './localauthorityswInfolist.component';
import { OrganizationalPoliciesComponent } from './organizationalpolicies.component';
import { PanelGuidelinesComponent } from './panelguidelines.component';
import { roleprofilecomponent } from './roleprofile.component';
import { RoleProfileListComponent } from './roleprofilelist.component';
import { SchedulerNotificationComponent } from './schedulernotification.component';
import { UserActiveDeactiveComponent } from './useractivedeactive.component';
import { UserCarerMappingComponent } from './usercarermapping.component';
import { UserChildMappingComponent } from './userchildmapping.component';
import { UserNotificationInfo } from './usernotificationinfo.component';
import { UserChangePasswordComponent } from './userpasswordchange.component';
import { UserProfileComponet } from './userprofiledata.component';
import { UserProfileListComponet } from './userprofilelist.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
//import {SelectModule} from 'ng2-select';
import{StaffAreaComponent} from './staffarea.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { CustomerDetailsComponent } from './customerdetails.component';
import { CustomerPriceDetails } from './customerpricedetails.component';
import { CustomerInvoiceDetails } from './customerinvoicedetails.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CustomerPriceDetailsList }  from './customerpricedetailslist.component';
import { AssertRegisterList } from './assertregisterlist.component';
import { AssertRegisterComponent } from './assertregister.component';
import { BudgetPlanList } from './budgetplanlist.component';
import { BudgetPlanComponent } from './budgetplan.component';
import { BudgetApprovalList } from './budgetapprovallist.component';
import { BudgetApprovalComponent } from './budgetapproval.component';
import { KeyPerformanceIndicatorList } from './keyperformanceindicatorlist.component';
import { KeyPerformanceIndicatorComponent } from './keyperformanceindicator.component';
import { WorkforceManagementList } from './workforcemanagementlist.component';
import { WorkforceManagementComponent } from './workforcemanagement.component';
import { ComplianceAndRegulatoryList } from './complianceandregulatorylist.component';
import { ComplianceAndRegulatoryComponent } from './complianceandregulatory.component';

export const routes:any = [
    { path: '', redirectTo: 'agencyformmapping/1', pathMatch: 'full' },
    { path: 'assertregisterlist/:mid', component: AssertRegisterList, data: { breadcrumb: 'تسجيل الأصول' } },
    { path: 'assertregister/:id', component: AssertRegisterComponent, data: { breadcrumb: 'تسجيل الأصول' } },
    { path: 'budgetplanlist/:mid', component: BudgetPlanList, data: { breadcrumb: 'خطة الميزاني' } },
    { path: 'budgetplan/:id', component: BudgetPlanComponent, data: { breadcrumb: 'خطة الميزانية' } },
    { path: 'budgetapprovallist/:mid', component: BudgetApprovalList, data: { breadcrumb: 'الموافقة على الميزانية' } },
    { path: 'budgetapproval/:id', component: BudgetApprovalComponent, data: { breadcrumb: 'الموافقة على الميزانية' } },
    { path: 'keyperformanceindicatorlist/:mid', component: KeyPerformanceIndicatorList, data: { breadcrumb: 'مؤشرات الأداء الرئيسية' } },
    { path: 'keyperformanceindicator/:id', component: KeyPerformanceIndicatorComponent, data: { breadcrumb: 'مؤشرات الأداء الرئيسية' } },
    { path: 'workforcemanagementlist/:mid', component: WorkforceManagementList, data: { breadcrumb: 'إدارة القوى العاملة' } },
    { path: 'workforcemanagement/:id', component: WorkforceManagementComponent, data: { breadcrumb: 'إدارة القوى العاملة' } },
    { path: 'complianceandregulatorylist/:mid', component: ComplianceAndRegulatoryList, data: { breadcrumb: 'متطلبات الامتثال والتنظيم' } },
    { path: 'complianceandregulatory/:id', component: ComplianceAndRegulatoryComponent, data: { breadcrumb: 'متطلبات الامتثال والتنظيم' } },
    
    { path: 'userprofiledata/:id', component: UserProfileComponet, data: { breadcrumb: 'User Profile' } },
    //{ path: 'agencysetup/:id', component: AgencySetupComponet, data: { breadcrumb: 'Agency Setup' } },
    //{ path: 'agencylist/:mid', component: AgencyListComponet, data: { breadcrumb: 'Agency List' } },
    { path: 'areaofficesetuplist/:mid', component: AreaOfficeSetupListComponet, data: { breadcrumb: 'Area Office Setup List' } },
    { path: 'areaofficesetup/:id', component: AreaOfficeSetupComponet, data: { breadcrumb: 'Area Office Setup' } },
    //{ path: 'formconfig/:id', component: FormConfigComponet, data: { breadcrumb: 'Form Config' } },
    //{ path: 'formconfiglist/:mid', component: FormConfigListComponet, data: { breadcrumb: 'Form Config List' } },
    //{ path: 'agencyformmapping', component: AgencyFormMappingComponent, data: { breadcrumb: 'Agency Form Mapping' } },
    //{ path: 'agencyfieldmapping/:AgencyProfileId/:FormCnfgId', component: AgencyFieldMappingComponent, data: { breadcrumb: 'Agency Field Mapping' } },
    { path: 'localauthority/:id', component: LocalAuthorityComponent, data: { breadcrumb: 'Local Authority' } },
    { path: 'localauthoritylist/:mid', component: LocalAuthorityListComponent, data: { breadcrumb: 'Local Authority List' } },
    { path: 'roleprofiledata/:Id', component: roleprofilecomponent, data: { breadcrumb: 'Role Profile' } },
    { path: 'dropdownmanagement/:mid', component: DropdownComponet, data: { breadcrumb: 'Dropdown' } },
    //{ path: 'statutorychecklist/:id/:mid', component: StatutoryCheckListComponet, data: { breadcrumb: 'Statutory Check List' } },
    //{ path: 'modulecnfglist/:mid', component: MouleConfigListComponet, data: { breadcrumb: 'Module Config' } },
    //{ path: 'fieldcnfglist/:mid', component: FieldConfigListComponet, data: { breadcrumb: 'Field Config Entry' } },
    //{ path: 'compliancechecktypecnfg/:id', component: ComplianceCheckTypeCnfgComponent, data: { breadcrumb: 'Compliance Check Type cnfg' } },
    //{ path: 'compliancechecktypelist/:mid', component: ComplianeCheckTypecnfgListComponent, data: { breadcrumb: 'Compliance Check Type List' } },
    { path: 'userprofilelist/:mid', component: UserProfileListComponet, data: { breadcrumb: 'User Profile List' } },
    //{ path: 'agencyformmapping/:mid', component: AgencyFormMappingComponent, data: { breadcrumb: 'Agency Form Mapping' } },
    //{ path: 'agencyfieldmapping/:AgencyProfileId/:FormCnfgId', component: AgencyFieldMappingComponent, data: { breadcrumb: 'Agency Field Mapping' } },
    { path: 'localauthoritysw/:Id', component: LocalAuthoritySWInfoDataComponent, data: { breadcrumb: 'Local Authority Social Worker' } },
    { path: 'localauthorityswlist/:mid', component: LocalAuthoritySWInfoListComponent, data: { breadcrumb: 'Local Authority Social Worker List' } },
    { path: 'roleprofilelist/:mid', component: RoleProfileListComponent, data: { breadcrumb: 'Role Profile' } },
    { path: 'usercarermapping/:mid', component: UserCarerMappingComponent, data: { breadcrumb: 'تسجيل الأصول' } },
    { path: 'carersocialworkermapping/:mid', component: CarerSocialWorkerMappingComponent, data: { breadcrumb: 'Carer SocialWorker Mapping' } },
    { path: 'userchildmapping/:mid', component: UserChildMappingComponent, data: { breadcrumb: 'User Child Mapping' } },
    { path: 'formnotification/:mid', component: FormNotificationComponent, data: { breadcrumb: 'Form Notification' } },
    { path: 'agencysignature/:mid', component: AgencySignatureCnfgComponent, data: { breadcrumb: 'Agency Signature' } },
    { path: 'schedulernotification/:mid', component: SchedulerNotificationComponent, data: { breadcrumb: 'Scheduler Notification' } },
    { path: 'changepassword', component: ChangePasswordComponent, data: { breadcrumb: 'Change Password' } },
    { path: 'useractivedeactive/:uid', component: UserActiveDeactiveComponent, data: { breadcrumb: 'User Details' } },
    { path: 'userpasswordchange/:uid', component: UserChangePasswordComponent, data: { breadcrumb: 'Change Passsword' } },
    { path: 'policiesguidelines/:mid', component: FosterCarerPoliciesComponent, data: { breadcrumb: 'Policies & Guidelines' } },
	 { path: 'usernotification', component: UserNotificationInfo, data: { breadcrumb: 'User Notification' } },
	  { path: 'gdprnotification/:mid', component: GDPRNotification, data: { breadcrumb: 'GDPR Notification' } },
    //{ path: 'carerfinancialguidelines/:mid', component: CarerFinancialGuidelinesComponent, data: { breadcrumb: 'Carer Financial Guidelines' } },
    //{ path: 'organizationalpolicies/:mid', component: OrganizationalPoliciesComponent, data: { breadcrumb: 'Organisational Policies' } },
    //{ path: 'panelguidelines/:mid', component: PanelGuidelinesComponent, data: { breadcrumb: 'Panel Guidelines' } },
    //{ path: 'handbook/:mid', component: HandBookComponent, data: { breadcrumb: 'Hand Book' } },
    { path: 'staffarea/:mid', component: StaffAreaComponent, data: { breadcrumb: 'Staff Area' } },
    { path: 'customerdetails/:mid', component: CustomerDetailsComponent, data: { breadcrumb: 'Card Details' } },
    { path: 'customerpricedetails/:id', component: CustomerPriceDetails, data: { breadcrumb: 'Customer Price Details' } },
    { path: 'customerinvoicedetails/:mid', component: CustomerInvoiceDetails, data: { breadcrumb: 'Invoice Details' } },
    { path: 'customerpricedetailslist/:mid', component: CustomerPriceDetailsList, data: { breadcrumb: 'Customer Price Details' } },
    { path: 'customerpricedetailslist/:mid', component: CustomerPriceDetailsList, data: { breadcrumb: 'Customer Price Details' } },
];

@NgModule({
    imports: [PipesCustomModule, HeaderModule, DynamicModule, PersonalInfoModule, ContactInfoModule,
        CommonModule, UploadDocumentsModule, //MultiselectDropdownModule,
        CommonInfoModule,
        PipesModule, //SelectModule,
        DirectivesModule, FormsModule, ReactiveFormsModule,// DataTableModule,
        RouterModule.forChild(routes),
        NgxDatatableModule,MultiSelectModule,NgSelectModule
    ],
    providers: [APICallService],
    declarations: [ChangePasswordComponent, UserActiveDeactiveComponent, UserChangePasswordComponent,
         AreaOfficeSetupListComponet,
        UserProfileComponet, UserProfileListComponet,
        AreaOfficeSetupComponet,
        roleprofilecomponent, RoleProfileListComponent, AgencySignatureCnfgComponent
        , LocalAuthorityComponent, LocalAuthorityListComponent, LocalAuthoritySWInfoDataComponent, LocalAuthoritySWInfoListComponent,
        DropdownComponet, UserCarerMappingComponent, CarerSocialWorkerMappingComponent, UserChildMappingComponent, FormNotificationComponent,
        SchedulerNotificationComponent, HandBookComponent, CarerFinancialGuidelinesComponent, FosterCarerPoliciesComponent,
        OrganizationalPoliciesComponent, PanelGuidelinesComponent,UserNotificationInfo,GDPRNotification,CustomerDetailsComponent,
        StaffAreaComponent,CustomerPriceDetails,CustomerInvoiceDetails,CustomerPriceDetailsList,
        AssertRegisterList,AssertRegisterComponent,BudgetPlanComponent,BudgetPlanList,BudgetApprovalList,BudgetApprovalComponent,
        KeyPerformanceIndicatorList,KeyPerformanceIndicatorComponent,WorkforceManagementList,WorkforceManagementComponent,
        ComplianceAndRegulatoryList,ComplianceAndRegulatoryComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    exports: []
})
export class SystemAdminModule { }
