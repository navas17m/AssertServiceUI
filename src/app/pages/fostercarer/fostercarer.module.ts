
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { SimpleTimer } from 'ng2-simple-timer';
import { DirectivesModule } from '../../theme/directives/directives.module';
import { CommonInfoModule } from '../common/common.module';
import { ContactInfoModule } from '../contact/contactinfo.module';
import { DynamicModule } from '../dynamic/dynamic.module';
import { FamilyInfoModule } from '../family/family.module';
import { HeaderModule } from '../headers/header.module';
import { PersonalInfoModule } from '../personalinfo/personalinfo.module';
import { PipesCustomModule } from '../pipes/pipes.module';
import { RecruitmentModule } from '../recruitment/recruitment.module';
import { SuperAdminModule } from '../superadmin/superadmin.module';
//Doc
import { UploadDocumentsModule } from '../uploaddocument/uploaddocuments.module';
import { ADMApprovedMinutesComponent } from './admapprovedminutes.component';
import { AnnualReviewComponet } from './annualreview.component';
import { AnnualReviewApprovalRecommendationComponet } from './annualreviewappprovalrecom.component';
import { CarerAnnualReviewFCSignatureComponet } from './annualreviewfcsignature.component';
import { AnnualReviewListComponet } from './annualreviewlist.component';
import { AnnualReviewPlacementInfoComponent } from './annualreviewplacementinfo.component';
import { ApprovalMatchingConsiderationComponet } from './approvalmatching.component';
import { ApprovedCarerListComponet } from './approvedcarerlist.component';
import { ApplicantSelectedComponet } from './approvedcarerselected.component';
import { FCApprovedPanelMinutesData } from './approvedpanelminutesdata.component';
import { FCApprovedPanelMinutesList } from './approvedpanelminuteslist.component';
import { FCBackupCarerDataComponet } from './backupcarer';
import { FCBackupCarerListComponet } from './backupcarerlist.component';
import { FCCarerAddressHistoryDataComponent } from './careraddresshistorydata.component';
import { FCCarerAddressHistoryListComponent } from './careraddresshistorylist.component';
import { CarerAllegationInfoDataComponent } from './carerallegationinfodata.component';
import { CarerAllegationInfoListComponent } from './carerallegationinfolist.component';
import { CarerApplicationFormComponet } from './carerapplication';
import { CarerApproveComponet } from './carerapprove.component';
import { FCCarerCheckListComponent } from './carerchecklist.component';
import { CarerChronologyofEventComponet } from './carerchronologyofevent.component';
import { CarerComplaintInfoDataComponent } from './carercomplaintinfodata.component';
import { CarerComplaintInfoListComponent } from './carercomplaintinfolist.component';
import { CarerComplementsData } from './carercomplementsdata.component';
import { CarerComplementsListComponent } from './carercomplementslist.component';
import { FCDaylogjournalDataComponent } from './carerdaylogjournaldata.component';
import { FCDaylogjournalListComponent } from './carerdaylogjournallist.component';
import { FCCarerFamilyComponet } from './carerfamily';
import { FCCarerFireEscapePlanDataComponent } from './carerfireescapeplandata.component';
import { FCCarerFireEscapePlanListComponent } from './carerfireescapeplanlist.component';
import { FCFormFAddendumComponent } from './carerformfaddendum.component';
import { FCFormFAssessmentAppointmentDataComponent } from './carerformfassessmentappointmentdata.component';
import { FCFormFAssessmentAppointmentListComponent } from './carerformfassessmentappointmentlist.component';
import { FCHealthAndSafetyDataComponent } from './carerhealthandsafetydata.component';
import { FCHealthAndSafetyListComponent } from './carerhealthandsafetylist.component';
import { CarerImmunisationInfoComponent } from './carerimmunisationinfodata.component';
import { CarerImmunisationInfoListComponent } from './carerimmunisationinfolist.component';
import { CarerIncidentInfoDataComponent } from './carerincidentdata.component';
import { CarerIncidentInfoListComponent } from './carerincidentlist.component';
import { FCInitialHomeVisitComponet } from './carerinitialhomevisit.component';
import { FCCarerManagementDecisionDataComponent } from './carermanagementdecisiondata.component';
import { FCCarerManagementDecisionListComponent } from './carermanagementdecisionlist.component';
import { CarerOOHReportData } from './careroohreportdata.component';
import { CarerOOHReportListComponent } from './careroohreportlist.component';
import { FCPetQuestionnaireDataComponent } from './carerpetquestionnairedata.component';
import { FCPetQuestionnaireListComponent } from './carerpetquestionnairelist.component';
import { CarerPlacementRefusalInfoDataComponent } from './carerplacementrefusalinfodata.component';
import { CarerPlacementRefusalInfoListComponent } from './carerplacementrefusalinfolist.component';
import { CarerSHVNonPlacementData } from './carershvnonplacementdata.component';
import { CarerSHVNonPlacementListComponent } from './carershvnonplacementlist.component';
import { CarerStatusChangeComponet } from './carerstatuschange.component';
import { CarerSupervisoryHomeVisitDataComponent } from './carersupervisoryhomevisitdata.component';
import { CarerSupervisoryHomeVisitFCSignatureComponet } from './carersupervisoryhomevisitfcsignature.component';
import { CarerSupervisoryHomeVisitListComponent } from './carersupervisoryhomevisitlist.component';
import { FCTrainingProfileDataComponent } from './carertrainingprofiledata.component';
import { FCTrainingProfileListComponent } from './carertrainingprofilelist.component';
import { CarerTransferClosingSummaryDataComponent } from './carertransferclosingsummarydata.component';
import { CarerTransferClosingSummaryListComponent } from './carertransferclosingsummarylist.component';
import { CarerUnannouncedHomeVisitDataComponent } from './carerunannouncedhomevisitdata.component';
import { CarerUnannouncedHomeVisitFCSignatureComponet } from './carerunannouncedhomevisitfcsignature.component';
import { CarerUnannouncedHomeVisitListComponent } from './carerunannouncedhomevisitlist.component';
import { ChildSupervisoryHomeVisitDataComponent } from './childsupervisoryhomevisitdata.component';
import { ChildSHVFCSignatureComponents } from './childsupervisoryhomevisitfcsignature.component';
import { ChildSupervisoryHomeVisitListComponent } from './childsupervisoryhomevisitlist.component';
import { CarerFamilyGuideComponent } from './familyguidedata.component';
import { CarerHolidayDetailsDataComponent } from './holidaydetailsdata.component.template';
import { CarerHolidayDetailsListComponent } from './holidaydetailslist.component';
import { FCInitialEnquiryComponet } from './initialenquiry.component';
import { CarerIRMDeterminationDataComponent } from './irmdeterminationdata.component';
import { CarerIRMDeterminationListComponent } from './irmdeterminationlist.component';
import { FCPersonalDetailsComponet } from './personaldetails';
import { PlacementDischargehistory } from './placementdischargehistory.component';
import { PlacementDischargeHistoryViewComponet } from './placementdischargehistoryview.component';
import { PlacementReviewComponet } from './placementreview.component';
import { FCRedirectComponent } from './redirect.component';
import { FCSafecarePolicyDataComponent } from './safecarepolicydata.component';
import { FCSafecarePolicyListComponent } from './safecarepolicylist.component';
import { StatutoryCheckCarerComponet } from './statutorycheck.component';
import { FCSwapCarerComponent } from './swapcarer.component';
import { FCUploadDocument } from './uploaddocuments.component';
import { FCUploadFormFComponent } from './uploadformfredirect.component';
import { FCChildMatchingChecklistDataComponent } from './childmatchingcheckdata.component';
import { FCChildMatchingCheckListComponent } from './childmatchingchecklist.component';
import { FosterCarerPoliciesComponent } from './fostercarerpolicieslist.component';
import { AnnualReviewRainbowDataComponet } from './annualreviewrainbowdata.component';
import { CarerAnnualReviewRainbowFCSignatureComponet } from './annualreviewrainbowfcsignature.component';
import { AnnualReviewRainbowListComponet } from './annualreviewrainbowlist.component';
import { CarerdisclosureDataComponent } from './carerdisclosuredata.component';
import { carerdisclosureFCSignatureComponet } from './carerdisclosurefcsignature.component';
import { carerdisclosureListComponent } from './carerdisclosurelist.component';
import { CarerOfstedNotificationDataComponent } from './carerofstednotificationdata.component';
import { CarerofstednotificationListComponent } from './carerofstednotificationlist.component';
import { carerschedule6DataComponent } from './carerschedule6data.component';
import { CarerSchedule6ListComponent } from './carerschedule6list.component';
import { LaddaModule } from 'angular2-ladda';
import { MultiSelectModule } from 'primeng/multiselect';
import { DisabilityGetAllResolver } from '../child/disabilitygetallresolver.service';44

