
import { CommonModule } from '@angular/common';
//import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
//import { DataTableModule } from "angular2-datatable";
import { NgSelectModule } from '@ng-select/ng-select';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { SimpleTimer } from 'ng2-simple-timer';
import { DirectivesModule } from '../../theme/directives/directives.module';
import { CommonInfoModule } from '../common/common.module';
import { ContactInfoModule } from '../contact/contactinfo.module';
import { DynamicModule } from '../dynamic/dynamic.module';
import { FamilyInfoModule } from '../family/family.module';
//import { Ng2LoadingSpinnerModule } from 'ng2-loading-spinner';
import { NgxSpinnerModule } from "ngx-spinner";
//Header Module
import { HeaderModule } from '../headers/header.module';
import { ListBoxUCComponet } from '../listbox/listbox.component';
import { PersonalInfoModule } from '../personalinfo/personalinfo.module';
import { PipesCustomModule } from '../pipes/pipes.module';
import { APICallService } from '../services/apicallservice.service';
import { SuperAdminModule } from '../superadmin/superadmin.module';
//import { Tab } from '../tabControl/tab';
//import { Tabs } from '../tabControl/tabs';
import { UploadDocumentsModule } from '../uploaddocument/uploaddocuments.module';
import { ApplicantListComponet } from './applicantlist.component';
import { ApplicantSelectedComponet } from './applicantselected.component';
import { ApplicationFormComponet } from './applicationform.component';
import { ApplicationFormNewComponent } from './applicationformnew.component';
import { SelectedCarerComponet } from './approvedcarerselected.component';
import { ApprovedPanelMinutesDataComponent } from './approvedpanelminutesdata.component';
import { ApprovedPanelMinutesListComponent } from './approvedpanelminuteslist.component';
import { BackupCarerComponet } from './backupcarer.component';
import { BackupCarerFamilyComponet } from './backupcarerfamily.component';
import { BackupCarerListComponet } from './backupcarerlist.component';
import { CarerAddressHistoryDataComponent } from './careraddresshistorydata.component';
import { CarerAddressHistoryListComponent } from './careraddresshistorylist.component';
import { CarerApprovalPreferenceComponet } from './carerapprovalpreference.component';
import { CarerCheckListComponet } from './carerchecklist.component';
import { CarerCheckListDataComponet } from './carerchecklistdata.component';
import { CarerDayLogJournalData } from './carerdaylogjournaldata.component';
import { CarerDayLogJournalListComponent } from './carerdaylogjournallist.component';
import { CarerEmployerInfoComponet } from './careremployersinfo.component';
import { CarerExPartnerinfoComponet } from './carerexpartnerInfo.component';
import { CarerFamilyComponet } from './carerfamily.component';
import { CarerFireEscapePlanDataComponent } from './carerfireescapeplandata.component';
import { CarerFireEscapePlanListComponent } from './carerfireescapeplanlist.component';
import { CarerFormFAddendumComponent } from './carerformfaddendum.component';
import { CarerFormFAssessmentAppointmentDataComponent } from './carerformfassessmentappointmentdata.component';
import { CarerFormFAssessmentAppointmentListComponent } from './carerformfassessmentappointmentlist.component';
import { CarerHealthAndSafetyDataComponent } from './carerhealthandsafetydata.component';
import { CarerHealthAndSafetyInfoFCSignatureComponet } from './carerhealthandsafetyfcsignature.component';
import { CarerHealthAndSafetyListComponent } from './carerhealthandsafetylist.component';
import { CarerInitialHomeVisitComponent } from './carerinitialhomevisiti.component';
import { CarerManagementDecisionDataComponent } from './carermanagementdecisiondata.component';
import { CarerManagementDecisionListComponent } from './carermanagementdecisionlist.component';
import { CarerPersonalDetailsComponet } from './carerpersonaldetails.component';
import { CarerPetQuestionnaireData } from './carerpetquestionnairedata.component';
import { CarerPetQuestionnaireListComponent } from './carerpetquestionnairelist.component';
//Slider
//import {SliderComponent} from '../slider/slider.component'
//import { Ng2SliderComponent } from 'ng2-slider-component/ng2-slider.component';
//import { SlideAbleDirective } from 'ng2-slideable-directive/slideable.directive';
//import { Ng2StyledDirective } from 'ng2-styled-directive/ng2-styled.directive';
import { CarerReferencesComponet } from './carerreferences.component';
import {CarerAddressHistoryComponent} from './careraddresshistory.component';
import { CarerSnapshotComponet } from './carersnapshot.component';
import { CarerStatusChangeComponet } from './carerstatuschange.component';
import { CarerTrainingProfileDataComponent } from './carertrainingprofiledata.component';
import { CarerTrainingProfileListComponent } from './carertrainingprofilelist.component';
import { InitialEnquiryComponet } from './initialenquiry.component';
import { RedirectComponent } from './redirect.component';
import { SaferCarePolicyComponent } from './safercarepolicy.component';
import { SaferCarePolicyFCSignatureComponent } from './safercarepolicyfcsignature.component';
import { SaferCarePolicyListComponent } from './safercarepolicylist.component';
import { StatutoryCheckApplicantComponet } from './statutorycheck.component';
import { SwapCarerComponent } from './swapcarer.component';
import { UploadDocuments } from './uploaddocument.component';
import { UploadFormFDocuments } from './uploadformfdocuments.component';
import { FCUploadFormFRedirectComponent } from './uploadformfredirect.component';

