import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { NgImageSliderModule } from 'ng-image-slider';
import { BarRatingModule } from 'ngx-bar-rating';
import { DirectivesModule } from '../../theme/directives/directives.module';
import { ReferralModule } from '../child/referral.module';
import { CommonInfoModule } from '../common/common.module';
import { ContactInfoModule } from '../contact/contactinfo.module';
import { DynamicModule } from '../dynamic/dynamic.module';
import { HeaderModule } from '../headers/header.module';
import { PersonalInfoModule } from '../personalinfo/personalinfo.module';
import { PipesCustomModule } from '../pipes/pipes.module';
import { APICallService } from '../services/apicallservice.service';
import { ChildProfileService } from '../services/childprofile.service';
import { SuperAdminModule } from '../superadmin/superadmin.module';
import { UploadDocumentsModule } from '../uploaddocument/uploaddocuments.module';
import { CarersYpProgressDataComponent } from './carersypprogressdata.component';
import { CarersYpProgressListComponent } from './carersypprogresslist.component';
import { ChildAllegationInfoDataComponent } from './childallegationinfodata.component';
import { ChildAllegationInfoListComponent } from './childallegationinfolist.component';
import { ChildCarePlanDataComponent } from './childcareplandata.component';
import { ChildCarePlanListComponent } from './childcareplanlist.component';
import { ChildChronologyofEventComponet } from './childchronologyofevent.component';
import { ChildChronologyOfEventDataComponent } from './childchronologyofeventdata.component';
import { ChildChronologyOfEventListComponent } from './childchronologyofeventlist.component';
import { ChildCLAReviewDataComponent } from './childclareviewdata.component';
import { ChildCLAReviewListComponent } from './childclareviewlist.component';
import { ChildComplaintInfoDataComponent } from './childcomplaintinfodata.component';
import { ChildComplaintInfoListComponent } from './childcomplaintinfolist.component';
import { ChildCSEComponent } from './childcsedata.component';
import { ChildCSEListComponent } from './childcselist.component';
import { ChildDaylogDataComponent } from './childdaylogdata.component';
import { ChildDaylogjournalComponent } from './childdaylogjournal.component';
import { ChildEducationAbsenceInfoComponent } from './childeducationabsenceinfo.component';
import { ChildEducationAbsenceInfoListComponent } from './childeducationabsenceinfolist.component';
import { ChildEducationalInfoComponent } from './childeducationalinfo.component';
import { ChildEducationalInfoListComponent } from './childeducationalinfolist.component';
import { ChildEducationExclusionInfoComponent } from './childeducationexclusioninfo.component';
import { ChildEducationExclusionInfoListComponent } from './childeducationexclusioninfolist.component';
import { ChildEducationGradeInfoComponent } from './childeducationgradeinfo.component';
import { ChildEducationGradeInfoListComponent } from './childeducationgradeinfolist.component';
import { ChildEducationOutofSchoolActivityInfoComponent } from './childeducationoutofschoolactivityInfo.component';
import { ChildEducationOutofSchoolActivityInfoListComponent } from './childeducationoutofschoolactivityInfolist.component';
import { ChildEducationPEPInfoComponent } from './childeducationpepinfo.component';
import { ChildEducationPEPInfoListComponent } from './childeducationpepinfolist.component';
import { ChildEducationStudySupportInfoComponent } from './childeducationstudysupportinfo.component';
import { ChildEducationStudySupportInfoListComponent } from './childeducationstudysupportinfolist.component';
import { ChildEducationVocationalCourseInfoComponent } from './childeducationvocationalcourseinfo.component';
import { ChildEducationVocationalCourseInfoListComponent } from './childeducationvocationalcourseinfolist.component';
import { ChildExploitationDataComponent } from './childexploitationdata.component';
import { ChildExploitationListComponent } from './childexploitationlist.component';
import { ChildExploitationSignatureComponents } from './childexploitationsignature.component';
import { ChildFamilyPersonOrgInvolvedComponent } from './childfamilypersonorginvolved.component';
import { ChildFamilyPersonOrgInvolvedListComponent } from './childfamilypersonorginvolvedlist.component';
import { ChildGallryComponent } from './childgallery.component';
import { ChildGalleryDataDocuments } from './childgallerydata.component';
import { ChildGalleryDetailsComponent } from './childgallerydetails.component';
import { ChildHealthAppointmentInfoComponent } from './childhealthappointmentinfo.component';
import { ChildHealthAppointmentInfoListComponent } from './childhealthappointmentinfolist.component';
import { ChildHealthBehaviouralInfoComponent } from './childhealthbehaviouralinfo.component';
import { ChildHealthHospitalisationInfoComponent } from './childhealthhospitalisationinfo.component';
import { ChildHealthHospitalisationInfoListComponent } from './childhealthhospitalisationinfolist.component';
import { ChildHealthImmunisationInfoComponent } from './childhealthimmunisationinfo.component';
import { ChildHealthImmunisationInfoListComponent } from './childhealthimmunisationinfolist.component';
import { ChildHealthInfoComponent } from './childhealthinfo.component';
import { ChildHealthInfoListComponent } from './childhealthinfolist.component';
import { ChildHealthMedicalVisitInfoComponent } from './childhealthmedicalvisitinfo.component';
import { ChildHealthMedicalVisitInfoListComponent } from './childhealthmedicalvisitinfolist.component';
import { ChildHealthMedicationInfoComponent } from './childhealthmedicationinfo.component';
import { ChildHealthMedicationInfoListComponent } from './childhealthmedicationinfolist.component';
import { ChildHealthTherapyInfoComponent } from './childhealththerapyinfo.component';
import { ChildHealthTherapyInfoListComponent } from './childhealththerapyinfolist.component';
import { ChildHealthTherapyInfoNewComponent } from './childhealththerapyinfonewdata.component';
import { ChildHealthTherapyInfoNewListComponent } from './childhealththerapyinfonewlist.component';
import { ChildHolidayDetailsInfoComponent } from './childholidaydetailsinfo.component';
import { ChildHolidayDetailsInfoListComponent } from './childholidaydetailsinfolist.component';
import { ChildIncidentInfoDataComponent } from './childincidentdata.component';
import { ChildIncidentInfoListComponent } from './childincidentlist.component';
import { ChildManagementDecisionDataComponent } from './childmanagementdecisiondata.component';
import { ChildManagementDecisionListComponent } from './childmanagementdecisionlist.component';
import { ChildMissingPlacementComponent } from './childmissingplacement.component';
import { ChildMissingPlacementListComponent } from './childmissingplacementlist.component';
import { ChildMonthlyProgressReportData } from './childmonthlyprogressreportdata.component';
import { ChildMonthlyProgressReportListComponent } from './childmonthlyprogressreportlist.component';
import { ChildOfstedNotificationComponent } from './childofstednotification.component';
import { ChildOfstedNotificationListComponent } from './childofstednotificationlist.component';
import { ChildOOHReportDataComponent } from './childoohreportdata.component';
import { ChildOOHReportListComponent } from './childoohreportlist.component';
import { ChildPathwayplanComponent } from './childpathwayplan.component';
import { ChildPathwayplanListComponent } from './childpathwayplanlist.component';
import { ChildPlacementPlanDataComponent } from './childplacementplandata.component';
import { ChildPlacementPlanListComponent } from './childplacementplanlist.component';
import { ChildPossessionsSavingDataComponent } from './childpossessionssavingdata.component';
import { ChildPossessionsSavingListComponent } from './childpossessionssavinglist.component';
import { ChildProfileLinkComponent } from './childprofilelink.component';
import { FosterChildProfileList } from './childprofilelist.component';
import { ChildQuestionnaireInfoComponent } from './childquestionnaireinfo.component';
import { ChildQuestionnaireInfoListComponent } from './childquestionnaireinfolist.component';
import { FosterChildReferral } from './childreferral.component';
import { ChildRiskAssessmentNewDataComponent } from './childriskassessmentnewdata.component';
import { ChildRiskAssessmentNewListComponent } from './childriskassessmentnewlist.component';
import { ChildRiskAssessmentNewFCSignatureComponents } from './childriskassessmentnewsignature.component';
import { ChildSanctionDetailsComponent } from './childsanctiondetails.component';
import { ChildSanctionDetailsListComponent } from './childsanctiondetailslist.component';
import { ChildSchoolDetailInfoComponent } from './childschooldetailinfo.component';
import { ChildSchoolDetailInfoListComponent } from './childschooldetailinfolist.component';
import { ChildSchoolReportsComponent } from './childschoolreportsdata.components';
import { ChildSchoolReportsListComponent } from './childschoolreportslist.components';
import { ChildSpecificPlanComponent } from './childspecificplandata.component';
import { SupervisoryHomeVisitDataComponent } from './childsupervisoryhomevisitdata.component';
import { ChildSHVFCSignatureComponents } from './childsupervisoryhomevisitfcsignature.component';
import { SupervisoryHomeVisitListComponent } from './childsupervisoryhomevisitlist.component';
import { ChildUploadDocuments } from './childuploaddocuments.component';
import { ChildYoungPersonReportDataComponent } from './childyoungpersonreport.component';
import { ChildYoungPersonReportListComponent } from './childyoungpersonreportlist.component';
import { CLADocumentationComponent } from './cladocumentation.component';
import { ChildD3PersonalInformationDataComponent } from './d3personalinfodata.component';
import { ChildD3PersonaalInformationListComponent } from './d3personalinfolist.component';
import { EcmChildProgressReportComponent } from './ecmchildprogressreport.component';
import { EcmchildprogressreportfcsignatureComponents } from './ecmchildprogressreportfcsignature.component';
import { EcmChildProgressReportListComponent } from './ecmchildprogressreportlist.component';
import { FosterCarerDiaryRecordingDataComponent } from './fostercarerdiaryrecordingdata.component';
import { FosterCarerDiaryRecordingListComponent } from './fostercarerdiaryrecordinglist.component';
import { HospitalInfoDataComponet } from './hospitalinfodata.component';
import { HospitalInfoListComponet } from './hospitalinfolist.component';
import { IndependencePlanComponent } from './independenceplandata.component';
import { LocalAuthoritySWHistoryComponent } from './localauthorityswhistory.component';
import { LocalAuthoritySWHistoryChildListComponent } from './localauthorityswhistorylist.component';
import { NextDayActionLogComponent } from './nextdayactionlog.component';
import { NextDayActionLogListComponent } from './nextdayactionloglist.component';
import { OriginalReferral } from './originalreferral.component';
import { ParentChildDailyWeeklyRecordingData } from './parentchilddailyweeklyrecordingdata.component';
import { ParentChildDailyWeeklyRecordingList } from './parentchilddailyweeklyrecordinglist.component';
import { ChildPersonalGoalsDataComponent } from './personalgoalsdata.component';
import { ChildPersonalGoalsListComponent } from './personalgoalslist.component';
import { PhysicianInfoComponet } from './physicianinfo.component';
import { PhysicianChildMappingComponent } from './physicianinfochildmapping.component';
import { PhysicianInfoListComponet } from './physicianinfolist.component';
import { PlacementandDischargehistory } from './placementanddischargehistory.component';
import { PlacementandDischargeHistoryDataComponet } from './placementanddischargehistorydata.component';
import { PlacementContactComponent } from './placementcontactdata.component';
import { PlacementContactListComponent } from './placementcontactlist.component';
import { RiskAssessment } from './riskassessment.component';
import { ChildRiskAssessmentFCSignatureComponents } from './riskassessmentfcsignature.component';
import { RiskAssessmentInitialData } from './riskassessmentinitialdata.component';
import { RiskAssessmentInitialList } from './riskassessmentinitiallist.component';
import { RiskAssessmentList } from './riskassessmentlist.component';
import { SafercarePolicy } from './safercarepolicy.component';
import { SafercarePolicyFCSignatureComponents } from './safercarepolicyfcsignature.component';
import { SaferCarePolicyList } from './safercarepolicylist.component';
import { StatutoryMedicalComponet } from './statutorymedical.component';

