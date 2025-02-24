
import { Component,ViewChild,ElementRef  } from '@angular/core';
import { Router } from '@angular/router';
import { ChildProfile } from '../child/DTO/childprofile';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { SaveDraftInfoDTO } from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';
import { ConfigTableValuesDTO } from '../superadmin/DTO/configtablevalues';
import { UserProfile } from '../systemadmin/DTO/userprofile';
import { CarerOfstedNotification } from './DTO/carerofstednotificationdto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component
    ({

    selector: 'carerofstednotificationlist',
    templateUrl: './carerofstednotificationlist.component.template.html',
    })

export class CarerofstednotificationListComponent {
    lstofstednotification = [];
    CarerParentId: number;
    objofstednotification: CarerOfstedNotification = new CarerOfstedNotification();
    returnVal;
    searchText;
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    controllerName = "CarerOfstedNotificationInfo";
    objChildProfile: ChildProfile = new ChildProfile();
    objUserProfile: UserProfile = new UserProfile();
    lstCategory = []; categoryId; loading = false; allegationDate; showAllegationHappenedPerson = false;
    lstAllegationHappenedPerson = []; allegationHappenedPersonId; AgencyProfileId; userProfileId;
    @ViewChild('btnViewTaggedChildAllegation') btnViewTaggedChildAllegation: ElementRef;
    lstCarerOfstedNotification = [];
    columns =[
      {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
      {name:'Incident Date',prop:'IncidentDate',sortable:true,width:'200',datetime:'Y'},
      {name:'Status',prop:'SaveAsDraftStatus',sortable:true,width:'200'},
      {name:'Edit',prop:'Edit',sortable:false,width:'60'},
      {name:'View',prop:'View',sortable:false,width:'60'},
      {name:'Delete',prop:'Delete',sortable:false,width:'60'}
     ];
   // loading = false;
   objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
   FormCnfgId=346;
    constructor(private apiService: APICallService, private _router: Router
        ,private modal: PagesComponent) {

        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.userProfileId = parseInt(Common.GetSession("UserProfileId"));
        if ((Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0")) {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 48]);
        }
        else {
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            this.bindofstednotification();

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
    fnAdd() {
        this._router.navigate(['/pages/fostercarer/ofstednotificationdata', 0, 3]);
    }
    editofstednotification(ofstednotificationId, hasDraft) {
        if (hasDraft)
            Common.SetSession("SaveAsDraft", "Y");
        else
            Common.SetSession("SaveAsDraft", "N");
        this._router.navigate(['/pages/fostercarer/ofstednotificationdata', ofstednotificationId, 3]);
    }


    lstTemp = [];
    fnLoadSaveDraft() {
        this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = 346;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;
        this.objSaveDraftInfoDTO.TypeId = this.CarerParentId;
        let lstSaveDraft = [];
        this.apiService.post("SaveAsDraftInfo","getall",this.objSaveDraftInfoDTO).then(data => {
            let jsonData = [];
            data.forEach(item => {
                jsonData = JSON.parse(item.JsonList);
                jsonData.forEach(T => {
                    lstSaveDraft.push(T);
                });

            });
            this.lstofstednotification = this.lstTemp.concat(lstSaveDraft);
            this.loading=false;
            //this.lstChildDayLogJournal= this.lstChildDayLogJournal.sort(function (a, b) {
            //    return b.SequenceNo - a.SequenceNo;
            //});
        });
    }
    private bindofstednotification() {
        this.loading=true;
        this.apiService.get(this.controllerName, "GetListByCarerParentId", this.CarerParentId).then(data => {
            //this.lstTemp = data;
            //this.fnLoadSaveDraft();
            this.lstCarerOfstedNotification = data;
            this.loading = false;
        });

    }

    deleteofstednotification(SequenceNo, hasDraft) {


            this.objofstednotification.SequenceNo = SequenceNo;
            //this.objofstednotification.UniqueID = UniqueID;
            if (!hasDraft)
            {
                this.apiService.delete(this.controllerName, this.objofstednotification).then(data => this.Respone(data));
            }else {
              this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
              this.objSaveDraftInfoDTO.FormCnfgId = 346;
              this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;
              this.objSaveDraftInfoDTO.TypeId = this.CarerParentId;
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
            this.bindofstednotification();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objofstednotification.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }

    onEdit($event){
      if($event.SaveAsDraftStatus=='Submitted')
          this.editofstednotification($event.SequenceNo,false);
      else if($event.SaveAsDraftStatus=='Saved as Draft')
          this.editofstednotification($event.SequenceNo,true);
    }
    onDelete($event){
      if($event.SaveAsDraftStatus=='Submitted')
          this.deleteofstednotification($event.SequenceNo,false);
      else if($event.SaveAsDraftStatus=='Saved as Draft')
          this.deleteofstednotification($event.SequenceNo,true);
    }



}