import { MultiSelectModule } from 'primeng/multiselect';
import { AssessorTrackDataComponent } from './assessortrackerdata.component';
import { AssessorTrackerListComponent } from './assessortrackerlist.component';
import { CarerinitialcheckComponent } from './carerinitialcheck.component';
import { CarerSnapshotNewComponet } from './carersnapshotnew.component';
import { CarerTrainingProfileFCSignatureComponet } from './carertrainingprofilefcsignature.component';
import { ProspectiveChecksComponent } from './prospectivechecks.component';
import { LaddaModule } from 'angular2-ladda';
import { DisabilityGetAllResolver } from '../child/disabilitygetallresolver.service';import { BackupCarerGridComponent } from './backupcarergrid.component';
import { CarerRiskAssessmentDataComponent } from './carerriskassessmentdata.component';
import { CarerRiskAssessmentListComponent } from './carerriskassessmentlist.component';
export const routes: Routes = [
    { path: '', redirectTo: 'applicantlist/13', pathMatch: 'full' },
    { path: 'applicantlist', component: ApplicantListComponet, data: { breadcrumb: 'Applicant List' } },
    {
        path: 'applicationform', component: ApplicationFormComponet, data: { breadcrumb: 'Application Form' },
        resolve: {
            disability: DisabilityGetAllResolver,
        }
    },
    { path: 'applicationformnew', component: ApplicationFormNewComponent, data: { breadcrumb: 'Application Form New' } },
    { path: 'carerapprove', component: CarerApprovalPreferenceComponet, data: { breadcrumb: 'Carer Approve' } },
    { path: 'carerstatuschange', component: CarerStatusChangeComponet, data: { breadcrumb: 'Carer Status Change' } },
    { path: 'carerfamily', component: CarerFamilyComponet, data: { breadcrumb: 'Carer Family' } },
    { path: 'backupcarerlist', component: BackupCarerListComponet, data: { breadcrumb: 'Backup Carer List' } },
    { path: 'backupcarer/:id/:SeqNo/:mid/:drSeqNo', component: BackupCarerComponet, data: { breadcrumb: 'Backup Carer' } },
    { path: 'backupcarerfamily/:Id/:mid', component: BackupCarerFamilyComponet, data: { breadcrumb: 'Backup Carer Family' } },
    {
        path: 'initialenquiry/:id', component: InitialEnquiryComponet, data: { breadcrumb: 'Initial Enquiry' },
        resolve: {
            disability: DisabilityGetAllResolver,
        }
    },
    {
        path: 'carerinitialhomevisit', component: CarerInitialHomeVisitComponent, data: { breadcrumb: 'Carer Initial Home Visit' },
        resolve: {
            disability: DisabilityGetAllResolver,
        }
    },
    { path: 'personaldetails', component: CarerPersonalDetailsComponet, data: { breadcrumb: 'Personal Details' } },
    { path: 'carerdaylogjournallist', component: CarerDayLogJournalListComponent, data: { breadcrumb: 'Day Log/Journal Entries ' } },
    { path: 'carerdaylogjournaldata/:Id', component: CarerDayLogJournalData, data: { breadcrumb: 'Day Log/Journal Entry' } },
    { path: 'carerdaylogjournaldata/:Id/:mid', component: CarerDayLogJournalData, data: { breadcrumb: 'Day Log/Journal Entry' } },
    { path: 'carerdaylogjournaldata/:Id/:mid/:apage', component: CarerDayLogJournalData, data: { breadcrumb: 'Day Log/Journal Entry' } },
    { path: 'carerpetquestionnairelist', component: CarerPetQuestionnaireListComponent, data: { breadcrumb: 'Carer Pet Questionnaires ' } },
    { path: 'carerpetquestionnairedata/:Id/:mid', component: CarerPetQuestionnaireData, data: { breadcrumb: 'Carer Pet Questionnaire' } },
    { path: 'carerhealthandsafetylist', component: CarerHealthAndSafetyListComponent, data: { breadcrumb: 'Carer Health And Safety List' } },
    { path: 'carerhealthandsafetydata/:Id/:mid', component: CarerHealthAndSafetyDataComponent, data: { breadcrumb: 'Carer Health And Safety' } },
    { path: 'swapcarer', component: SwapCarerComponent, data: { breadcrumb: 'Swap Carer' } },
    { path: 'carertrainingprofilelist', component: CarerTrainingProfileListComponent, data: { breadcrumb: 'Carer Training Profile List' } },
    { path: 'carertrainingprofiledata/:Id/:mid', component: CarerTrainingProfileDataComponent, data: { breadcrumb: 'Carer Training Profile' } },
    { path: 'carertrainingprofiledata/:Id/:mid/:apage', component: CarerTrainingProfileDataComponent, data: { breadcrumb: 'Carer Training Profile' } },

    { path: 'carertrainingprofiledata/:Id/:mid/:apage/:ppdp', component: CarerTrainingProfileDataComponent, data: { breadcrumb: 'Carer Training Profile' } },
    //return
    { path: 'applicantlist/:mid/:rid', component: ApplicantListComponet, data: { breadcrumb: 'Applicant List' } },
    { path: 'redirect/:Id/:mid', component: RedirectComponent, data: { breadcrumb: 'Carer Approve' } },
    { path: 'carerapprove/:mid', component: CarerApprovalPreferenceComponet, data: { breadcrumb: 'Carer Approve' } },
    {
        path: 'carerapplication/:mid', component: ApplicationFormComponet, data: { breadcrumb: 'Application Form' },
        resolve: {
            disability: DisabilityGetAllResolver,
        }
    },
    { path: 'carerapplicationnew/:mid', component: ApplicationFormNewComponent, data: { breadcrumb: 'Application Form New' } },
    { path: 'applicantlist/:mid', component: ApplicantListComponet, data: { breadcrumb: 'Applicant List' } },
    { path: 'backupcarerlist/:mid', component: BackupCarerListComponet, data: { breadcrumb: 'Backup Carer List' } },
    { path: 'carerfamily/:mid', component: CarerFamilyComponet, data: { breadcrumb: 'Carer Family' } },
    { path: 'carerdaylogjournallist/:mid', component: CarerDayLogJournalListComponent, data: { breadcrumb: 'Day Log/Journal Entries ' } },
    { path: 'carerdaylogjournallist/:mid/:apage', component: CarerDayLogJournalListComponent, data: { breadcrumb: 'Day Log/Journal Entries ' } },
    { path: 'carerhealthandsafetylist/:mid', component: CarerHealthAndSafetyListComponent, data: { breadcrumb: 'Carer Health And Safety List' } },
    {
        path: 'initialenquiry/:id/:mid', component: InitialEnquiryComponet, data: { breadcrumb: 'Initial Enquiry' },
        resolve: {
            disability: DisabilityGetAllResolver,
        }
    },
    {
        path: 'carerinitialhomevisit/:mid', component: CarerInitialHomeVisitComponent, data: { breadcrumb: 'Carer Initial Home Visit' },
        resolve: {
            disability: DisabilityGetAllResolver,
        }
    },
    {
        path: 'personaldetails/:mid', component: CarerPersonalDetailsComponet, data: { breadcrumb: 'Personal Details' },
        resolve: {
            disability: DisabilityGetAllResolver,
        }
    },
    { path: 'carerpetquestionnairelist/:mid', component: CarerPetQuestionnaireListComponent, data: { breadcrumb: 'Carer Pet Questionnaires ' } },
    { path: 'safercarepolicylist/:mid', component: SaferCarePolicyListComponent, data: { breadcrumb: 'Safer Care Policy List' } },
    { path: 'safercarepolicy/:id/:mid', component: SaferCarePolicyComponent, data: { breadcrumb: 'Safer Care Policy' } },

    { path: 'safercarepolicylist/:mid/:apage', component: SaferCarePolicyListComponent, data: { breadcrumb: 'Safer Care Policy List' } },
    { path: 'safercarepolicy/:id/:mid/:apage', component: SaferCarePolicyComponent, data: { breadcrumb: 'Safer Care Policy' } },
    { path: 'carertrainingprofilelist/:mid', component: CarerTrainingProfileListComponent, data: { breadcrumb: 'Training Profile List' } },

    { path: 'carertrainingprofilelist/:mid/:apage', component: CarerTrainingProfileListComponent, data: { breadcrumb: 'Training Profile List' } },

    { path: 'swapcarer/:mid', component: SwapCarerComponent, data: { breadcrumb: 'Swap Carer' } },
    { path: 'carerstatuschange/:mid', component: CarerStatusChangeComponet, data: { breadcrumb: 'Carer Status Change' } },
    { path: 'carerformfaddendum/:mid', component: CarerFormFAddendumComponent, data: { breadcrumb: 'Addendum To Form F' } },
    { path: 'assessmentappointmentlist/:mid', component: CarerFormFAssessmentAppointmentListComponent, data: { breadcrumb: 'Assessment Appointment List' } },
    { path: 'assessmentappointmentdata/:Id/:mid', component: CarerFormFAssessmentAppointmentDataComponent, data: { breadcrumb: 'Assessment Appointment' } },
    { path: 'uploadformfdocuments/:mid', component: UploadFormFDocuments, data: { breadcrumb: 'Upload Form F' } },
    { path: 'recruitmentuploaddocuments/:mid', component: UploadDocuments, data: { breadcrumb: 'Upload Documents' } },
    { path: 'statutorycheck/:id/:mid', component: StatutoryCheckApplicantComponet, data: { breadcrumb: 'Statutory Check' } },
    { path: 'carerchecklist/:mid', component: CarerCheckListComponet, data: { breadcrumb: 'Carer Check List' } },
    //ApprovedPanelMinutesListComponent, ApprovedPanelMinutesDataComponent
    { path: 'apmdata/:id/:mid', component: ApprovedPanelMinutesDataComponent, data: { breadcrumb: 'Approved Panel Minutes' } },
    { path: 'apmlist/:mid', component: ApprovedPanelMinutesListComponent, data: { breadcrumb: 'Approved Panel Minutes List' } },
    { path: 'careraddresshistory/:id/:mid', component: CarerAddressHistoryDataComponent, data: { breadcrumb: 'Carer Address History' } },
    { path: 'careraddresshistorylist/:mid', component: CarerAddressHistoryListComponent, data: { breadcrumb: 'Carer Address History' } },
    { path: 'carermanagementdecisiondata/:Id/:mid', component: CarerManagementDecisionDataComponent, data: { breadcrumb: 'Management Decision' } },
    { path: 'carermanagementdecisionlist/:mid', component: CarerManagementDecisionListComponent, data: { breadcrumb: 'Management Decision List' } },
    { path: 'fireescapeplandata/:Id/:mid', component: CarerFireEscapePlanDataComponent, data: { breadcrumb: 'Fire Escape Plan' } },
    { path: 'fireescapeplanlist/:mid', component: CarerFireEscapePlanListComponent, data: { breadcrumb: 'Fire Escape Plan List' } },
    { path: 'carerchecklistdata/:Id/:mid', component: CarerCheckListDataComponet, data: { breadcrumb: 'Carer Check List' } },
    { path: 'healthfcsignature/:sno/:mid', component: CarerHealthAndSafetyInfoFCSignatureComponet, data: { breadcrumb: 'Signature' } },
    { path: 'safecarefcsignature/:sno/:mid', component: SaferCarePolicyFCSignatureComponent, data: { breadcrumb: 'Signature' } },

    { path: 'initialcheck/:mid', component: CarerinitialcheckComponent, data: { breadcrumb: 'Initial Check' } },
    { path: 'prospectivechecks/:mid', component: ProspectiveChecksComponent, data: { breadcrumb: 'Prospective Checks' } },
    { path: 'assessortrackerlist/:mid', component: AssessorTrackerListComponent, data: { breadcrumb: 'Assessor Tracker List' } },
    { path: 'assessortrackerdata/:id/:mid', component: AssessorTrackDataComponent, data: { breadcrumb: 'Assessor Tracker' } },
    { path: 'carersnapshot/:mid', component: CarerSnapshotNewComponet, data: { breadcrumb: 'Carer Snapshot' } },


    { path: 'trainingprofilefcsignature/:sno/:mid', component: CarerTrainingProfileFCSignatureComponet, data: { breadcrumb: 'Signature' } },
    { path: 'riskassessmentlist/:mid', component: CarerRiskAssessmentListComponent, data: { breadcrumb: 'Risk Assessment List' } },
    { path: 'riskassessmentdata/:Id/:mid', component: CarerRiskAssessmentDataComponent, data: { breadcrumb: 'Risk Assessment' } },

];