import { ChildCLADocumentationDynamicComponent } from './childcladocumentationdynamicdata.component.ts';
import { ChildCLADocumentationDynamicListComponent } from './childcladocumentationdynamiclist..component.ts';
import { ChildSchedule6DataComponent } from './childschedule6data.component';
import { ChildCchedule6ListComponent } from './childschedule6list.component';
//New
import { MultiSelectModule } from 'primeng/multiselect';
import { ChildHealthAllergydataComponent } from './childhealthallergydata.component';
import { ChildHealthAllergyListComponent } from './childhealthallergylist.component';
import { ChildHolidayRiskAssessmentDataComponent } from './childholidayriskassessmentdata.component';
import { ChildholidayriskassessmentListComponent } from './childholidayriskassessmentlist.component';
import { SafeCasediscussionminutesDataComponent } from './safe-casediscussionminutesdata.component';
import { SafeCasediscussionminutesListComponent } from './safe-casediscussionminuteslist.component';
import { SafeDisruptionMeetingMinutesDataComponent } from './safe-disruptionmeetingminutesdata.component';
import { SafeDisruptionMeetingMinutesListComponent } from './safe-disruptionmeetingminuteslist.component';
import { ChildRiskNeedsAssessmentsDataComponent } from './safe-riskandneedsassessmentsdata.component';
import { ChildRiskNeedsAssessmentsListComponent } from './safe-riskandneedsassessmentslist.component';
import { RiskFactorsDataComponent } from './safe-riskfactorsdata.component';
import { RiskFactorsListComponent } from './safe-riskfactorslist.component';
import { RiskManagementoutingsDataComponent } from './safe-riskmanagementoutingsdata.component';
import { RiskManagementOutingsListComponent } from './safe-riskmanagementoutingslist.component';
import { ChildRiskManagementPlansDataComponent } from './safe-riskmanagementplandata.component';
import { RiskManagementplanListComponent } from './safe-riskmanagementplanlist.component';
import { ChildRiskManagementWorkExperienceDataComponent } from './safe-riskmanagementworkexperiencedata.component';
import { ChildRiskManagementWorkExperienceListComponent } from './safe-riskmanagementworkexperiencelist.component';
import { ChildSafeguardingDayLogJournalDataComponent } from './safe-safeguardingdaylogjournaldata.component';
import { ChildSafeguardingDayLogJournalListComponent } from './safe-safeguardingdaylogjournallist.component';
import { ChildTherapyUpdateReportsDataComponent } from './safe-therapyupdatereportsdata.component';
import { ChildTherapyUpdateReportsListComponent } from './safe-therapyupdatereportslist.component';
import { ChildYoungPeoplesActivitiesDataComponent } from './safe-youngpeoplesactivitiesdata.component';
import { ChildYoungPeoplesActivitiesListComponent } from './safe-youngpeoplesactivitieslist.component';
import { ChildYPSupervisionReviewDataComponent } from './safe-ypsupervisionreviewdata.component';
import { ChildYPSupervisionReviewListComponent } from './safe-ypsupervisionreviewlist.component';
import { voiceofthechilddataComponent } from './voiceofthechilddata.component';
import { voiceofthechildListComponent } from './voiceofthechildlist.component';
import { ChildFeedbackInfoComponent } from './childfeedbackinfo.component';
import { ChildFeedbackInfoListComponent } from './childfeedbackinfolist.component';
import { LaddaModule } from 'angular2-ladda';
import { FostercarerdiaryrecordingFCSignatureComponents } from './fostercarerdiaryrecordingfcsignature.component';
import { NgSelectModule } from '@ng-select/ng-select';

