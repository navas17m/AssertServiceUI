import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { ChildIncidentInfoDTO} from './DTO/childincidentinfodto';
import { PagesComponent } from '../pages.component';
import { SaveDraftInfoDTO} from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';
import { ConfigTableValuesDTO } from '../superadmin/DTO/configtablevalues';
import { ChildProfile } from '../child/DTO/childprofile';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component
    ({
        selector: 'childincidentinfolist',
        templateUrl: './childincidentlist.component.template.html',
    })

export class ChildIncidentInfoListComponent {
    public searchText: string = "";
    public loading:boolean =false;
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'Nature of Incident',prop:'NatureOfIncident',sortable:true,width:'200'},
        {name:'Date of Incident',prop:'IncidentDate',sortable:true,width:'150',datetime:'Y'},
        {name:'Date of Closure',prop:'ClosureDate',sortable:true,width:'150',date:'Y'},
        {name:'Agency Socialworker',prop:'AgencySocialworkerInvolved',sortable:true,width:'200'},
        {name:'Status',prop:'SaveAsDraftStatus',sortable:true,width:'150'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
        {name:'View',prop:'View',sortable:false,width:'60'},
        {name:'Delete',prop:'Delete',sortable:false,width:'60'},
       ];
    columns1 =[
        {name:'Carer Name', prop:'CarerName', width:'250'},
        {name:'Nature of Incident',prop:'NatureOfIncident',width:'200'},
        {name:'Date of Incident',prop:'IncidentDate',width:'150',datetime:'Y'},
        {name:'Agency Socialworker',prop:'AgencySocialworkerInvolved',width:'200'},
        {name:'View', prop:'Button', label:'View',class:'btn btn-warning',width:'100'}
       ];
    lstIncidentInfo = [];
    ChildID: number;
    objIncidentInfo: ChildIncidentInfoDTO = new ChildIncidentInfoDTO();
    returnVal;
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    controllerName = "ChildIncidentInfo";
    AgencyProfileId; userProfileId;
    @ViewChild('btnViewTaggedCarerIncident') btnViewTaggedCarerIncident: ElementRef;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
     FormCnfgId=214;
    constructor(private apiService: APICallService, private _router: Router
        , private modal: PagesComponent,private renderer: Renderer2) {

        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.userProfileId = parseInt(Common.GetSession("UserProfileId"));
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindIncidentInfo();
            this.bindTagChildIncidentInfo();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/incidentlist/4");
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
    fnAdd() {
        this._router.navigate(['/pages/child/incidentdata', 0, 4]);
    }
    edit(allegationinfoId, hasDraft) {
        if (hasDraft)
            Common.SetSession("SaveAsDraft", "Y");
        else
            Common.SetSession("SaveAsDraft", "N");
        this._router.navigate(['/pages/child/incidentdata', allegationinfoId, 4]);
    }

    lstTemp = [];
    fnLoadSaveDraft() {
        this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = 214;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
        this.objSaveDraftInfoDTO.TypeId = this.ChildID;
        let lstSaveDraft = [];
        this.apiService.post("SaveAsDraftInfo", "getall", this.objSaveDraftInfoDTO).then(data => {
            let jsonData = [];
            data.forEach(item => {
                jsonData = JSON.parse(item.JsonList);
                jsonData.forEach(T => {
                    lstSaveDraft.push(T);
                });

            });
            this.lstIncidentInfo = this.lstTemp.concat(lstSaveDraft);

            //this.lstChildDayLogJournal= this.lstChildDayLogJournal.sort(function (a, b) {
            //    return b.SequenceNo - a.SequenceNo;
            //});
        });
    }
    private bindIncidentInfo() {
        this.loading = true;
        this.apiService.get(this.controllerName, "GetListByChildId", this.ChildID).then(data => {
            //this.lstTemp = data;
            //this.fnLoadSaveDraft();
            this.lstIncidentInfo = data;
            this.loading =false;
        });

    }

    delete(SequenceNo, hasDraft) {
        this.objIncidentInfo.SequenceNo = SequenceNo;
        //this.objIncidentInfo.UniqueID = UniqueID;
        if (!hasDraft) {
            this.apiService.delete(this.controllerName, this.objIncidentInfo).then(data => this.Respone(data));
        } else {
            this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
            this.objSaveDraftInfoDTO.FormCnfgId = 214;
            this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
            this.objSaveDraftInfoDTO.TypeId = this.ChildID;
            this.objSaveDraftInfoDTO.SequenceNo = SequenceNo;
            this.apiService.post("SaveAsDraftInfo", "Delete", this.objSaveDraftInfoDTO).then(data => {
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
            this.bindIncidentInfo();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objIncidentInfo.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }

    private bindTagChildIncidentInfo() {
        this.apiService.get("CarerIncidentInfo", "GetTagIncidentListByChildId", this.ChildID).then(data => {
            this.TagCarerIncidentInfoList = data;
        });
        this.apiService.get("CarerIncidentInfo", "GetTagIncidentByChildId", this.ChildID).then(data => {
            this.lstTagCarerIncidentInfo = data;
        });
    }
    lstTagCarerIncidentInfo=[];
    TagCarerIncidentInfoList=[];
    hisTaggedCarerIncident=[];
    hisCarerName;
    IsShowTaggedIncident=false;
    fnShowTaggedIncident()
    {
        this.IsShowTaggedIncident=!this.IsShowTaggedIncident;

    }
    fnViewChildRiskAssessmentHistory(SequenceNo) {
        this.hisTaggedCarerIncident = [];
        let data = this.lstTagCarerIncidentInfo.filter(x => x.FieldName != 'IsActive' &&
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
            && x.SequenceNo == SequenceNo);
        if (data.length > 0) {
            this.hisTaggedCarerIncident = data;
        }

        let carerName = this.lstTagCarerIncidentInfo.filter(x => x.SequenceNo == SequenceNo && x.FieldName == 'CreatedUserId');
        if (carerName.length > 0) {
            this.hisCarerName = carerName[0].FieldValue;
        }

        let event = new MouseEvent('click', { bubbles: true });
        this.btnViewTaggedCarerIncident.nativeElement.dispatchEvent(event);
    }
    onEdit($event){
        if($event.SaveAsDraftStatus=='Submitted')
            this.edit($event.SequenceNo,false);
        else if($event.SaveAsDraftStatus=='Saved as Draft')
            this.edit($event.SequenceNo,true);
    }
    onDelete($event){
        if($event.SaveAsDraftStatus=='Submitted')
            this.delete($event.SequenceNo,false);
        else if($event.SaveAsDraftStatus=='Saved as Draft')
            this.delete($event.SequenceNo,true);
    }
    onButtonEvent($event){
        this.fnViewChildRiskAssessmentHistory($event.SequenceNo);
    }

}
