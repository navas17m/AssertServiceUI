import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { SaveDraftInfoDTO } from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';
import { ChildAllegationInfo } from './DTO/childallegationinfodto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component
    ({

    selector: 'childallegationinfolist',
    templateUrl: './childallegationinfolist.component.template.html',
    })

export class ChildAllegationInfoListComponent {
    public searchText: string = "";
    public loading:boolean =false;
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'Date of Allegation',prop:'AllegationDate',sortable:true,width:'200',datetime:'Y'},
        {name:'Status',prop:'SaveAsDraftStatus',sortable:true,width:'200'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
        {name:'View',prop:'View',sortable:false,width:'60'},
        {name:'Delete',prop:'Delete',sortable:false,width:'60'}
       ];
       columns1 =[
        {name:'Carer Name', prop:'CarerName', width:'250'},
        {name:'Date of Allegation',prop:'AllegationsDate',width:'150',datetime:'Y'},
        {name:'Agency Socialworker',prop:'AgencySocialworkerInvolved',width:'200'},
        {name:'View', prop:'Button', label:'View',class:'btn btn-warning',width:'100'}
       ];
    lstAllegationInfo = [];
    ChildID: number;
    objAllegationInfo: ChildAllegationInfo = new ChildAllegationInfo();
    returnVal;
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    controllerName = "ChildAllegationInfo";
    lstCategory = []; categoryId; allegationDate; showAllegationHappenedPerson = false;
    lstAllegationHappenedPerson = []; allegationHappenedPersonId; AgencyProfileId; userProfileId;
    @ViewChild('btnViewTaggedCarerAllegation') btnViewTaggedCarerAllegation: ElementRef;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=212;
    constructor(private apiService: APICallService, private _router: Router
        , private modal: PagesComponent,private renderer: Renderer2) {

        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.userProfileId = parseInt(Common.GetSession("UserProfileId"));
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindAllegationinfo();
            this.bindTagChildAllegationInfo();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/allegationlist/4");
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
        this._router.navigate(['/pages/child/allegationdata', 0, 4]);
    }
    editAllegationinfo(allegationinfoId, hasDraft) {
        if (hasDraft)
            Common.SetSession("SaveAsDraft", "Y");
        else
            Common.SetSession("SaveAsDraft", "N");
        this._router.navigate(['/pages/child/allegationdata', allegationinfoId, 4]);
    }

    lstTemp = [];
    fnLoadSaveDraft() {
        this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = 212;
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
            this.lstAllegationInfo = this.lstTemp.concat(lstSaveDraft);
        });
    }
    private bindAllegationinfo() {
        this.loading=true;
        this.apiService.get(this.controllerName, "GetListByChildId", this.ChildID).then(data => {
            this.lstAllegationInfo= data;
            this.loading=false;
        });
    }

    deleteAllegationinfo(SequenceNo, hasDraft) {
            this.objAllegationInfo.SequenceNo = SequenceNo;
            //this.objAllegationInfo.UniqueID = UniqueID;
            if (!hasDraft)
            {
                this.apiService.delete(this.controllerName, this.objAllegationInfo).then(data => this.Respone(data));
            }else {
                this.objSaveDraftInfoDTO.FormCnfgId = 212;
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
            this.bindAllegationinfo();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objAllegationInfo.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }

    private bindTagChildAllegationInfo() {
        this.apiService.get("CarerAllegationInfo", "GetListTagAllegationByChildId", this.ChildID).then(data => {
            this.tagCarerAllegationsList = data;
        });
        this.apiService.get("CarerAllegationInfo", "GetTagAllegationByChildId", this.ChildID).then(data => {
            this.lstTagCarerAllegationInfo = data;
        });

    }
    tagCarerAllegationsList=[];
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
            && x.FieldName != 'AllegationAgainstPersonNameDropdown'
            && x.FieldName != 'AllegationAgainstPersonName'
            && x.SequenceNo == SequenceNo);
        if (data.length > 0) {
            this.hisTaggedCarerAllegation = data;
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
            this.editAllegationinfo($event.SequenceNo,false);
        else if($event.SaveAsDraftStatus=='Saved as Draft')
            this.editAllegationinfo($event.SequenceNo,true);
    }
    onDelete($event){
        if($event.SaveAsDraftStatus=='Submitted')
            this.deleteAllegationinfo($event.SequenceNo,false);
        else if($event.SaveAsDraftStatus=='Saved as Draft')
            this.deleteAllegationinfo($event.SequenceNo,true);
    }
    onButtonEvent($event){
        this.fnViewChildAllegationtHistory($event.SequenceNo);
    }
}
