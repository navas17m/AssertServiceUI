import { Component} from '@angular/core';
import { ChildOfstedNotificationDTO } from './DTO/childofstednotificationdto'
import { Router } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { SaveDraftInfoDTO} from '../savedraft/DTO/savedraftinfodto';
import { environment } from '../../../environments/environment';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
declare var window: any;
declare var $: any;
@Component
    ({
        selector: 'childofstednotificationlist',
        templateUrl: './childofstednotificationlist.component.template.html',
    })

export class ChildOfstedNotificationListComponent {
    public searchText: string = "";
    lstChildOfstedNotification = []; loading = false;
    ChildID: number;
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'Date of Incident/Time',prop:'IncidentDate',sortable:true,width:'200',datetime:'Y'},
        {name:'Status',prop:'SaveAsDraftStatus',sortable:true,width:'100'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
        {name:'View',prop:'View',sortable:false,width:'60'},
        {name:'Delete',prop:'Delete',sortable:false,width:'60'},
        ];

    objChildOfstedNotification: ChildOfstedNotificationDTO = new ChildOfstedNotificationDTO();
    returnVal; controllerName = "ChildOfstedNotification";
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
     FormCnfgId=86;
    constructor(private apiService: APICallService, private _router: Router, private modal: PagesComponent) {
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindChildOfstedNotification();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/childofstednotificationlist/4");
            this._router.navigate(['/pages/referral/childprofilelist/1/4']);
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

    private bindChildOfstedNotification() {
        this.loading=true;
        this.apiService.get(this.controllerName, "GetList", this.ChildID).then(data => {
            //this.lstTemp = data;
          this.lstChildOfstedNotification = data;
          this.loading=false;
            //this.fnLoadSaveDraft();
        });
    }

    lstTemp = [];
    fnLoadSaveDraft() {
        this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = 86;
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
            this.loading = false;
            this.lstChildOfstedNotification = this.lstTemp.concat(lstSaveDraft);

        });
    }

    fnAddData() {
        this._router.navigate(['/pages/child/childofstednotification/0/4']);
    }

    editChildOfstedNotification(ChildOfstedId, hasDraft) {
        if (hasDraft)
            Common.SetSession("SaveAsDraft", "Y");
        else
            Common.SetSession("SaveAsDraft", "N");

        this._router.navigate(['/pages/child/childofstednotification', ChildOfstedId, 4]);
    }

    deleteChildOfstedNotification(SequenceNo, hasDraft) {
        this.objChildOfstedNotification.SequenceNo = SequenceNo;
        //this.objChildOfstedNotification.UniqueID = UniqueID;
        if (!hasDraft)
            this.apiService.delete(this.controllerName, this.objChildOfstedNotification).then(data => this.Respone(data));
        else {

            this.objSaveDraftInfoDTO.SequenceNo = SequenceNo;
            this.objSaveDraftInfoDTO.FormCnfgId = 86;
            this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
            this.objSaveDraftInfoDTO.TypeId = this.ChildID;
            this.apiService.post("SaveAsDraftInfo", "Delete", this.objSaveDraftInfoDTO).then(data => {
                this.Respone(data);
            });
        }
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindChildOfstedNotification();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objChildOfstedNotification.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
    onEdit($event){
        if($event.SaveAsDraftStatus=='Submitted')
            this.editChildOfstedNotification($event.SequenceNo,false);
        else if($event.SaveAsDraftStatus=='Saved as Draft')
            this.editChildOfstedNotification($event.SequenceNo,true);
    }
    onDelete($event){
        if($event.SaveAsDraftStatus=='Submitted')
            this.deleteChildOfstedNotification($event.SequenceNo,false);
        else if($event.SaveAsDraftStatus=='Saved as Draft')
            this.deleteChildOfstedNotification($event.SequenceNo,true);
    }
}