import { ChildRiskAssessmentFCSignatureParamountComponents } from './riskassessmentfcsignatureparamount.component'
import {  RiskAssessmentListParamountComponent} from './riskassessmentlistparamount.component'
import {RiskAssessmentParamount } from './riskassessmentparamount.component'


export const routes:Routes= [
    { path: '', redirectTo: 'childprofilelist/1/4', pathMatch: 'full' },
    {
        path: 'childprofilelink',
        component: ChildProfileLinkComponent,
        data: { breadcrumb: 'Child Profile List' },

    },
    {
        path: 'childprofilelink/:mid',
        component: ChildProfileLinkComponent,
        data: { breadcrumb: 'Child Profile List' },

    },
    { path: 'lausocialworkerhistory/:id/:cid', component: LocalAuthoritySWHistoryComponent, data: { breadcrumb: 'LA Social Worker History' } },
    {
        path: 'lausocialworkerhistory/:mid',
        component: LocalAuthoritySWHistoryChildListComponent,
        data: { breadcrumb: 'LA Social Worker History' },

    },

    { path: 'childclareviewlist/:mid', component: ChildCLAReviewListComponent, data: { breadcrumb: 'CLA Review' } },
    { path: 'fostercarerdiaryrecordinglist/:mid', component: FosterCarerDiaryRecordingListComponent, data: { breadcrumb: 'Foster Carer Diary Recording List' } },
    { path: 'childoohreportlist/:mid', component: ChildOOHReportListComponent, data: { breadcrumb: 'Child OOH Report' } },
    { path: 'childpathwayplanlist/:mid', component: ChildPathwayplanListComponent, data: { breadcrumb: 'Pathway plan' } },
    { path: 'nextdayactionloglist/:mid', component: NextDayActionLogListComponent, data: { breadcrumb: 'Next Day Action Log' } },
    { path: 'childeducationabsenceinfolist/:mid', component: ChildEducationAbsenceInfoListComponent, data: { breadcrumb: 'Absence Info' } },
    { path: 'childeducationalinfolist/:mid', component: ChildEducationalInfoListComponent, data: { breadcrumb: 'Educational Info' } },
    { path: 'childeducationexclusioninfolist/:mid', component: ChildEducationExclusionInfoListComponent, data: { breadcrumb: 'Exclusion Info' } },
    { path: 'childeducationoutofschoolactivityinfolist/:mid', component: ChildEducationOutofSchoolActivityInfoListComponent, data: { breadcrumb: 'Child Out of School Activity' } },
    { path: 'childeducationpepinfolist/:mid', component: ChildEducationPEPInfoListComponent, data: { breadcrumb: 'Personal Education Plan' } },
    { path: 'childschooldetailinfolist/:mid', component: ChildSchoolDetailInfoListComponent, data: { breadcrumb: 'Child School Info' } },
    { path: 'childeducationstudysupportinfolist/:mid', component: ChildEducationStudySupportInfoListComponent, data: { breadcrumb: 'Study Support' } },
    { path: 'childeducationvocationalcourseinfolist/:mid', component: ChildEducationVocationalCourseInfoListComponent, data: { breadcrumb: 'Vocational Course ' } },
    { path: 'childhealthappointmentinfolist/:mid', component: ChildHealthAppointmentInfoListComponent, data: { breadcrumb: 'Appointment Info' } },
    { path: 'childhealthbehaviouralinfo/:mid', component: ChildHealthBehaviouralInfoComponent, data: { breadcrumb: 'Behavioural Info' } },
    { path: 'childhealthhospitalisationinfolist/:mid', component: ChildHealthHospitalisationInfoListComponent, data: { breadcrumb: 'Hospitalisation Info ' } },
    { path: 'childhealthinfolist/:mid', component: ChildHealthInfoListComponent, data: { breadcrumb: 'Health Assessment' } },
    { path: 'childhealthimmunisationinfolist/:mid', component: ChildHealthImmunisationInfoListComponent, data: { breadcrumb: 'Immunisation Info' } },
    { path: 'childhealthmedicalvisitinfolist/:mid', component: ChildHealthMedicalVisitInfoListComponent, data: { breadcrumb: 'Medical Visit Info' } },
    { path: 'childhealthmedicationinfolist/:mid', component: ChildHealthMedicationInfoListComponent, data: { breadcrumb: 'Medication Info' } },
    { path: 'childhealththerapyinfolist/:mid', component: ChildHealthTherapyInfoListComponent, data: { breadcrumb: 'Therapy Info' } },
    { path: 'childholidaydetailsinfolist/:mid', component: ChildHolidayDetailsInfoListComponent, data: { breadcrumb: 'Holiday Info' } },
    { path: 'childeducationChild Education Grade Infoeinfolist/:mid', component: ChildEducationGradeInfoListComponent, data: { breadcrumb: 'SATS/Exam/Grade Details' } },
    { path: 'childfamilypersonorginvolvedlist/:mid', component: ChildFamilyPersonOrgInvolvedListComponent, data: { breadcrumb: 'Family Person Org Involved' } },
    { path: 'childquestionnaireinfolist/:mid', component: ChildQuestionnaireInfoListComponent, data: { breadcrumb: 'Questionnaire' } },
    { path: 'physicianinfolist/:mid', component: PhysicianInfoListComponet, data: { breadcrumb: 'GP Info List' } },
    { path: 'childholidaydetailsinfo/:Id/:mid', component: ChildHolidayDetailsInfoComponent, data: { breadcrumb: 'Holiday Info' } },
    { path: 'childholidaydetailsinfolist/:mid', component: ChildHolidayDetailsInfoListComponent, data: { breadcrumb: 'Holiday Info' } },
    { path: 'childeducationgradeinfo/:Id/:mid', component: ChildEducationGradeInfoComponent, data: { breadcrumb: 'SATS/Exam/Grade Details' } },
    { path: 'childeducationgradeinfolist/:mid', component: ChildEducationGradeInfoListComponent, data: { breadcrumb: 'SATS/Exam/Grade Details' } },
    { path: 'childfamilypersonorginvolved/:Id/:mid', component: ChildFamilyPersonOrgInvolvedComponent, data: { breadcrumb: 'Family Person Org Involved' } },
    { path: 'childfamilypersonorginvolvedlist/:mid', component: ChildFamilyPersonOrgInvolvedListComponent, data: { breadcrumb: 'Family Person Org Involved' } },
    { path: 'childquestionnaireinfo/:Id/:mid', component: ChildQuestionnaireInfoComponent, data: { breadcrumb: 'Questionnaire Info' } },
    { path: 'childquestionnaireinfolist/:mid', component: ChildQuestionnaireInfoListComponent, data: { breadcrumb: 'Questionnaire Info' } },
    { path: 'childchronologyofeventdata/:Id/:mid', component: ChildChronologyOfEventDataComponent, data: { breadcrumb: 'Chronology of Events' } },
    { path: 'childchronologyofeventlist/:mid', component: ChildChronologyOfEventListComponent, data: { breadcrumb: 'Chronology Of Events' } },
    {
        path: 'childchronologyofevent/:mid', component: ChildChronologyofEventComponet, data: { breadcrumb: 'Chronology Of Events' }
    },
    { path: 'childclareviewdata/:Id/:mid', component: ChildCLAReviewDataComponent, data: { breadcrumb: 'CLA Review' } },
    { path: 'childclareviewlist/:mid', component: ChildCLAReviewListComponent, data: { breadcrumb: 'CLA Review List' } },

    { path: 'childclareviewdata/:Id/:mid/:apage', component: ChildCLAReviewDataComponent, data: { breadcrumb: 'CLA Review' } },
    { path: 'childclareviewlist/:mid/:apage', component: ChildCLAReviewListComponent, data: { breadcrumb: 'CLA Review List' } },
    { path: 'childoohreportdata/:Id/:mid', component: ChildOOHReportDataComponent, data: { breadcrumb: 'Child OOH Report' } },
    { path: 'childoohreportlist/:mid', component: ChildOOHReportListComponent, data: { breadcrumb: 'Child OOH Report' } },

    { path: 'childoohreportdata/:Id/:mid/:apage', component: ChildOOHReportDataComponent, data: { breadcrumb: 'Child OOH Report' } },
    { path: 'childoohreportlist/:mid/:apage', component: ChildOOHReportListComponent, data: { breadcrumb: 'Child OOH Report' } },

    { path: 'childpathwayplan/:Id/:mid', component: ChildPathwayplanComponent, data: { breadcrumb: 'Pathway plan' } },
    { path: 'childpathwayplanlist/:mid', component: ChildPathwayplanListComponent, data: { breadcrumb: 'Pathway plan' } },
    { path: 'childeducationexclusioninfo/:Id/:mid', component: ChildEducationExclusionInfoComponent, data: { breadcrumb: 'Exclusion Info' } },
    { path: 'childeducationexclusioninfolist', component: ChildEducationExclusionInfoListComponent, data: { breadcrumb: 'Exclusion Info' } },
    { path: 'fostercarerdiaryrecordingdata/:Id/:mid', component: FosterCarerDiaryRecordingDataComponent, data: { breadcrumb: 'Foster Carer Diary Recording ' } },
    { path: 'fostercarerdiaryrecordinglist/:mid', component: FosterCarerDiaryRecordingListComponent, data: { breadcrumb: 'Foster Carer Diary Recording List' } },

    { path: 'fostercarerdiaryrecordingdata/:Id/:mid/:apage', component: FosterCarerDiaryRecordingDataComponent, data: { breadcrumb: 'Foster Carer Diary Recording ' } },
    { path: 'fostercarerdiaryrecordinglist/:mid/:apage', component: FosterCarerDiaryRecordingListComponent, data: { breadcrumb: 'Foster Carer Diary Recording List' } },

    { path: 'childeducationalinfo/:Id/:mid', component: ChildEducationalInfoComponent, data: { breadcrumb: 'Educational Info' } },
    { path: 'childeducationalinfolist/:mid', component: ChildEducationalInfoListComponent, data: { breadcrumb: 'Educational Info' } },
    { path: 'childeducationabsenceinfo/:Id/:mid', component: ChildEducationAbsenceInfoComponent, data: { breadcrumb: 'Absence Info ' } },
    { path: 'childeducationabsenceinfolist/:mid', component: ChildEducationAbsenceInfoListComponent, data: { breadcrumb: 'Absence Info List' } },
    { path: 'childeducationoutofschoolactivityinfo/:Id/:mid', component: ChildEducationOutofSchoolActivityInfoComponent, data: { breadcrumb: 'Out of School Activity Info ' } },
    { path: 'childeducationoutofschoolactivityinfolist/:mid', component: ChildEducationOutofSchoolActivityInfoListComponent, data: { breadcrumb: 'Out of School Activity Info List ' } },
    { path: 'childeducationpepinfo/:Id/:mid', component: ChildEducationPEPInfoComponent, data: { breadcrumb: 'PEP Info' } },
    { path: 'childeducationpepinfolist/:mid', component: ChildEducationPEPInfoListComponent, data: { breadcrumb: 'PEP Info ' } },
    { path: 'childeducationstudysupportinfo/:Id/:mid', component: ChildEducationStudySupportInfoComponent, data: { breadcrumb: 'Study Support Info ' } },
    { path: 'childeducationstudysupportinfolist/:mid', component: ChildEducationStudySupportInfoListComponent, data: { breadcrumb: 'Study Support Info List ' } },
    { path: 'childeducationvocationalcourseinfo/:Id/:mid', component: ChildEducationVocationalCourseInfoComponent, data: { breadcrumb: 'Vocational Course Info ' } },
    { path: 'childeducationvocationalcourseinfolist/:mid', component: ChildEducationVocationalCourseInfoListComponent, data: { breadcrumb: 'Vocational Course Info ' } },
    { path: 'childschooldetailinfo/:Id', component: ChildSchoolDetailInfoComponent, data: { breadcrumb: 'Child School Info' } },
    { path: 'childschooldetailinfolist', component: ChildSchoolDetailInfoListComponent, data: { breadcrumb: 'Child School Info' } },
    { path: 'childhealthinfo/:Id/:mid', component: ChildHealthInfoComponent, data: { breadcrumb: 'Health Assessment ' } },
    { path: 'childhealthinfolist/:mid', component: ChildHealthInfoListComponent, data: { breadcrumb: 'Health Assessment' } },
    { path: 'childhealthappointmentinfo/:Id/:mid', component: ChildHealthAppointmentInfoComponent, data: { breadcrumb: 'Health Appointment Info' } },
    { path: 'childhealthappointmentinfolist/:mid', component: ChildHealthAppointmentInfoListComponent, data: { breadcrumb: 'Health Appointment Info' } },
    { path: 'childhealthbehaviouralinfo', component: ChildHealthBehaviouralInfoComponent, data: { breadcrumb: 'Behavioural Info' } },
    { path: 'childhealthhospitalisationinfo/:Id/:mid', component: ChildHealthHospitalisationInfoComponent, data: { breadcrumb: 'Hospitalisation Info' } },
    { path: 'childhealthhospitalisationinfolist/:mid', component: ChildHealthHospitalisationInfoListComponent, data: { breadcrumb: 'Hospitalisation Info ' } },
    { path: 'childhealthimmunisationinfo/:Id/:mid', component: ChildHealthImmunisationInfoComponent, data: { breadcrumb: 'Immunisation Info' } },
    { path: 'childhealthimmunisationinfolist', component: ChildHealthImmunisationInfoListComponent, data: { breadcrumb: 'Immunisation Info' } },
    { path: 'childhealthmedicalvisitinfo/:Id/:mid', component: ChildHealthMedicalVisitInfoComponent, data: { breadcrumb: 'Medical Visit Info' } },
    { path: 'childhealthmedicalvisitinfolist/:mid', component: ChildHealthMedicalVisitInfoListComponent, data: { breadcrumb: 'Medical Visit Info' } },
    { path: 'childhealthmedicationinfo/:Id/:mid', component: ChildHealthMedicationInfoComponent, data: { breadcrumb: 'Medication Info' } },
    { path: 'childhealthmedicationinfolist/:mid', component: ChildHealthMedicationInfoListComponent, data: { breadcrumb: 'Medication Info' } },
    { path: 'childhealththerapyinfo/:Id/:mid', component: ChildHealthTherapyInfoComponent, data: { breadcrumb: 'Therapy Info' } },
    { path: 'childhealththerapyinfolist', component: ChildHealthTherapyInfoListComponent, data: { breadcrumb: 'Therapy Info' } },
    { path: 'physicianinfo/:Id', component: PhysicianInfoComponet, data: { breadcrumb: 'GP Info' } },
    { path: 'physicianinfolist/:mid', component: PhysicianInfoListComponet, data: { breadcrumb: 'GP Info List' } },
    { path: 'nextdayactionlog/:Id', component: NextDayActionLogComponent, data: { breadcrumb: 'Next Day Action Log' } },
    { path: 'nextdayactionloglist', component: NextDayActionLogListComponent, data: { breadcrumb: 'Next Day Action Log List ' } },
    { path: 'statutorymedical/:id/:mid', component: StatutoryMedicalComponet, data: { breadcrumb: 'Statutory Medical' } },
    { path: 'childuploaddocuments/:mid', component: ChildUploadDocuments, data: { breadcrumb: 'Upload Documents' } },
    { path: 'childplacementdischargehistory/:mid', component: PlacementandDischargehistory, data: { breadcrumb: 'Placement and Discharge History' } },
    { path: 'childplacementdischargehistorydata/:Id', component: PlacementandDischargeHistoryDataComponet, data: { breadcrumb: 'Placement and Discharge History' } },
    { path: 'ecmchildprogressreport/:id/:mid', component: EcmChildProgressReportComponent, data: { breadcrumb: 'ECM/Child Progress Report' } },
    { path: 'ecmchildprogressreportlist/:mid', component: EcmChildProgressReportListComponent, data: { breadcrumb: 'ECM/Child Progress Report' } },

    { path: 'ecmchildprogressreport/:id/:mid/:apage', component: EcmChildProgressReportComponent, data: { breadcrumb: 'ECM/Child Progress Report' } },
    { path: 'ecmchildprogressreportlist/:mid/:apage', component: EcmChildProgressReportListComponent, data: { breadcrumb: 'ECM/Child Progress Report' } },

    { path: 'safercarepolicylist/:mid', component: SaferCarePolicyList, data: { breadcrumb: 'Safe Care Policy List' } },
    { path: 'safercarepolicy/:Id/:CId/:mid', component: SafercarePolicy, data: { breadcrumb: 'Safe Care Policy' } },

    { path: 'safercarepolicylist/:mid/:apage', component: SaferCarePolicyList, data: { breadcrumb: 'Safe Care Policy List' } },
    { path: 'safercarepolicy/:Id/:CId/:mid/:apage', component: SafercarePolicy, data: { breadcrumb: 'Safe Care Policy' } },

    { path: 'riskassessmentlist/:mid', component: RiskAssessmentList, data: { breadcrumb: 'Risk Assessment List' } },
    { path: 'riskassessment/:Id/:CId/:mid', component: RiskAssessment, data: { breadcrumb: 'Risk Assessment' } },

    { path: 'riskassessmentlist/:mid/:apage', component: RiskAssessmentList, data: { breadcrumb: 'Risk Assessment List' } },
    { path: 'riskassessment/:Id/:CId/:mid/:apage', component: RiskAssessment, data: { breadcrumb: 'Risk Assessment' } },
    { path: 'childofstednotification/:Id/:mid', component: ChildOfstedNotificationComponent, data: { breadcrumb: 'Ofsted Notification' } },
    { path: 'childofstednotificationlist/:mid', component: ChildOfstedNotificationListComponent, data: { breadcrumb: 'Ofsted Notification' } },
    { path: 'childsanctiondetails/:Id/:mid', component: ChildSanctionDetailsComponent, data: { breadcrumb: 'Sanction Details' } },
    { path: 'childsanctiondetailslist/:mid', component: ChildSanctionDetailsListComponent, data: { breadcrumb: 'Sanction Details' } },
    { path: 'childmissingplacement/:Id/:mid', component: ChildMissingPlacementComponent, data: { breadcrumb: 'Child Missing Placement' } },
    { path: 'childmissingplacementlist/:mid', component: ChildMissingPlacementListComponent, data: { breadcrumb: 'Child Missing Placement' } },
    { path: 'childdaylogjournal/:mid', component: ChildDaylogjournalComponent, data: { breadcrumb: 'Child Day Log' } },
    { path: 'childdaylogdata/:Id/:mid', component: ChildDaylogDataComponent, data: { breadcrumb: 'Child Day Log' } },

    { path: 'childdaylogjournal/:mid/:apage', component: ChildDaylogjournalComponent, data: { breadcrumb: 'Child Day Log' } },
    { path: 'childdaylogdata/:Id/:mid/:apage', component: ChildDaylogDataComponent, data: { breadcrumb: 'Child Day Log' } },

    { path: 'childreferral/:mid', component: FosterChildReferral, data: { breadcrumb: 'Child Referral' } },
    { path: 'childprofilelist/:Id/:mid', component: FosterChildProfileList, data: { breadcrumb: 'Child Profile List' } },
    { path: 'originalreferral/:mid', component: OriginalReferral, data: { breadcrumb: 'Original Referral' } },
    { path: 'supervisoryhomevisitlist/:Id', component: SupervisoryHomeVisitListComponent, data: { breadcrumb: 'Supervisory Home Visit' } },
    { path: 'supervisoryhomevisitdata/:Sno/:mid', component: SupervisoryHomeVisitDataComponent, data: { breadcrumb: 'Supervisory Home Visit' } },
    { path: 'supervisoryhomevisitdata/:Id/:CarerSHVno/:Sno/:mid', component: SupervisoryHomeVisitDataComponent, data: { breadcrumb: 'Supervisory Home Visit' } },

    { path: 'supervisoryhomevisitlist/:Id/:apage', component: SupervisoryHomeVisitListComponent, data: { breadcrumb: 'Supervisory Home Visit' } },
    { path: 'supervisoryhomevisitdata/:Sno/:mid/:apage', component: SupervisoryHomeVisitDataComponent, data: { breadcrumb: 'Supervisory Home Visit' } },

    { path: 'childmonthlyprogressreport/:Id/:mid', component: ChildMonthlyProgressReportData, data: { breadcrumb: 'Monthly Progress Report' } },
    { path: 'childmonthlyprogressreportlist/:mid', component: ChildMonthlyProgressReportListComponent, data: { breadcrumb: 'Monthly Progress Report List' } },

    { path: 'hospitalinfo/:id', component: HospitalInfoDataComponet, data: { breadcrumb: 'Hospital Info' } },
    { path: 'hospitalinfolist/:mid', component: HospitalInfoListComponet, data: { breadcrumb: 'Hospital Info List' } },

    { path: 'placementcontact/:id', component: PlacementContactComponent, data: { breadcrumb: 'Placement Contact' } },
    { path: 'placementcontactlist/:mid', component: PlacementContactListComponent, data: { breadcrumb: 'Placement Contact List' } },
    { path: 'childypreport/:id', component: ChildYoungPersonReportDataComponent, data: { breadcrumb: 'Child Young Person (YP) Report' } },
    { path: 'childypreport/:id/:mid', component: ChildYoungPersonReportDataComponent, data: { breadcrumb: 'Child Young Person (YP) Report' } },
    { path: 'childypreportlist/:mid', component: ChildYoungPersonReportListComponent, data: { breadcrumb: 'Child Young Person (YP) Report List' } },
    { path: 'carersypprogress/:id', component: CarersYpProgressDataComponent, data: { breadcrumb: 'Carers YP Progress' } },
    { path: 'carersypprogresslist/:mid', component: CarersYpProgressListComponent, data: { breadcrumb: 'Carers YP Progress List' } },
    { path: 'csedata/:id', component: ChildCSEComponent, data: { breadcrumb: 'CSE' } },
    { path: 'cselist/:mid', component: ChildCSEListComponent, data: { breadcrumb: 'CSE List' } },
    { path: 'physicianchildmap/:mid', component: PhysicianChildMappingComponent, data: { breadcrumb: 'GP Child Mapping' } },
    { path: 'allegationdata/:id/:mid', component: ChildAllegationInfoDataComponent, data: { breadcrumb: 'Allegations' } },
    { path: 'allegationlist/:mid', component: ChildAllegationInfoListComponent, data: { breadcrumb: 'Allegations List' } },
    { path: 'complaintsdata/:id/:mid', component: ChildComplaintInfoDataComponent, data: { breadcrumb: 'Complaints' } },
    { path: 'complaintslist/:mid', component: ChildComplaintInfoListComponent, data: { breadcrumb: 'Complaints List' } },
    { path: 'incidentdata/:id/:mid', component: ChildIncidentInfoDataComponent, data: { breadcrumb: 'Incident' } },
    { path: 'incidentlist/:mid', component: ChildIncidentInfoListComponent, data: { breadcrumb: 'Incident Report List' } },
    { path: 'personalgoalsdata/:id', component: ChildPersonalGoalsDataComponent, data: { breadcrumb: 'Personal Goals' } },
    { path: 'personalgoalslist/:mid', component: ChildPersonalGoalsListComponent, data: { breadcrumb: 'Personal Goals List' } },
    { path: 'cladocumentation/:mid', component: CLADocumentationComponent, data: { breadcrumb: 'CLA Documentation' } },
    { path: 'childexploitationdata/:id/:mid', component: ChildExploitationDataComponent, data: { breadcrumb: 'Child Exploitation' } },
    { path: 'childexploitationlist/:mid', component: ChildExploitationListComponent, data: { breadcrumb: 'Child Exploitation List' } },
    { path: 'childriskassessmentnew/:mid', component: ChildRiskAssessmentNewDataComponent, data: { breadcrumb: 'Child Risk Assessment' } },
    { path: 'childriskassessmentdata/:id/:mid', component: ChildRiskAssessmentNewDataComponent, data: { breadcrumb: 'Child Risk Assessment' } },
    { path: 'childriskassessmentlist/:mid', component: ChildRiskAssessmentNewListComponent, data: { breadcrumb: 'Child Risk Assessment List' } },
    { path: 'childriskassessmentdata/:id/:mid/:apage', component: ChildRiskAssessmentNewDataComponent, data: { breadcrumb: 'Child Risk Assessment' } },
    { path: 'childriskassessmentlist/:mid/:apage', component: ChildRiskAssessmentNewListComponent, data: { breadcrumb: 'Child Risk Assessment List' } },
    { path: 'careplandata/:id/:mid', component: ChildCarePlanDataComponent, data: { breadcrumb: 'Care Plan' } },
    { path: 'careplanlist/:mid', component: ChildCarePlanListComponent, data: { breadcrumb: 'Care Plan List' } },
    { path: 'possessionssavingdata/:id', component: ChildPossessionsSavingDataComponent, data: { breadcrumb: 'Possessions and Savings' } },
    { path: 'possessionssavinglist/:mid', component: ChildPossessionsSavingListComponent, data: { breadcrumb: 'Possessions and Savings List' } },
    { path: 'placementplandata/:id/:mid', component: ChildPlacementPlanDataComponent, data: { breadcrumb: 'Possessions and Savings' } },
    { path: 'placementplanlist/:mid', component: ChildPlacementPlanListComponent, data: { breadcrumb: 'Possessions and Savings List' } },
    { path: 'd3personalinfodata/:id/:mid', component: ChildD3PersonalInformationDataComponent, data: { breadcrumb: 'D3 Personal Information' } },
    { path: 'd3personalinfolist/:mid', component: ChildD3PersonaalInformationListComponent, data: { breadcrumb: 'D3 Personal Information List' } },
    { path: 'childspecificplan/:mid', component: ChildSpecificPlanComponent, data: { breadcrumb: 'Child Specific Plan' } },
    { path: 'childmanagementdecisiondata/:Id/:mid', component: ChildManagementDecisionDataComponent, data: { breadcrumb: 'Management Decision' } },
    { path: 'childmanagementdecisionlist/:mid', component: ChildManagementDecisionListComponent, data: { breadcrumb: 'Management Decision List' } },
    { path: 'schoolreportsdata/:Id/:mid', component: ChildSchoolReportsComponent, data: { breadcrumb: 'School Report' } },
    { path: 'schoolreportslist/:mid', component: ChildSchoolReportsListComponent, data: { breadcrumb: 'School Reports List' } },
    { path: 'childhealththerapyinfonew/:Id/:mid', component: ChildHealthTherapyInfoNewComponent, data: { breadcrumb: 'Therapy Info New' } },
    { path: 'childhealththerapyinfonewlist/:mid', component: ChildHealthTherapyInfoNewListComponent, data: { breadcrumb: 'Therapy Info New' } },
    { path: 'childsafecarefcsignature/:sno', component: SafercarePolicyFCSignatureComponents, data: { breadcrumb: ' SIGNATURE' } },
    { path: 'independenceplan/:mid', component: IndependencePlanComponent, data: { breadcrumb: 'Independence Plan' } },
    { path: 'riskassessmentfcsignature/:sno/:cid', component: ChildRiskAssessmentFCSignatureComponents, data: { breadcrumb: ' SIGNATURE' } },
    { path: 'childShvfcsignature/:cid/:childsqno', component: ChildSHVFCSignatureComponents, data: { breadcrumb: 'Signature ' } },
    { path: 'childgallry/:mid', component: ChildGallryComponent, data: { breadcrumb: 'Child Event Gallery' } },
    { path: 'childgallry/:mid/:take', component: ChildGallryComponent, data: { breadcrumb: 'Child Event Gallery' } },
    { path: 'childgallrydata/:mid', component: ChildGalleryDataDocuments, data: { breadcrumb: 'Child Event Gallery' } },
    { path: 'childgallrydetails/:id/:take', component: ChildGalleryDetailsComponent, data: { breadcrumb: 'Child Event Gallery' } },
    { path: 'riskassessmentinitiallist/:mid', component: RiskAssessmentInitialList, data: { breadcrumb: 'Risk Assessment Initial List' } },
    { path: 'riskassessmentinitialdata/:Id/:CId/:mid', component: RiskAssessmentInitialData, data: { breadcrumb: 'Risk Assessment Initial' } },
    { path: 'ecmchildprogressreportfcsignature/:sno', component: EcmchildprogressreportfcsignatureComponents, data: { breadcrumb: 'SIGNATURE' } },
    { path: 'childexploitationsignature/:sno', component: ChildExploitationSignatureComponents, data: { breadcrumb: 'SIGNATURE' } },
    { path: 'parentchilddailyweeklylist/:mid', component: ParentChildDailyWeeklyRecordingList, data: { breadcrumb: 'Parent Child Daily/Weekly Recording List' } },
    { path: 'parentchilddailyweeklydata/:Id/:mid', component: ParentChildDailyWeeklyRecordingData, data: { breadcrumb: 'Parent Child Daily/Weekly Recording' } },
    { path: 'childriskassessmentlistsignature/:sno', component: ChildRiskAssessmentNewFCSignatureComponents, data: { breadcrumb: ' SIGNATURE' } },
    { path: 'cladocumentationdynamiclist/:mid', component: ChildCLADocumentationDynamicListComponent, data: { breadcrumb: 'CLA DOCUMENTATION List' } },
    { path: 'cladocumentationdynamicdata/:Id/:mid', component: ChildCLADocumentationDynamicComponent, data: { breadcrumb: 'CLA DOCUMENTATION' } },
    { path: 'Schedule6list/:mid', component: ChildCchedule6ListComponent, data: { breadcrumb: 'Schedule 6 List' } },
    { path: 'schedule6data/:id/:mid', component: ChildSchedule6DataComponent, data: { breadcrumb: 'Schedule 6' } },
    { path: 'casediscussionminuteslist/:mid', component: SafeCasediscussionminutesListComponent, data: { breadcrumb: 'Case Discussion Minutes List' } },
    { path: 'casediscussionminutesdata/:id/:mid', component: SafeCasediscussionminutesDataComponent, data: { breadcrumb: 'Case Discussion Minutes' } },
    { path: 'disruptionmeetingminuteslist/:mid', component: SafeDisruptionMeetingMinutesListComponent, data: { breadcrumb: 'Disruption meeting minutes List' } },
    { path: 'disruptionmeetingminutesdata/:id/:mid', component: SafeDisruptionMeetingMinutesDataComponent, data: { breadcrumb: 'Disruption meeting minutes ' } },
    { path: 'riskmanagementoutingslist/:mid', component: RiskManagementOutingsListComponent, data: { breadcrumb: 'Risk Management Outings List' } },
    { path: 'riskmanagementoutingsdata/:id/:mid', component: RiskManagementoutingsDataComponent, data: { breadcrumb: 'Risk Management Outings' } },
    { path: 'riskmanagementplanlist/:mid', component: RiskManagementplanListComponent, data: { breadcrumb: 'Risk Management Plan List' } },
    { path: 'riskmanagementplandata/:id/:mid', component: ChildRiskManagementPlansDataComponent, data: { breadcrumb: 'Risk Management Plan' } },
    { path: 'riskmanagementwelist/:mid', component: ChildRiskManagementWorkExperienceListComponent, data: { breadcrumb: 'Risk Management Work Experience List' } },
    { path: 'riskmanagementwedata/:id/:mid', component: ChildRiskManagementWorkExperienceDataComponent, data: { breadcrumb: 'Risk Management Work Experience' } },
    { path: 'safeguardingdaylogjournallist/:mid', component: ChildSafeguardingDayLogJournalListComponent, data: { breadcrumb: 'Safeguarding Day Log Journal List' } },
    { path: 'safeguardingdaylogjournaldata/:id/:mid', component: ChildSafeguardingDayLogJournalDataComponent, data: { breadcrumb: 'Safeguarding Day Log Journal' } },
    { path: 'youngpeoplesactivitieslist/:mid', component: ChildYoungPeoplesActivitiesListComponent, data: { breadcrumb: 'Young Peoples Activities List' } },
    { path: 'youngpeoplesactivitiesdata/:id/:mid', component: ChildYoungPeoplesActivitiesDataComponent, data: { breadcrumb: 'Young Peoples Activities' } },
    { path: 'ypsupervisionreviewlist/:mid', component: ChildYPSupervisionReviewListComponent, data: { breadcrumb: 'YP Supervision Review List' } },
    { path: 'ypsupervisionreviewdata/:id/:mid', component: ChildYPSupervisionReviewDataComponent, data: { breadcrumb: 'YP Supervision Review' } },
    { path: 'riskandneedsassessmentslist/:mid', component: ChildRiskNeedsAssessmentsListComponent, data: { breadcrumb: 'Risk and Needs Assessments List' } },
    { path: 'riskandneedsassessmentsdata/:id/:mid', component: ChildRiskNeedsAssessmentsDataComponent, data: { breadcrumb: 'Risk and Needs Assessments' } },
    { path: 'therapyupdatereportslist/:mid', component: ChildTherapyUpdateReportsListComponent, data: { breadcrumb: 'Therapy Update Reports List' } },
    { path: 'therapyupdatereportsdata/:id/:mid', component: ChildTherapyUpdateReportsDataComponent, data: { breadcrumb: 'Therapy Update Reports' } },
    { path: 'riskfactorslist/:mid', component: RiskFactorsListComponent, data: { breadcrumb: 'Risk Factors List' } },
    { path: 'riskfactorsdata/:id/:mid', component: RiskFactorsDataComponent, data: { breadcrumb: 'Risk Factors' } },
    { path: 'holidayriskassessmentlist/:mid', component: ChildholidayriskassessmentListComponent, data: { breadcrumb: 'Holiday Risk Assessment List' } },
    { path: 'holidayriskassessmentdata/:id/:mid', component: ChildHolidayRiskAssessmentDataComponent, data: { breadcrumb: 'Holiday Risk Assessment' } },
    { path: 'allergylist/:mid', component: ChildHealthAllergyListComponent, data: { breadcrumb: 'Allergy List' } },
    { path: 'allergydata/:id/:mid', component: ChildHealthAllergydataComponent, data: { breadcrumb: 'Allergy' } },
    { path: 'voiceofthechildlist/:mid', component: voiceofthechildListComponent, data: { breadcrumb: 'Voice of the Child List' } },
    { path: 'voiceofthechilddata/:id/:mid', component: voiceofthechilddataComponent, data: { breadcrumb: 'Voice of the Child' } },
    { path: 'feedbacklist/:mid', component: ChildFeedbackInfoListComponent, data: { breadcrumb: 'Child Feedback List' } },
    { path: 'childfeedbackinfo/:id/:mid', component: ChildFeedbackInfoComponent, data: { breadcrumb: 'Child Feedback' } },
    { path: 'fcdiaryrecordingfcsignature/:sno/:cid', component: FostercarerdiaryrecordingFCSignatureComponents, data: { breadcrumb: ' SIGNATURE' } },

    { path: 'riskassessmentlistparamount/:mid/:apage', component: RiskAssessmentListParamountComponent, data: { breadcrumb: 'Risk Assessment' } },
    { path: 'riskassessmentlistparamount/:mid', component: RiskAssessmentListParamountComponent, data: { breadcrumb: 'Risk Assessment' } },
    { path: 'riskassessmentdataparamount/:id/:cid/:mid/:apage', component: RiskAssessmentParamount, data: { breadcrumb: 'Risk Assessment' } },
    { path: 'riskassessmentdataparamountfcsignature/:sno/:cid', component: ChildRiskAssessmentFCSignatureParamountComponents, data: { breadcrumb: ' SIGNATURE' } },


];




