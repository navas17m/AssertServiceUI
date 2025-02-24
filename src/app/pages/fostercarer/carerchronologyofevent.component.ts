import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component({
    selector: 'CarerChronologyofEvent',
    templateUrl: './carerchronologyofevent.component.template.html',
    styleUrls: ['../dashboard/feed/feed.component.scss'],
})

export class CarerChronologyofEventComponet {
    message: MessageDTO = new MessageDTO();
    controllerName = "CarerChronologyOfEvent";
    CarerParentId: number;
    objQeryVal;
    srcPath = "assets/img/app/Photonotavail.png";


    CarerApprovalInfoExpanded = false;
    ChildPlacementExpanded = false;
    ChangeOfApprovalExpanded = false;
    CarerDayLogJournalExpanded = false;
    CarerAnnualReviewExpanded = false;
    CarerIncidentInfoExpanded = false;
    CarerAllegationInfoExpanded = false;
    CarerComplaintsInfoExpanded = false;
    DetailsofBirthChildrenExpanded = false;
    SupervisoryHomeVisitExpanded = false;
    UnannouncedHomeVisitExpanded = false;
    OOHReportExpanded = false;
    PetQuestionnaireExpanded = false;

    insCarerApprovalInfo;
    insChildPlacement=[];
    insChangeOfApproval;
    insCarerDayLogJournal = [];
    insCarerAnnualReview = [];
    insCarerIncidentInfo = [];
    insCarerAllegationInfo = [];
    insCarerComplaintsInfo = [];
    insDetailsofBirthChildren= [];
    insSupervisoryHomeVisit = [];
    insUnannouncedHomeVisit= [];
    insOOHReport = [];
    insPetQuestionnaire = [];
    insChronologyData;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=236;
    constructor(private activatedroute: ActivatedRoute, private _router: Router,
        private apiService: APICallService) {


        if (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0") {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 36]);
        }
        else {
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            this.bindCarerChronologyOfEvent();
        }
        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }

    bindCarerChronologyOfEvent() {
        if (this.CarerParentId != null) {
            this.apiService.get(this.controllerName, "GetChronologyOfEventById", this.CarerParentId).then(data => {
                this.insChronologyData = data;
                this.insCarerApprovalInfo = data.CarerApprovalInfo;
                this.insChildPlacement = data.ChildPlacement;
                this.insChangeOfApproval = data.ChangeOfApproval;
                this.insCarerDayLogJournal = data.CarerDayLogJournal;
                this.insCarerAnnualReview = data.CarerAnnualReview;
                this.insCarerIncidentInfo = data.CarerIncidentInfo;
                this.insCarerAllegationInfo = data.CarerAllegationInfo;
                this.insCarerComplaintsInfo = data.CarerComplaintsInfo;
                this.insDetailsofBirthChildren = data.CarerFamilyInfo;
                this.insSupervisoryHomeVisit = data.CarerSupervisoryHomeVisit;
                this.insUnannouncedHomeVisit = data.CarerUnannouncedHomeVisit;
                this.insOOHReport = data.CarerOOHReport;
                this.insPetQuestionnaire = data.CarerPetQuestionnaire;
             //   console.log(this.insPetQuestionnaire);
            });
        }
    }

    expandMessage(id) {
        // message.expanded = !message.expanded;

        switch (id) {
            case 1: {
                this.CarerApprovalInfoExpanded = !this.CarerApprovalInfoExpanded;
                break;
            }
            case 2: {
                this.ChildPlacementExpanded = !this.ChildPlacementExpanded;
                break;
            }
            case 3: {
                this.ChangeOfApprovalExpanded = !this.ChangeOfApprovalExpanded;
                break;
            }
            case 4: {
                this.CarerDayLogJournalExpanded = !this.CarerDayLogJournalExpanded;
                break;
            }
            case 5: {
                this.CarerAnnualReviewExpanded = !this.CarerAnnualReviewExpanded;
                break;
            }
            case 6: {
                this.CarerIncidentInfoExpanded = !this.CarerIncidentInfoExpanded;
                break;
            }
            case 7: {
                this.CarerAllegationInfoExpanded = !this.CarerAllegationInfoExpanded;
                break;
            }
            case 8: {
                this.CarerComplaintsInfoExpanded = !this.CarerComplaintsInfoExpanded;
                break;
            }
            case 9: {
                this.DetailsofBirthChildrenExpanded = !this.DetailsofBirthChildrenExpanded;
                break;
            }
            case 10: {
                this.SupervisoryHomeVisitExpanded = !this.SupervisoryHomeVisitExpanded;
                break;
            }
            case 11: {
                this.UnannouncedHomeVisitExpanded = !this.UnannouncedHomeVisitExpanded;
                break;
            }
            case 12: {
                this.OOHReportExpanded = !this.OOHReportExpanded;
                break;
            }
            case 13: {
                this.PetQuestionnaireExpanded = !this.PetQuestionnaireExpanded;
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
