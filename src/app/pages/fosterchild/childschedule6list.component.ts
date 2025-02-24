import { Component,ViewChild,ElementRef,Renderer2 } from '@angular/core';
import { Router } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { ChildSchedule6} from './DTO/childschedule6dto';
import { PagesComponent } from '../pages.component';
import { SaveDraftInfoDTO} from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';
import { ConfigTableValuesDTO } from '../superadmin/DTO/configtablevalues';
import { ChildProfile } from '../child/DTO/childprofile';
import { UserProfile } from '../systemadmin/DTO/userprofile';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component
    ({

    selector: 'childschedule6list',
    templateUrl: './childschedule6list.component.template.html',
    })

export class ChildCchedule6ListComponent {
    lstSchedule6 = [];
    lstChildSchedule6 = [];
    ChildID: number;
    objSchedule6: ChildSchedule6 = new ChildSchedule6();
    returnVal;
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    controllerName = "ChildSchedule6";
    lstCategory = []; categoryId; loading = false; allegationDate; showAllegationHappenedPerson = false;
    lstAllegationHappenedPerson = []; allegationHappenedPersonId; AgencyProfileId; userProfileId;
    @ViewChild('btnViewTaggedCarerAllegation') btnViewTaggedCarerAllegation: ElementRef;
    public searchText:string="";
    columns =[
      {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
      {name:'Event Type',prop:'EventType',sortable:true,width:'100'},
      {name:'Event Date',prop:'EventDateStr',sortable:true,width:'150'},
      {name:'Nature of Event',prop:'NatureOfEvent',sortable:true,width:'250'},
      {name:'Status',prop:'SaveAsDraftStatus',sortable:true,width:'100'},
      {name:'Edit',prop:'Edit',sortable:false,width:'60'},
      {name:'View',prop:'View',sortable:false,width:'60'},
      {name:'Delete',prop:'Delete',sortable:false,width:'60'},
     ];
     objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
     FormCnfgId=362;
    constructor(private apiService: APICallService, private _router: Router
        , private modal: PagesComponent,private renderer: Renderer2) {

        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.userProfileId = parseInt(Common.GetSession("UserProfileId"));
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindSchedule6();
           this.bindTagSchedule6ByChildId();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/Schedule6list/4");
            this._router.navigate(['/pages/referral/childprofilelist/1/16']);
        }

        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }
    fnAdd() {
        this._router.navigate(['/pages/child/schedule6data', 0, 4]);
    }
    editSchedule6(Schedule6Id, hasDraft) {
        if (hasDraft)
            Common.SetSession("SaveAsDraft", "Y");
        else
            Common.SetSession("SaveAsDraft", "N");
        this._router.navigate(['/pages/child/schedule6data', Schedule6Id, 4]);
    }

    lstTemp = [];
    fnLoadSaveDraft() {
        this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = 362;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
        this.objSaveDraftInfoDTO.TypeId = this.ChildID;
        let lstSaveDraft = [];
        this.apiService.post("SaveAsDraftInfo","getall",this.objSaveDraftInfoDTO).then(data => {
            let jsonData = [];
            data.forEach(item => {
                jsonData = JSON.parse(item.JsonList);
                jsonData.forEach(T => {
                    lstSaveDraft.push(T);
                });

            });
            this.lstSchedule6 = this.lstTemp.concat(lstSaveDraft);

            //this.lstChildDayLogJournal= this.lstChildDayLogJournal.sort(function (a, b) {
            //    return b.SequenceNo - a.SequenceNo;
            //});
        });
    }
    private bindSchedule6() {
        this.loading = true;
        this.apiService.get(this.controllerName, "GetListByChildId", this.ChildID).then(data => {
            // this.lstTemp = data;
            // this.fnLoadSaveDraft();
            this.lstChildSchedule6 = data;
            this.loading = false;
        });

    }

    deleteSchedule6(SequenceNo, hasDraft) {
            this.objSchedule6.SequenceNo = SequenceNo;
            //this.objSchedule6.UniqueID = UniqueID;
            if (!hasDraft)
            {
                this.apiService.delete(this.controllerName, this.objSchedule6).then(data => this.Respone(data));
            }else {
              this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
              this.objSaveDraftInfoDTO.FormCnfgId = 362;
              this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
              this.objSaveDraftInfoDTO.TypeId = this.ChildID;
              this.objSaveDraftInfoDTO.SequenceNo = SequenceNo;
              this.apiService.post("SaveAsDraftInfo","Delete",this.objSaveDraftInfoDTO).then(data => {
                    this.Respone(data);
                });
            }

    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindSchedule6();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objSchedule6.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }

