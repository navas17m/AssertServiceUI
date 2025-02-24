
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { SimpleTimer } from 'ng2-simple-timer';
import { NgxSpinnerModule } from "ngx-spinner";
import { MultiSelectModule } from 'primeng/multiselect';
import { DirectivesModule } from '../../theme/directives/directives.module';
import { PipesModule } from '../../theme/pipes/pipes.module';
import { CommonInfoModule } from '../common/common.module';
import { ContactInfoModule } from '../contact/contactinfo.module';
import { DynamicModule } from '../dynamic/dynamic.module';
import { EditorsModule } from '../editors/editors.module';
import { ChildMatchingChecklistComponent } from '../fosterchild/childmatchingchecklist.component';
import { ChildMatchingChecklistDataComponent } from '../fosterchild/childmatchingchecklistdata.component';
import { HeaderModule } from '../headers/header.module';
import { PersonalInfoModule } from '../personalinfo/personalinfo.module';
import { PipesCustomModule } from '../pipes/pipes.module';
import { APICallService } from '../services/apicallservice.service';
import { ChildProfileService } from '../services/childprofile.service';
import { UploadDocumentsModule } from '../uploaddocument/uploaddocuments.module';
import { BehaviourGetAllResolver } from './behaviorgetallresolver.service';
import { ChildDayLogJournalDataComponent } from './childdaylogjournaldata.component';
import { ChildDayLogJournalListComponent } from './childdaylogjournallist.component';
import { ChildDischargeComponet } from './childdischarge.component';
import { ChildGetAllResolver } from './childgetallresolver.service';
import { ChildGetByIdResolver } from './childgetbyidresolver.service';
import { MoveToCurrentReferralComponent } from './childmovetocurrentreferral.component';
import { ChildPlacementComponet } from './childplacement.component';
import { ChildProfileComponet } from './childprofile.component';
import { ChildProfileListComponet } from './childprofilelist.component';
import { ChildReferralComponet } from './childreferral.component';
import { ChildRespiteComponet } from './childrespite.component';
import { ChildSnapshotComponet } from './childsnapshot.component';
import { ChildSnapshotNewComponet } from './childsnapshotnew.component';
import { DisabilityGetAllResolver } from './disabilitygetallresolver.service';
import { LanguageGetAllResolver } from './languageresolver.service';
import { LocalAuthoritySWHistoryComponent } from './localauthorityswhistory.component';
import { LocalAuthoritySWHistoryListComponent } from './localauthorityswhistorylist.component';
import { LocalAuthoritySWVDateHistoryComponent } from './localauthorityswvisitdatehistory.component';
import { OriginalReferral } from './originalreferral.component';
import { RedirectLink } from './redirectlink.component';
import { ReferralProfileLinkComponent } from './referralprofilelink.component';
import { UploadDocuments } from './uploaddocuments.component';
import { UploadChildPlacementComponent } from './uploadplacement.component';
import { LaddaModule } from 'angular2-ladda';

