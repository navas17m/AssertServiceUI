import { APICallService } from '../services/apicallservice.service';
import { Component, ViewChild} from '@angular/core';
import {Common } from '../common'
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component({
    selector: 'ChildChronologyofEvent',
    templateUrl: './childchronologyofevent.component.template.html',
    styleUrls: ['../dashboard/feed/feed.component.scss'],
})

export class ChildChronologyofEventComponet {
    message: MessageDTO = new MessageDTO();
    controllerName = "ChildChronologyOfEvent";
    ChildID: number;
    objQeryVal;
    srcPath = "assets/img/app/Photonotavail.png";
    referralsExpanded = false;
    placementExpanded = false;
    daylogExpanded = false;
    oohReportExpanded = false;
    OfstedNotiExpanded = false;
    missingPlaceExpanded = false;
    absenceInfoExpanded = false;
    exclusionInfoExpanded = false;
    satsInfoExpanded = false;
    vocationalExpanded = false;
    hospitalizationExpanded = false;
    therapyExpanded = false;
    ImmunisationsExpanded = false;
    AllegationExpanded = false;
    ComplaintExpanded = false;
    IncidentExpanded = false;
    RiskAssessmentExpanded = false;

    insReferral;
    insChildPlacement;
    insDayLog = [];
    insOohReport = [];
    insOfstedNoti = [];
    insMissingPlace = [];
    insAbsenceInfo = [];
    insExclusionInfo = [];
    insSATSInfo = [];
    insVocational = [];
    insHospitalization = [];
    insTherapy = [];
    insImmunisations = [];
    insAllegation = [];
    insComplaint = [];
    insIncident = [];
    insRiskAssessment = []; insChronologyData;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=191;
    constructor(private activatedroute: ActivatedRoute, private _router: Router,
        private apiService: APICallService) {

        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindChildChronologyOfEvent();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/childchronologyofevent/4");
            this._router.navigate(['/pages/referral/childprofilelist/1/16']);
        }

        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }

    bindChildChronologyOfEvent() {
        if (this.ChildID != null) {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.apiService.get(this.controllerName, "GetChronologyOfEventByChildId", this.ChildID).then(data => {
                this.insChronologyData = data;
                this.insReferral = data.ChildReferral;
                this.insChildPlacement = data.ChildPlacement;
                this.insDayLog = data.ChildDayLogJournal;
                this.insOohReport = data.ChildOOHReport;
                this.insOfstedNoti = data.ChildOfstedNotification;
                this.insMissingPlace = data.ChildMissingPlacement;
                this.insAbsenceInfo = data.ChildEducationAbsenceInfo;
                this.insExclusionInfo = data.ChildEducationExclusionInfo;
                this.insSATSInfo = data.ChildEducationGradeInfo;
                this.insVocational = data.ChildEducationVocationalCourseInfo;
                this.insHospitalization = data.ChildHealthHospitalisationInfo;
                this.insTherapy = data.ChildHealthTherapyInfo;
                this.insImmunisations = data.ChildHealthImmunisationInfo;
                this.insAllegation = data.ChildAllegationInfo;
                this.insComplaint = data.ChildComplaintsInfo;
                this.insIncident = data.ChildIncidentInfo;
                this.insRiskAssessment = data.ChildRiskAssessment;

            });
        }
    }

    expandMessage(id) {
        // message.expanded = !message.expanded;

        switch (id) {
            case 1: {
                this.referralsExpanded = !this.referralsExpanded;
                break;
            }
            case 2: {
                this.placementExpanded = !this.placementExpanded;
                break;
            }
            case 3: {
                this.daylogExpanded = !this.daylogExpanded;
                break;
            }
            case 4: {
                this.oohReportExpanded = !this.oohReportExpanded;
                break;
            }
            case 5: {
                this.OfstedNotiExpanded = !this.OfstedNotiExpanded;
                break;
            }
            case 6: {
                this.missingPlaceExpanded = !this.missingPlaceExpanded;
                break;
            }
            case 7: {
                this.absenceInfoExpanded = !this.absenceInfoExpanded;
                break;
            }
            case 8: {
                this.exclusionInfoExpanded = !this.exclusionInfoExpanded;
                break;
            }
            case 9: {
                this.satsInfoExpanded = !this.satsInfoExpanded;
                break;
            }
            case 10: {
                this.vocationalExpanded = !this.vocationalExpanded;
                break;
            }
            case 11: {
                this.hospitalizationExpanded = !this.hospitalizationExpanded;
                break;
            }
            case 12: {
                this.therapyExpanded = !this.therapyExpanded;
                break;
            }
            case 13: {
                this.ImmunisationsExpanded = !this.ImmunisationsExpanded;
                break;
            }
            case 14: {
                this.AllegationExpanded = !this.AllegationExpanded;
                break;
            }
            case 15: {
                this.ComplaintExpanded = !this.ComplaintExpanded;
                break;
            }
            case 16: {
                this.IncidentExpanded = !this.IncidentExpanded;
                break;
            }
            case 17: {
                this.RiskAssessmentExpanded = !this.RiskAssessmentExpanded;
                break;
            }
        }
    }

    public fnShowImage(ImageId) {
        if (ImageId != null) {
            this.apiService.get("UploadDocuments", "GetImageById", ImageId).then(data => {
                //this.uploadServie.GetImageById(ImageId).then(data => {
                this.srcPath = "data:image/jpeg;base64," + data;
            });
        }
        else {
            this.srcPath = "assets/img/app/Photonotavail.png";
        }
    }

    public fnSetImage(image) {
        if (image) {
            return "data:image/jpeg;base64," + image;
        }
        else
            return "assets/img/app/Photonotavail.png";
    }
}

export class MessageDTO {
    expanded: boolean;
    type: string;
    SequenceNo: number;
    profilePicture: string;
    text: string = "Guys, check this out: A police officer found a perfect hiding place for watching for speeding motorists. One day, the officer was amazed when Guys, check this out: A police officer found a perfect hiding place for watching for speeding motorists. One day, the officer was amazed when Guys, check this out: A police officer found a perfect hiding place for watching for speeding motorists. One day, the officer was amazed when ";
    link: string;
    header: string;
    date = new Date();
}
