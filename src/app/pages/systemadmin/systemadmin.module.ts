
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
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
//import {SelectModule} from 'ng2-select';
import { MultiSelectModule } from 'primeng/multiselect';
import { NgSelectModule } from '@ng-select/ng-select';
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
import { MaintenanceActivityList } from './maintenanceactivitylist.component';
import { MaintenanceActivityComponent } from './maintenanceactivity.component';
import { RiskManagementandContingencyPlanList } from './riskmanagementandcontingencyplanlist.component';
import { RiskManagementandContingencyPlanComponent } from './riskmanagementandcontingencyplan.component';
import { QualityPlanandContinuousImprovementList } from './qualityplanandcontinuousimprovementlist.component';
import { QualityPlanandContinuousImprovementComponent } from './qualityplanandcontinuousimprovement.component';
import { AssertReport } from './assertreport.component';
import { AssertReports } from './assertreports.component';

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
    { path: 'maintenanceactivity/:id', component: MaintenanceActivityComponent, data: { breadcrumb: 'نشاط الصيانة' } },
    { path: 'maintenanceactivitylist/:mid', component: MaintenanceActivityList, data: { breadcrumb: 'نشاط الصيانة' } },
    { path: 'riskmanagementandcontingencyplan/:id', component: RiskManagementandContingencyPlanComponent, data: { breadcrumb: 'إدارة المخاطر وخطط الطوارئ' } },
    { path: 'riskmanagementandcontingencyplanlist/:mid', component: RiskManagementandContingencyPlanList, data: { breadcrumb: 'إدارة المخاطر وخطط الطوارئ' } },
    { path: 'qualityplanandcontinuousimprovement/:id', component: QualityPlanandContinuousImprovementComponent, data: { breadcrumb: 'خطة الجودة والتحسين المستمر' } },
    { path: 'qualityplanandcontinuousimprovementlist/:mid', component: QualityPlanandContinuousImprovementList, data: { breadcrumb: 'خطة الجودة والتحسين المستمر' } },
    { path: 'assertreport', component: AssertReport, data: { breadcrumb: 'تقرير التأكيد' } },
    { path: 'assertreports', component: AssertReports, data: { breadcrumb: 'تقرير التأكيد' } },
    
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
    declarations: [AssertRegisterList,AssertRegisterComponent,BudgetPlanComponent,BudgetPlanList,BudgetApprovalList,BudgetApprovalComponent,
        KeyPerformanceIndicatorList,KeyPerformanceIndicatorComponent,WorkforceManagementList,WorkforceManagementComponent,
        ComplianceAndRegulatoryList,ComplianceAndRegulatoryComponent,MaintenanceActivityList,MaintenanceActivityComponent,
        RiskManagementandContingencyPlanComponent,RiskManagementandContingencyPlanList,AssertReport,
        QualityPlanandContinuousImprovementComponent,QualityPlanandContinuousImprovementList,AssertReports
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    exports: []
})
export class SystemAdminModule { }