export const routes: Routes = [
    { path: '', redirectTo: 'childprofilelist/0/16', pathMatch: 'full' },
    {
        path: 'childprofilelist/:Id/:mid',
        component: ChildProfileListComponet,
        data: { breadcrumb: 'Child Profile List' },

    },
    {
        path: 'redirectlink/:Id',
        component: RedirectLink,
    },
    {
        path: 'referralprofilelink/:mid',
        component: ReferralProfileLinkComponent,
        data: { breadcrumb: 'Child Profile List' },

    },
    {
        path: 'childprofile/:Id', component: ChildProfileComponet, data: { breadcrumb: 'Child Profile' },

    },
    {
        path: 'quickreferral/:Id/:mid', component: ChildProfileComponet, data: { breadcrumb: 'Quick Referral' }, resolve: {
            getchilds: ChildGetAllResolver
        }
    },
    {
        path: 'childreferral/:mid',
        component: ChildReferralComponet,
        data: { breadcrumb: 'Child Referral' },
        resolve: {
            
        }
    },
    {
        path: 'originalreferral/:mid',
        data: { breadcrumb: 'Original Referral' },
        component: OriginalReferral
    },
    {
        path: 'childplacement/:mid',
        data: { breadcrumb: 'Child Placement' },
        component: ChildPlacementComponet
    },
    {
        path: 'childrespite/:mid',
        data: { breadcrumb: 'Child Respite' },
        component: ChildRespiteComponet
    },
    {
        path: 'childdischarge/:mid',
        data: { breadcrumb: 'Child Discharge' },
        component: ChildDischargeComponet
    },
    {
        path: 'childdaylogdata/:Id/:mid',
        component: ChildDayLogJournalDataComponent,
        data: { breadcrumb: 'Day Log/Journal Entries' },

    },
    {
        path: 'childdayloglist/:mid',
        component: ChildDayLogJournalListComponent,
        data: { breadcrumb: 'Day Log/Journal Entries' },

    },
    {
        path: 'childdaylogdata/:Id/:mid/:apage',
        component: ChildDayLogJournalDataComponent,
        data: { breadcrumb: 'Day Log/Journal Entries' },

    },
    {
        path: 'childdayloglist/:mid/:apage',
        component: ChildDayLogJournalListComponent,
        data: { breadcrumb: 'Day Log/Journal Entries' },

    },
    {
        path: 'lasocialworkerhistory/:id/:cid/:mid',
        component: LocalAuthoritySWHistoryComponent,
        data: { breadcrumb: 'LA Social Worker History' },

    },
    {
        path: 'lasocialworkerhistorylist/:mid',
        component: LocalAuthoritySWHistoryListComponent,
        data: { breadcrumb: 'LA Social Worker History' },

    },
    { path: 'uploaddocuments/:mid', component: UploadDocuments, data: { breadcrumb: 'Upload Documents' } },
    { path: 'childsnapshot', component: ChildSnapshotComponet, data: { breadcrumb: 'Child Snapshot' } },
    { path: 'childmovetocurrentreferral/:mid', component: MoveToCurrentReferralComponent, data: { breadcrumb: 'Move to Current Referral' } },
    { path: 'childmatchingchecklistdata/:Id/:mid', component: ChildMatchingChecklistDataComponent, data: { breadcrumb: 'Matching Checklist' } },
    { path: 'childmatchingchecklist/:mid', component: ChildMatchingChecklistComponent, data: { breadcrumb: 'Matching Checklist' } },
    { path: 'childsnapshot/:mid', component: ChildSnapshotNewComponet, data: { breadcrumb: 'Child Snapshot' } },
    { path: 'uploadplacement/:mid', component: UploadChildPlacementComponent, data: { breadcrumb: 'Upload Child Placement' } },

];

@NgModule({
    imports: [HeaderModule, UploadDocumentsModule, PipesModule, EditorsModule, NgSelectModule,
        CommonModule, MultiselectDropdownModule, ContactInfoModule, PipesCustomModule, PersonalInfoModule,
        DirectivesModule, FormsModule, ReactiveFormsModule, DynamicModule, CommonInfoModule,
        NgxSpinnerModule,MultiSelectModule,LaddaModule,
        RouterModule.forChild(routes)
    ],
    providers: [APICallService, SimpleTimer, ChildGetAllResolver, ChildGetByIdResolver, ChildProfileService, LanguageGetAllResolver, BehaviourGetAllResolver, DisabilityGetAllResolver,
    ],

    declarations: [ChildProfileListComponet, ChildProfileComponet, ChildReferralComponet, ReferralProfileLinkComponent, RedirectLink,
        ChildPlacementComponet, ChildDischargeComponet, ChildRespiteComponet, ChildDayLogJournalDataComponent, ChildDayLogJournalListComponent,
        OriginalReferral, LocalAuthoritySWHistoryComponent, LocalAuthoritySWVDateHistoryComponent, UploadDocuments,
        ChildSnapshotComponet, LocalAuthoritySWHistoryListComponent, MoveToCurrentReferralComponent,
        ChildMatchingChecklistDataComponent, ChildMatchingChecklistComponent,ChildSnapshotNewComponet,UploadChildPlacementComponent

    ],
    exports: [ChildDayLogJournalListComponent, LocalAuthoritySWHistoryListComponent, ChildDayLogJournalDataComponent, LocalAuthoritySWHistoryComponent, ChildProfileListComponet,
        ChildReferralComponet, OriginalReferral, UploadDocuments, ChildSnapshotComponet,ChildSnapshotNewComponet],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class ReferralModule { }