@NgModule({
    imports: [DynamicModule, UploadDocumentsModule, CommonInfoModule, HttpClientModule,FamilyInfoModule,PipesCustomModule, PersonalInfoModule, ContactInfoModule,
        CommonModule, DirectivesModule, HeaderModule, SuperAdminModule, FormsModule, ReactiveFormsModule,LaddaModule,
        //DataTableModule,
        NgSelectModule,
        //Ng2LoadingSpinnerModule.forRoot({}),
        NgxSpinnerModule, MultiSelectModule,
        NgCircleProgressModule.forRoot({
            // set defaults here
            radius: 100,
            outerStrokeWidth: 16,
            innerStrokeWidth: 8,
            outerStrokeColor: "#78C000",
            innerStrokeColor: "#C7E596",
            animationDuration: 300,
          }),
         RouterModule.forChild(routes)
    ],
    declarations: [BackupCarerGridComponent,CarerAddressHistoryComponent,CarerReferencesComponet, CarerSnapshotComponet, CarerExPartnerinfoComponet, CarerEmployerInfoComponet,// Tab, Tabs,
         ListBoxUCComponet,
        ApplicantListComponet, RedirectComponent, ApplicationFormComponet,ApplicationFormNewComponent, CarerApprovalPreferenceComponet, CarerStatusChangeComponet,
        ApplicantSelectedComponet, SelectedCarerComponet, BackupCarerFamilyComponet, BackupCarerListComponet, CarerFamilyComponet, BackupCarerComponet, SaferCarePolicyListComponent,
        SaferCarePolicyComponent, InitialEnquiryComponet, CarerInitialHomeVisitComponent, CarerPersonalDetailsComponet, SwapCarerComponent,
        CarerDayLogJournalData, CarerDayLogJournalListComponent,
         CarerPetQuestionnaireListComponent, CarerPetQuestionnaireData,
        CarerHealthAndSafetyListComponent, CarerHealthAndSafetyDataComponent, CarerTrainingProfileListComponent, CarerTrainingProfileDataComponent,
        CarerFormFAddendumComponent, CarerFormFAssessmentAppointmentListComponent, CarerFormFAssessmentAppointmentDataComponent,
        UploadFormFDocuments, UploadDocuments, FCUploadFormFRedirectComponent, StatutoryCheckApplicantComponet, CarerCheckListComponet,
        ApprovedPanelMinutesListComponent, ApprovedPanelMinutesDataComponent, CarerAddressHistoryListComponent, CarerAddressHistoryDataComponent,
        CarerManagementDecisionListComponent, CarerManagementDecisionDataComponent,
        CarerFireEscapePlanListComponent, CarerFireEscapePlanDataComponent, CarerCheckListDataComponet, CarerHealthAndSafetyInfoFCSignatureComponet,
        SaferCarePolicyFCSignatureComponent,CarerinitialcheckComponent,ProspectiveChecksComponent,AssessorTrackerListComponent,
        AssessorTrackDataComponent,CarerSnapshotNewComponet,CarerTrainingProfileFCSignatureComponet,CarerRiskAssessmentListComponent,CarerRiskAssessmentDataComponent

    ],
    providers: [SimpleTimer, APICallService,DisabilityGetAllResolver],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    exports: [ApplicationFormComponet, BackupCarerListComponet, BackupCarerComponet, SelectedCarerComponet,
        CarerPersonalDetailsComponet, InitialEnquiryComponet, CarerInitialHomeVisitComponent,
        CarerPetQuestionnaireListComponent, CarerPetQuestionnaireData, CarerHealthAndSafetyListComponent, CarerHealthAndSafetyDataComponent, CarerTrainingProfileListComponent, CarerTrainingProfileDataComponent,
        CarerPersonalDetailsComponet, InitialEnquiryComponet, CarerInitialHomeVisitComponent,
        CarerFormFAddendumComponent, CarerFormFAssessmentAppointmentListComponent, CarerFormFAssessmentAppointmentDataComponent, UploadFormFDocuments, UploadDocuments, CarerDayLogJournalListComponent, CarerDayLogJournalData, SaferCarePolicyListComponent, SaferCarePolicyComponent,
        SwapCarerComponent, CarerSnapshotComponet, CarerCheckListComponet, ApprovedPanelMinutesListComponent, ApprovedPanelMinutesDataComponent,
        CarerAddressHistoryListComponent, CarerAddressHistoryDataComponent,
        CarerManagementDecisionListComponent, CarerManagementDecisionDataComponent,
        CarerFireEscapePlanListComponent, CarerFireEscapePlanDataComponent, CarerHealthAndSafetyInfoFCSignatureComponet,
        SaferCarePolicyFCSignatureComponent,CarerinitialcheckComponent,ProspectiveChecksComponent,
        AssessorTrackerListComponent,AssessorTrackDataComponent,CarerSnapshotNewComponet,CarerTrainingProfileFCSignatureComponet

        ]
})

export class RecruitmentModule { }