    private bindTagSchedule6ByChildId() {
        this.apiService.get("CarerSchedule6", "GetTagSchedule6ByChildId", this.ChildID).then(data => {
            this.lstTagCarerAllegationInfo = data;
        });

    }
    lstTagCarerAllegationInfo=[];
    hisTaggedCarerAllegation=[];
    hisCarerName;
    IsShowTaggedAllegation=false;
    fnShowTaggedAllegation()
    {
        this.IsShowTaggedAllegation=!this.IsShowTaggedAllegation;

    }
    fnViewChildAllegationtHistory(SequenceNo) {
        this.hisTaggedCarerAllegation = [];
        let data = this.lstTagCarerAllegationInfo.filter(x => x.FieldName != 'IsActive' &&
            x.FieldName != 'CreatedDate'
            && x.FieldName != 'CreatedUserId'
            && x.FieldName != 'UpdatedDate'
            && x.FieldName != 'UpdatedUserId'
            && x.FieldName != 'SiblingParentSno'
            && x.FieldName != 'CarerChildSNo'
            && x.FieldName != 'SaveAsDraftStatus'
            && x.FieldName != 'SocialWorkerId'
            && x.FieldName != 'CarerParentId'
            && x.FieldName != 'CarerParentIds'
            && x.FieldName != 'ChildIds'
            && x.FieldName != 'EventAgainstPersonNameDropdown'
            && x.FieldName != 'EventAgainstPersonName'
            && x.SequenceNo == SequenceNo);
        if (data.length > 0) {
           // this.hisTaggedCarerAllegation = data;
           let isMissingPlacement=data.filter(x=>x.FieldName=="EventTypeId");
            if(isMissingPlacement.length>0 && isMissingPlacement[0].FieldValue=="Missing Child Placement")
            {
                this.hisTaggedCarerAllegation = data.filter(x=>
                x.FieldName !='PersonCompletingReport'
                && x.FieldName != 'WasPoliceCalledtoHome'
                && x.FieldName != 'DetailsofEvent'
                && x.FieldName != 'BackgroundofCase'
                && x.FieldName != 'OutcomeofCase'
                && x.FieldName != 'InvestigationUndertaken'
                && x.FieldName != 'AgencyActionTaken'
                && x.FieldName != 'HospitalAdmission'
                && x.FieldName != 'Section47Offences'
                && x.FieldName != 'SupportOfferedDuringInvestigation'
                && x.FieldName != 'IndependentSupportOfferedInfo'
                && x.FieldName != 'RegisteredManagerInformed'
                && x.FieldName != 'RegisteredManagerInformedDate'
                && x.FieldName != 'RegisteredManagerRecommendation'
                && x.FieldName != 'TeamManagerRecommendation'
                && x.FieldName != 'PersonCompletingReport')

            }
            else
            {
                this.hisTaggedCarerAllegation = data.filter(x=>
                    x.FieldName !='ChildMissingReason'
                && x.FieldName != 'ChildMissingDate'
                && x.FieldName != 'ChildReturnDate'
                && x.FieldName != 'MissingDetails'
                && x.FieldName != 'OutcomeOfMissing'
                && x.FieldName != 'WasReturnInterviewConducted'
                && x.FieldName != 'ActionTakenByCarer'
                && x.FieldName != 'ActionTakenPreventReoccurrence');
            }
        }

        let carerName = this.lstTagCarerAllegationInfo.filter(x => x.SequenceNo == SequenceNo && x.FieldName == 'CreatedUserId');
        if (carerName.length > 0) {
            this.hisCarerName = carerName[0].FieldValue;
        }

        let event = new MouseEvent('click', { bubbles: true });
        this.btnViewTaggedCarerAllegation.nativeElement.dispatchEvent(event);
    }
    onEdit($event){
      if($event.SaveAsDraftStatus=='Submitted')
          this.editSchedule6($event.SequenceNo,false);
      else if($event.SaveAsDraftStatus=='Saved as Draft')
          this.editSchedule6($event.SequenceNo,true);
    }
    onDelete($event){
      if($event.SaveAsDraftStatus=='Submitted')
          this.deleteSchedule6($event.SequenceNo,false);
      else if($event.SaveAsDraftStatus=='Saved as Draft')
          this.deleteSchedule6($event.SequenceNo,true);
    }  
}
