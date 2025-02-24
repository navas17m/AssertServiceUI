import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { SaveDraftInfoDTO } from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';
import { ChildComplaintInfoDTO } from './DTO/childcomplaintinfodto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component
    ({

        selector: 'childcomplaintinfolist',
        templateUrl: './childcomplaintinfolist.component.template.html',
    })

export class ChildComplaintInfoListComponent {
    public searchText: string = "";
    public loading:boolean =false;
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'Date of Complaint',prop:'ComplaintDate',sortable:true,width:'200',datetime:'Y'},
        {name:'Status',prop:'SaveAsDraftStatus',sortable:true,width:'200'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
        {name:'View',prop:'View',sortable:false,width:'60'},
        {name:'Delete',prop:'Delete',sortable:false,width:'60'}
       ];
       columns1 =[
        {name:'Carer Name', prop:'CarerName', width:'250'},
        {name:'Date of Complaint',prop:'ComplaintDate',width:'150',datetime:'Y'},
        {name:'Agency Socialworker',prop:'AgencySocialworkerInvolved',width:'200'},
        {name:'View', prop:'Button',label:'View', class:'btn btn-warning',width:'100'}
       ];
    lstComplaintInfo = [];
    ChildID: number;
    objComplaintInfo: ChildComplaintInfoDTO = new ChildComplaintInfoDTO();
    returnVal;
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    controllerName = "ChildComplaintsInfo";
    AgencyProfileId; userProfileId;
    @ViewChild('btnViewTaggedCarerComplaints') btnViewTaggedCarerComplaints: ElementRef;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
     FormCnfgId=213;
    constructor(private apiService: APICallService, private _router: Router
        , private modal: PagesComponent,private renderer: Renderer2) {

        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.userProfileId = parseInt(Common.GetSession("UserProfileId"));
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindComplaintsinfo();
            this.bindTagChildComplaintsInfo();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/complaintslist/4");
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
        this._router.navigate(['/pages/child/complaintsdata', 0, 4]);
    }
    edit(complaintsId, hasDraft) {
        if (hasDraft)
            Common.SetSession("SaveAsDraft", "Y");
        else
            Common.SetSession("SaveAsDraft", "N");
        this._router.navigate(['/pages/child/complaintsdata', complaintsId, 4]);
    }

    lstTemp = [];
    fnLoadSaveDraft() {
        this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = 213;
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
            this.lstComplaintInfo = this.lstTemp.concat(lstSaveDraft);

            //this.lstChildDayLogJournal= this.lstChildDayLogJournal.sort(function (a, b) {
            //    return b.SequenceNo - a.SequenceNo;
            //});
        });
    }
    private bindComplaintsinfo() {
        this.loading=true;
        this.apiService.get(this.controllerName, "GetListByChildId", this.ChildID).then(data => {
            //this.lstTemp = data;
            //this.fnLoadSaveDraft();
            this.lstComplaintInfo = data;
            this.loading=false;
        });

    }

    delete(SequenceNo, hasDraft) {
        this.objComplaintInfo.SequenceNo = SequenceNo;
        //this.objComplaintInfo.UniqueID = UniqueID;
        if (!hasDraft) {
            this.apiService.delete(this.controllerName, this.objComplaintInfo).then(data => this.Respone(data));
        } else {
            this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
            this.objSaveDraftInfoDTO.FormCnfgId = 213;
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
            this.bindComplaintsinfo();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objComplaintInfo.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }

    private bindTagChildComplaintsInfo() {
        this.apiService.get("CarerComplaintsInfo", "GetTagComplaintsListByChildId", this.ChildID).then(data => {
            this.tagCarerComplaintsList = data;
        });
        this.apiService.get("CarerComplaintsInfo", "GetTagComplaintsByChildId", this.ChildID).then(data => {
            this.lstTagCarerComplaintsInfo = data;
        });

    }
    tagCarerComplaintsList=[];
    lstTagCarerComplaintsInfo=[];
    hisTaggedCarerComplaints=[];
    hisCarerName;
    IsShowTaggedComplaints=false;
    fnShowTaggedComplaints()
    {
        this.IsShowTaggedComplaints=!this.IsShowTaggedComplaints;

    }
    fnViewChildComplaintstHistory(SequenceNo) {
        this.hisTaggedCarerComplaints = [];
        let data = this.lstTagCarerComplaintsInfo.filter(x => x.FieldName != 'IsActive' &&
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
            && x.FieldName != 'ComplaintAgainstPersonNameDropdown'
            && x.FieldName != 'ComplaintAgainstPersonName'
            && x.SequenceNo == SequenceNo);
        if (data.length > 0) {
            this.hisTaggedCarerComplaints = data;
        }

        let carerName = this.lstTagCarerComplaintsInfo.filter(x => x.SequenceNo == SequenceNo && x.FieldName == 'CreatedUserId');
        if (carerName.length > 0) {
            this.hisCarerName = carerName[0].FieldValue;
        }

        let event = new MouseEvent('click', { bubbles: true });
        this.btnViewTaggedCarerComplaints.nativeElement.dispatchEvent(event);
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
        this.fnViewChildComplaintstHistory($event.SequenceNo);
    }
}