import { AnnualReviewNurtureDataComponet } from './annualreview-nurture-data.component'
import { CarerAnnualReviewNurtureFCSignatureComponet } from './annualreview-nurture-fcsignature.component'
import { AnnualReviewNurtureListComponet } from './annualreview-nurture-list.component'

export const routes: Routes = [
    { path: '', redirectTo: 'approvedcarerlist/3', pathMatch: 'full' },
    { path: 'approvalmatching', component: ApprovalMatchingConsiderationComponet, data: { breadcrumb: 'Approval & Matching Consideration' } },
    { path: 'approvedcarerlist', component: ApprovedCarerListComponet, data: { breadcrumb: 'Carer List' } },
    //return
    { path: 'approvedcarerlist/:mid/:rid', component: ApprovedCarerListComponet, data: { breadcrumb: 'Carer List' } },
    { path: 'annualreview/:id/:mid', component: AnnualReviewComponet, data: { breadcrumb: 'Annual Review ' } },
    { path: 'annualreviewlist/:mid', component: AnnualReviewListComponet, data: { breadcrumb: 'Annual Review List' } },
    //rainbow
    { path: 'annualreviewdatarainbow/:id/:mid/:apage', component: AnnualReviewRainbowDataComponet, data: { breadcrumb: 'Annual Review ' } },
    { path: 'annualreviewlistrainbow/:mid/:apage', component: AnnualReviewRainbowListComponet, data: { breadcrumb: 'Annual Review List' } },
    { path: 'annualreviewlistrainbow/:mid', component: AnnualReviewRainbowListComponet, data: { breadcrumb: 'Annual Review List' } },
    { path: 'annualreviewrainbowfcsignature/:sno', component: CarerAnnualReviewRainbowFCSignatureComponet, data: { breadcrumb: 'Foster Carer Signature' } },
    { path: 'annualreview/:id/:mid/:apage', component: AnnualReviewComponet, data: { breadcrumb: 'Annual Review ' } },
    { path: 'annualreviewlist/:mid/:apage', component: AnnualReviewListComponet, data: { breadcrumb: 'Annual Review List' } },
    { path: 'placementreview/:id', component: PlacementReviewComponet, data: { breadcrumb: 'Placement Review' } },
    {
        path: 'fcinitialenquiry/:id', component: FCInitialEnquiryComponet, data: { breadcrumb: 'Initial Enquiry' },
        resolve: {
            disability: DisabilityGetAllResolver,
        }
    },
    { path: 'approvalmatching/:mid', component: ApprovalMatchingConsiderationComponet, data: { breadcrumb: 'Approval & Matching Consideration' } },
    { path: 'approvedcarerlist/:mid', component: ApprovedCarerListComponet, data: { breadcrumb: 'Carer List' } },
    {
        path: 'application/:mid', component: CarerApplicationFormComponet, data: { breadcrumb: 'Application Form' },
        resolve: {
            disability: DisabilityGetAllResolver,
        }
    },
    { path: 'backupcarerlist/:mid', component: FCBackupCarerListComponet, data: { breadcrumb: 'Backup Carer List' } },
    { path: 'backupcarer/:id/:SeqNo/:mid', component: FCBackupCarerDataComponet, data: { breadcrumb: 'Backup Carer' } },
    { path: 'facarerfamily/:mid', component: FCCarerFamilyComponet, data: { breadcrumb: 'Carer Family / Support Network' } },
    {
        path: 'fcpersonaldetails/:mid', component: FCPersonalDetailsComponet, data: { breadcrumb: 'Personal Details' },
        resolve: {
            disability: DisabilityGetAllResolver,
        }
    },
    {
        path: 'fcinitialenquiry/:id/:mid', component: FCInitialEnquiryComponet, data: { breadcrumb: 'Initial Enquiry' },
        resolve: {
            disability: DisabilityGetAllResolver,
        }
    },
    {
        path: 'fccarerinitialhomevisit/:mid', component: FCInitialHomeVisitComponet, data: { breadcrumb: 'Initial Home Visit' },
        resolve: {
            disability: DisabilityGetAllResolver,
        }
    },
    { path: 'careroohreportlist/:mid', component: CarerOOHReportListComponent, data: { breadcrumb: 'OOH Report List' } },
    { path: 'careroohreportdata/:Id/:mid', component: CarerOOHReportData, data: { breadcrumb: 'OOH Report' } },
    { path: 'careroohreportlist/:mid/:apage', component: CarerOOHReportListComponent, data: { breadcrumb: 'OOH Report List' } },
    { path: 'careroohreportdata/:Id/:mid/:apage', component: CarerOOHReportData, data: { breadcrumb: 'OOH Report' } },
    { path: 'carersupervisoryhomevisitlist/:mid', component: CarerSupervisoryHomeVisitListComponent, data: { breadcrumb: 'Supervisory Home Visit' } },
    { path: 'carersupervisoryhomevisitdata/:Id/:mid', component: CarerSupervisoryHomeVisitDataComponent, data: { breadcrumb: 'Supervisory Home Visit' } },
    { path: 'carersupervisoryhomevisitlist/:mid/:apage', component: CarerSupervisoryHomeVisitListComponent, data: { breadcrumb: 'Supervisory Home Visit' } },
    { path: 'carersupervisoryhomevisitdata/:Id/:mid/:apage', component: CarerSupervisoryHomeVisitDataComponent, data: { breadcrumb: 'Supervisory Home Visit' } },
    { path: 'childsupervisoryhomevisitlist/:Id', component: ChildSupervisoryHomeVisitListComponent, data: { breadcrumb: 'Child Supervisory Home Visit' } },
    { path: 'childsupervisoryhomevisitdata/:Id/:CarerSHVno/:Sno/:mid', component: ChildSupervisoryHomeVisitDataComponent, data: { breadcrumb: 'Child Supervisory Home Visit' } },
    { path: 'childsupervisoryhomevisitlist/:Id/:apage', component: ChildSupervisoryHomeVisitListComponent, data: { breadcrumb: 'Child Supervisory Home Visit' } },
    { path: 'childsupervisoryhomevisitdata/:Id/:CarerSHVno/:Sno/:mid/:apage', component: ChildSupervisoryHomeVisitDataComponent, data: { breadcrumb: 'Child Supervisory Home Visit' } },
    { path: 'carerplacementrefusalinfolist/:mid', component: CarerPlacementRefusalInfoListComponent, data: { breadcrumb: 'Placement Refusal' } },
    { path: 'carerplacementrefusalinfodata/:Id', component: CarerPlacementRefusalInfoDataComponent, data: { breadcrumb: 'Placement Refusal' } },
    { path: 'carertransferclosingsummarylist/:mid', component: CarerTransferClosingSummaryListComponent, data: { breadcrumb: 'Transfer/Closing Summary' } },
    { path: 'carertransferclosingsummarydata/:Id', component: CarerTransferClosingSummaryDataComponent, data: { breadcrumb: 'Transfer/Closing Summary' } },
    { path: 'carerunannouncedhomevisitlist/:mid', component: CarerUnannouncedHomeVisitListComponent, data: { breadcrumb: 'Unannounced Home Visit' } },
    { path: 'carerunannouncedhomevisitdata/:Id/:mid', component: CarerUnannouncedHomeVisitDataComponent, data: { breadcrumb: 'Unannounced Home Visit' } },
    { path: 'carerunannouncedhomevisitlist/:mid/:apage', component: CarerUnannouncedHomeVisitListComponent, data: { breadcrumb: 'Unannounced Home Visit' } },
    { path: 'carerunannouncedhomevisitdata/:Id/:mid/:apage', component: CarerUnannouncedHomeVisitDataComponent, data: { breadcrumb: 'Unannounced Home Visit' } },
    { path: 'fccarerstatuschange/:mid', component: CarerStatusChangeComponet, data: { breadcrumb: 'Carer Status Change' } },
    { path: 'fccarerapprove/:mid', component: CarerApproveComponet, data: { breadcrumb: 'Carer Approve' } },
    { path: 'uploaddocuments/:mid', component: FCUploadDocument, data: { breadcrumb: 'Upload Documents' } },
    { path: 'fcredirect/:Id/:mid', component: FCRedirectComponent, data: { breadcrumb: 'Redirect' } },
    { path: 'carerformfaddendum/:mid', component: FCFormFAddendumComponent, data: { breadcrumb: 'Addendum To Form F' } },
    { path: 'assessmentappointmentlist/:mid', component: FCFormFAssessmentAppointmentListComponent, data: { breadcrumb: 'Assessment Appointment List' } },
    { path: 'assessmentappointmentdata/:Id/:mid', component: FCFormFAssessmentAppointmentDataComponent, data: { breadcrumb: 'Assessment Appointment' } },
    { path: 'uploadformf/:Id/:mid', component: FCUploadFormFComponent, data: { breadcrumb: 'Upload Form F' } },
    { path: 'placementdischargehistory/:mid', component: PlacementDischargehistory, data: { breadcrumb: 'Placement/Discharge History' } },
    { path: 'carerdaylogjournallist/:mid', component: FCDaylogjournalListComponent, data: { breadcrumb: 'Daylog Journal List ' } },
    { path: 'carerdaylogjournaldata/:Id', component: FCDaylogjournalDataComponent, data: { breadcrumb: 'Daylog Journal' } },
    { path: 'carerdaylogjournallist/:mid/:apage', component: FCDaylogjournalListComponent, data: { breadcrumb: 'Daylog Journal List ' } },
    { path: 'carerdaylogjournaldata/:Id/:apage', component: FCDaylogjournalDataComponent, data: { breadcrumb: 'Daylog Journal' } },
    { path: 'carerhealthandsafetylist/:mid', component: FCHealthAndSafetyListComponent, data: { breadcrumb: 'Health & Safety List ' } },
    { path: 'carerhealthandsafetydata/:Id', component: FCHealthAndSafetyDataComponent, data: { breadcrumb: 'Health & Safety' } },
    { path: 'carerpetquestionnairelist/:mid', component: FCPetQuestionnaireListComponent, data: { breadcrumb: 'Pet Questionnaire List ' } },
    { path: 'carerpetquestionnairedata/:Id', component: FCPetQuestionnaireDataComponent, data: { breadcrumb: 'Pet Questionnaire' } },
    { path: 'safecarepolicylist/:mid', component: FCSafecarePolicyListComponent, data: { breadcrumb: 'Safecare Policy List ' } },
    { path: 'safecarepolicydata/:id/:mid', component: FCSafecarePolicyDataComponent, data: { breadcrumb: 'Safecare Policy' } },
    { path: 'safecarepolicylist/:mid/:apage', component: FCSafecarePolicyListComponent, data: { breadcrumb: 'Safecare Policy List ' } },
    { path: 'safecarepolicydata/:id/:mid/:apage', component: FCSafecarePolicyDataComponent, data: { breadcrumb: 'Safecare Policy' } },
    { path: 'swapcarer/:mid', component: FCSwapCarerComponent, data: { breadcrumb: 'Swap Carer' } },
    { path: 'carertrainingprofilelist/:mid', component: FCTrainingProfileListComponent, data: { breadcrumb: 'Training Profile List ' } },
    { path: 'carertrainingprofiledata/:Id', component: FCTrainingProfileDataComponent, data: { breadcrumb: 'Training Profile' } },
    { path: 'carertrainingprofilelist/:mid/:apage', component: FCTrainingProfileListComponent, data: { breadcrumb: 'Training Profile List ' } },
    { path: 'carertrainingprofiledata/:Id/:apage', component: FCTrainingProfileDataComponent, data: { breadcrumb: 'Training Profile' } },
    { path: 'careraddresshistorylist/:mid', component: FCCarerAddressHistoryListComponent, data: { breadcrumb: 'Carer Address History List ' } },
    { path: 'careraddresshistory/:id/:mid', component: FCCarerAddressHistoryDataComponent, data: { breadcrumb: 'Carer Address History' } },
    { path: 'statutorycheck/:id/:mid', component: StatutoryCheckCarerComponet, data: { breadcrumb: 'Statutory Check' } },
    { path: 'placementdischargehistoryview/:id', component: PlacementDischargeHistoryViewComponet, data: { breadcrumb: 'Placement/Discharge History' } },
    { path: 'carerchecklist/:mid', component: FCCarerCheckListComponent, data: { breadcrumb: 'Carer Check List' } },
    { path: 'holidaydetailslist/:mid', component: CarerHolidayDetailsListComponent, data: { breadcrumb: 'Carer Holiday Details List ' } },
    { path: 'holidaydetailsdata/:id/:mid', component: CarerHolidayDetailsDataComponent, data: { breadcrumb: 'Carer Holiday Details' } },
    { path: 'fcapmlist/:mid', component: FCApprovedPanelMinutesList, data: { breadcrumb: 'Approved Panel Minutes List ' } },
    { path: 'fcapmdata/:id/:mid', component: FCApprovedPanelMinutesData, data: { breadcrumb: 'Approved Panel Minutes' } },
    { path: 'allegationlist/:mid', component: CarerAllegationInfoListComponent, data: { breadcrumb: 'Allegation List ' } },
    { path: 'allegationdata/:id/:mid', component: CarerAllegationInfoDataComponent, data: { breadcrumb: 'Allegation' } },
    { path: 'complaintslist/:mid', component: CarerComplaintInfoListComponent, data: { breadcrumb: 'Complaints List ' } },
    { path: 'complaintsdata/:id/:mid', component: CarerComplaintInfoDataComponent, data: { breadcrumb: 'Complaints' } },
    { path: 'incidentlist/:mid', component: CarerIncidentInfoListComponent, data: { breadcrumb: 'Incident List ' } },
    { path: 'incidentdata/:id/:mid', component: CarerIncidentInfoDataComponent, data: { breadcrumb: 'Incident' } },
    { path: 'carerimmunisationinfolist/:mid', component: CarerImmunisationInfoListComponent, data: { breadcrumb: 'Immunisation List ' } },
    { path: 'carerimmunisationinfodata/:Id/:mid', component: CarerImmunisationInfoComponent, data: { breadcrumb: 'Immunisation' } },
    { path: 'admapprovedminutes/:mid/:mmid', component: ADMApprovedMinutesComponent, data: { breadcrumb: 'ADM Approved Minutes' } },
    { path: 'carerchronologyofevent/:mid', component: CarerChronologyofEventComponet, data: { breadcrumb: 'Chronology of Events' } },
    { path: 'shvnonplacementlist/:mid', component: CarerSHVNonPlacementListComponent, data: { breadcrumb: 'Supervisory Home Visit Non - Placement List ' } },
    { path: 'shvnonplacementdata/:Id/:mid', component: CarerSHVNonPlacementData, data: { breadcrumb: 'Supervisory Home Visit Non - Placement' } },
    { path: 'familyguide/:mid', component: CarerFamilyGuideComponent, data: { breadcrumb: 'Family Guide' } },
    { path: 'irmdeterminationlist/:mid', component: CarerIRMDeterminationListComponent, data: { breadcrumb: 'IRM Determination List ' } },
    { path: 'irmdeterminationdata/:Id/:mid', component: CarerIRMDeterminationDataComponent, data: { breadcrumb: 'IRM Determination' } },
    { path: 'shvfcsignature/:sno', component: CarerSupervisoryHomeVisitFCSignatureComponet, data: { breadcrumb: 'Signature' } },
    { path: 'uhvfcsignature/:sno', component: CarerUnannouncedHomeVisitFCSignatureComponet, data: { breadcrumb: 'Foster Carer Signature' } },
    { path: 'carermanagementdecisionlist/:mid', component: FCCarerManagementDecisionListComponent, data: { breadcrumb: 'Management Decision List ' } },
    { path: 'carermanagementdecisiondata/:Id/:mid', component: FCCarerManagementDecisionDataComponent, data: { breadcrumb: 'Management Decision' } },
    { path: 'fireescapeplanlist/:mid', component: FCCarerFireEscapePlanListComponent, data: { breadcrumb: 'Fire Escape Plan List ' } },
    { path: 'fireescapeplandata/:Id/:mid', component: FCCarerFireEscapePlanDataComponent, data: { breadcrumb: 'Fire Escape Plan' } },
    { path: 'annualreviewfcsignature/:sno', component: CarerAnnualReviewFCSignatureComponet, data: { breadcrumb: 'Foster Carer Signature' } },
    { path: 'complementslist/:mid', component: CarerComplementsListComponent, data: { breadcrumb: 'Complements List ' } },
    { path: 'complementsdata/:Id/:mid', component: CarerComplementsData, data: { breadcrumb: 'Complements' } },
    { path: 'childShvfcsignature/:cid/:carersqno/:childsqno', component: ChildSHVFCSignatureComponents, data: { breadcrumb: 'Foster Carer Signature ' } },
    { path: 'matchingchecklist/:mid', component: FCChildMatchingCheckListComponent, data: { breadcrumb: 'Matching CheckList' } },
    { path: 'matchingchecklistdata/:Id/:cid/:mid', component: FCChildMatchingChecklistDataComponent, data: { breadcrumb: 'Matching CheckList' } },
    { path: 'carerpolicies/:mid', component: FosterCarerPoliciesComponent, data: { breadcrumb: 'Foster Carer Policies' } },
    { path: 'disclosurelist/:mid', component: carerdisclosureListComponent, data: { breadcrumb: 'Carer Disclosure ' } },
    { path: 'disclosuredata/:Id/:mid', component: CarerdisclosureDataComponent, data: { breadcrumb: 'Carer Disclosure   ' } },
    { path: 'disclosurefcsignature/:sno', component: carerdisclosureFCSignatureComponet, data: { breadcrumb: 'Signature' } },
    { path: 'ofstednotificationlist/:mid', component: CarerofstednotificationListComponent, data: { breadcrumb: 'Ofsted Notification List ' } },
    { path: 'ofstednotificationdata/:id/:mid', component: CarerOfstedNotificationDataComponent, data: { breadcrumb: 'Ofsted Notification' } },
    { path: 'Schedule6list/:mid', component: CarerSchedule6ListComponent, data: { breadcrumb: 'Schedule 6 List ' } },
    { path: 'Schedule6data/:id/:mid', component: carerschedule6DataComponent, data: { breadcrumb: 'Schedule 6' } },
    //nurture
    { path: 'annualreviewdatanurture/:id/:mid/:apage', component: AnnualReviewNurtureDataComponet, data: { breadcrumb: 'Annual Review ' } },
    { path: 'annualreviewlistnurture/:mid/:apage', component: AnnualReviewNurtureListComponet, data: { breadcrumb: 'Annual Review List' } },
    { path: 'annualreviewlistnurture/:mid', component: AnnualReviewNurtureListComponet, data: { breadcrumb: 'Annual Review List' } },
    { path: 'annualreviewnurturefcsignature/:sno', component: CarerAnnualReviewNurtureFCSignatureComponet, data: { breadcrumb: 'Foster Carer Signature' } }

];