@NgModule({
    imports:
    [HeaderModule, BarRatingModule, UploadDocumentsModule,
        NgImageSliderModule,
        SuperAdminModule,
        CommonModule, MultiselectDropdownModule, ContactInfoModule, PipesCustomModule, PersonalInfoModule,
        DirectivesModule, FormsModule, ReactiveFormsModule,
        DynamicModule, CommonInfoModule, ReferralModule,MultiSelectModule,LaddaModule,
        RouterModule.forChild(routes),NgSelectModule
    ],

    providers: [ChildProfileService, APICallService],

    declarations:
    [PlacementContactListComponent, PlacementContactComponent, ChildYoungPersonReportListComponent, ChildYoungPersonReportDataComponent,
        ChildChronologyOfEventDataComponent, LocalAuthoritySWHistoryChildListComponent, EcmChildProgressReportListComponent, ChildProfileLinkComponent,
        ChildCLAReviewDataComponent, ChildCLAReviewListComponent, ChildOOHReportDataComponent, ChildOOHReportListComponent,
        FosterCarerDiaryRecordingDataComponent, FosterCarerDiaryRecordingListComponent,
        ChildChronologyofEventComponet, ChildChronologyOfEventDataComponent, ChildChronologyOfEventListComponent, ChildPathwayplanComponent, ChildPathwayplanListComponent,
        ChildEducationalInfoComponent, ChildEducationalInfoListComponent, ChildEducationAbsenceInfoComponent, ChildEducationAbsenceInfoListComponent,
        ChildEducationExclusionInfoComponent, ChildEducationExclusionInfoListComponent, ChildEducationOutofSchoolActivityInfoComponent,
        ChildEducationOutofSchoolActivityInfoListComponent, ChildEducationPEPInfoComponent, ChildEducationPEPInfoListComponent,
        ChildEducationStudySupportInfoComponent, ChildEducationStudySupportInfoListComponent, ChildEducationVocationalCourseInfoComponent,
        ChildEducationVocationalCourseInfoListComponent, ChildSchoolDetailInfoComponent, ChildSchoolDetailInfoListComponent,
        ChildHealthInfoComponent, ChildHealthInfoListComponent, ChildHealthAppointmentInfoComponent, ChildHealthAppointmentInfoListComponent,
        ChildHealthBehaviouralInfoComponent, ChildHealthImmunisationInfoComponent, ChildHealthImmunisationInfoListComponent,
        ChildHealthMedicalVisitInfoComponent, ChildHealthMedicalVisitInfoListComponent, ChildHealthMedicationInfoComponent, ChildHealthMedicationInfoListComponent,
        ChildHealthTherapyInfoComponent, ChildHealthTherapyInfoListComponent, PhysicianInfoComponet, PhysicianInfoListComponet,
        NextDayActionLogComponent, NextDayActionLogListComponent, StatutoryMedicalComponet, ChildUploadDocuments, PlacementandDischargehistory, PlacementandDischargeHistoryDataComponet,
        ChildHealthMedicalVisitInfoComponent, ChildHealthMedicalVisitInfoListComponent, ChildHealthMedicationInfoComponent,
        ChildHealthMedicationInfoListComponent, ChildHealthTherapyInfoComponent, ChildHealthTherapyInfoListComponent,
        PhysicianInfoComponet, PhysicianInfoListComponet, NextDayActionLogComponent, NextDayActionLogListComponent,
        StatutoryMedicalComponet, ChildHealthHospitalisationInfoComponent, ChildHealthHospitalisationInfoListComponent,
        EcmChildProgressReportComponent, SaferCarePolicyList, SafercarePolicy, RiskAssessmentList, RiskAssessment, ChildOfstedNotificationComponent,
        ChildOfstedNotificationListComponent, ChildSanctionDetailsComponent, ChildSanctionDetailsListComponent, ChildMissingPlacementComponent,
        ChildMissingPlacementListComponent, ChildHolidayDetailsInfoComponent, ChildHolidayDetailsInfoListComponent, ChildQuestionnaireInfoComponent,
        ChildQuestionnaireInfoListComponent, ChildFamilyPersonOrgInvolvedComponent, ChildFamilyPersonOrgInvolvedListComponent,
        ChildEducationGradeInfoComponent, ChildEducationGradeInfoListComponent, LocalAuthoritySWHistoryComponent, ChildDaylogjournalComponent,
        FosterChildReferral, FosterChildProfileList, OriginalReferral, ChildDaylogDataComponent, SupervisoryHomeVisitListComponent, SupervisoryHomeVisitDataComponent
        , ChildMonthlyProgressReportListComponent, ChildMonthlyProgressReportData
        , HospitalInfoListComponet, HospitalInfoDataComponet, CarersYpProgressListComponent, CarersYpProgressDataComponent,
        ChildCSEComponent, ChildCSEListComponent, PhysicianChildMappingComponent,
        ChildAllegationInfoListComponent, ChildAllegationInfoDataComponent,
        ChildComplaintInfoListComponent, ChildComplaintInfoDataComponent,
        ChildIncidentInfoListComponent, ChildIncidentInfoDataComponent,
        ChildPersonalGoalsDataComponent, ChildPersonalGoalsListComponent, CLADocumentationComponent,
        ChildExploitationListComponent, ChildExploitationDataComponent,
        ChildRiskAssessmentNewListComponent, ChildRiskAssessmentNewDataComponent,
        ChildCarePlanDataComponent, ChildCarePlanListComponent, ChildPossessionsSavingDataComponent, ChildPossessionsSavingListComponent,
        ChildPlacementPlanDataComponent, ChildPlacementPlanListComponent, ChildD3PersonaalInformationListComponent, ChildD3PersonalInformationDataComponent,
        ChildSpecificPlanComponent, ChildManagementDecisionListComponent, ChildManagementDecisionDataComponent,
        ChildSchoolReportsListComponent, ChildSchoolReportsComponent, ChildHealthTherapyInfoNewListComponent, ChildHealthTherapyInfoNewComponent,
        SafercarePolicyFCSignatureComponents, IndependencePlanComponent,ChildRiskAssessmentFCSignatureComponents,ChildSHVFCSignatureComponents,
        ChildGallryComponent,ChildGalleryDataDocuments,ChildGalleryDetailsComponent,
        RiskAssessmentInitialList,RiskAssessmentInitialData,EcmchildprogressreportfcsignatureComponents,ChildExploitationSignatureComponents,
        ParentChildDailyWeeklyRecordingList,ParentChildDailyWeeklyRecordingData,ChildRiskAssessmentNewFCSignatureComponents,
        ChildCLADocumentationDynamicComponent,ChildCLADocumentationDynamicListComponent,
		    ChildCchedule6ListComponent,ChildSchedule6DataComponent,
            SafeCasediscussionminutesListComponent,SafeCasediscussionminutesDataComponent,
            SafeDisruptionMeetingMinutesListComponent,SafeDisruptionMeetingMinutesDataComponent,
            RiskManagementOutingsListComponent,RiskManagementoutingsDataComponent,
            ChildRiskManagementPlansDataComponent,RiskManagementplanListComponent,
            ChildRiskManagementWorkExperienceDataComponent,ChildRiskManagementWorkExperienceListComponent,
            ChildSafeguardingDayLogJournalDataComponent,ChildSafeguardingDayLogJournalListComponent,
            ChildYoungPeoplesActivitiesDataComponent,ChildYoungPeoplesActivitiesListComponent,
            ChildYPSupervisionReviewDataComponent,ChildYPSupervisionReviewListComponent,
            ChildRiskNeedsAssessmentsDataComponent,ChildRiskNeedsAssessmentsListComponent,
            ChildTherapyUpdateReportsDataComponent,ChildTherapyUpdateReportsListComponent,
            RiskFactorsDataComponent,RiskFactorsListComponent,
            ChildHolidayRiskAssessmentDataComponent,ChildholidayriskassessmentListComponent,
            ChildHealthAllergyListComponent,ChildHealthAllergydataComponent,
            voiceofthechilddataComponent,voiceofthechildListComponent,ChildFeedbackInfoComponent,ChildFeedbackInfoListComponent,
            FostercarerdiaryrecordingFCSignatureComponents,      
            ChildRiskAssessmentFCSignatureParamountComponents,
            RiskAssessmentListParamountComponent,
            RiskAssessmentParamount
    ],
    exports: [ChildProfileLinkComponent, LocalAuthoritySWHistoryComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],


})

export class ChildModule { }