@NgModule({
    imports: [MultiSelectModule,FamilyInfoModule, UploadDocumentsModule, RecruitmentModule, DynamicModule, PipesCustomModule, PersonalInfoModule, ContactInfoModule, CommonInfoModule,
        CommonModule, SuperAdminModule,HeaderModule,LaddaModule, DirectivesModule, FormsModule, ReactiveFormsModule,//Ng2LoadingSpinnerModule,
         NgCircleProgressModule.forRoot({
            radius: 100,
            outerStrokeWidth: 16,
            innerStrokeWidth: 8,
            outerStrokeColor: "#78C000",
            innerStrokeColor: "#C7E596",
            animationDuration: 300,
          }),
        RouterModule.forChild(routes)
    ],
    declarations: [AnnualReviewApprovalRecommendationComponet,
        ApprovedCarerListComponet, FCCarerFamilyComponet, PlacementDischargeHistoryViewComponet,
        CarerApplicationFormComponet, FCInitialHomeVisitComponet, FCInitialEnquiryComponet, FCPersonalDetailsComponet, ApprovalMatchingConsiderationComponet,
        CarerOOHReportListComponent, CarerOOHReportData, CarerSupervisoryHomeVisitListComponent, CarerSupervisoryHomeVisitDataComponent, ChildSupervisoryHomeVisitListComponent, ChildSupervisoryHomeVisitDataComponent,
        CarerPlacementRefusalInfoListComponent, CarerPlacementRefusalInfoDataComponent,
        CarerTransferClosingSummaryListComponent, CarerTransferClosingSummaryDataComponent,
        CarerUnannouncedHomeVisitListComponent, CarerUnannouncedHomeVisitDataComponent, AnnualReviewComponet, AnnualReviewListComponet,
        PlacementReviewComponet, CarerStatusChangeComponet, FCUploadDocument, FCRedirectComponent,
        FCFormFAddendumComponent, FCFormFAssessmentAppointmentListComponent, FCFormFAssessmentAppointmentDataComponent
        , FCUploadFormFComponent, PlacementDischargehistory, ApplicantSelectedComponet
        , AnnualReviewPlacementInfoComponent, CarerApproveComponet,
        FCBackupCarerListComponet, FCBackupCarerDataComponet, FCDaylogjournalListComponent, FCDaylogjournalDataComponent,
        FCHealthAndSafetyListComponent, FCHealthAndSafetyDataComponent, FCPetQuestionnaireListComponent, FCPetQuestionnaireDataComponent,
        FCSafecarePolicyListComponent, FCSafecarePolicyDataComponent, FCSwapCarerComponent, FCTrainingProfileListComponent,
        FCTrainingProfileDataComponent,
        FCCarerAddressHistoryDataComponent, FCCarerAddressHistoryListComponent, StatutoryCheckCarerComponet, FCCarerCheckListComponent,
        CarerHolidayDetailsListComponent, CarerHolidayDetailsDataComponent,
        FCApprovedPanelMinutesList, FCApprovedPanelMinutesData,
        CarerAllegationInfoDataComponent, CarerAllegationInfoListComponent,
        CarerComplaintInfoDataComponent, CarerComplaintInfoListComponent,
        CarerIncidentInfoDataComponent, CarerIncidentInfoListComponent,
        CarerImmunisationInfoComponent, CarerImmunisationInfoListComponent,
        ADMApprovedMinutesComponent, CarerChronologyofEventComponet,
        CarerSHVNonPlacementData, CarerSHVNonPlacementListComponent, CarerFamilyGuideComponent,
        CarerIRMDeterminationListComponent, CarerIRMDeterminationDataComponent,
        CarerSupervisoryHomeVisitFCSignatureComponet, CarerUnannouncedHomeVisitFCSignatureComponet,
        FCCarerManagementDecisionListComponent, FCCarerManagementDecisionDataComponent,
        FCCarerFireEscapePlanListComponent, FCCarerFireEscapePlanDataComponent, CarerAnnualReviewFCSignatureComponet,
        CarerComplementsListComponent,CarerComplementsData,ChildSHVFCSignatureComponents,
        FCChildMatchingCheckListComponent,FCChildMatchingChecklistDataComponent,FosterCarerPoliciesComponent,
        CarerdisclosureDataComponent,carerdisclosureListComponent,carerdisclosureFCSignatureComponet,
        AnnualReviewRainbowListComponet,AnnualReviewRainbowDataComponet,CarerAnnualReviewRainbowFCSignatureComponet,
        CarerOfstedNotificationDataComponent,CarerofstednotificationListComponent,
        carerschedule6DataComponent,CarerSchedule6ListComponent,
        AnnualReviewNurtureDataComponet,CarerAnnualReviewNurtureFCSignatureComponet,AnnualReviewNurtureListComponet

    ],
    providers: [SimpleTimer,DisabilityGetAllResolver],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class FosterCarerModule { }
