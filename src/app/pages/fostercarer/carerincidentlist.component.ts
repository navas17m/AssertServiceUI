
import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { SaveDraftInfoDTO } from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';
import { CarerIncidentInfoDTO } from './DTO/carerincidentinfodto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component
    ({

        selector: 'carerincidentinfolist',
        templateUrl: './carerincidentlist.component.template.html',
    })

export class CarerIncidentInfoListComponent {
    public searchText: string = "";
    lstIncidentInfo = [];
    CarerParentId: number;
    objIncidentInfo: CarerIncidentInfoDTO = new CarerIncidentInfoDTO();
    returnVal;
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    controllerName = "CarerIncidentInfo";
    loading = false;AgencyProfileId; userProfileId;
    lstTagChildIncidentInfo=[];
    columns =[
      {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
      {name:'Nature of Incident',prop:'NatureOfIncident',sortable:true,width:'200'},
      {name:'Date of Incident',prop:'IncidentDate',sortable:true,width:'150',datetime:'Y'},
      {name:'Closure Date', prop:'ClosureDate', sortable:true, width:'150',date:'Y'},
      {name:'Status',prop:'SaveAsDraftStatus',sortable:true,width:'150'},
      {name:'Edit',prop:'Edit',sortable:false,width:'60'},
      {name:'View',prop:'View',sortable:false,width:'60'},
      {name:'Delete',prop:'Delete',sortable:false,width:'60'}
     ];
     columns1 =[
      {name:'Child Name', prop:'ChildName', width:'250'},
      {name:'Nature of Incident',prop:'NatureOfIncident',width:'200'},
      {name:'Date of Incident',prop:'IncidentDate',width:'150',datetime:'Y'},
      {name:'Agency Socialworker',prop:'AgencySocialworkerInvolved',width:'200'},
      {name:'View', prop:'Button',label:'View', class:'btn btn-warning',width:'100'}
     ];
    @ViewChild('btnViewTaggedChildIncident') btnViewTaggedChildIncident: ElementRef;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=211;
    constructor(private apiService: APICallService, private _router: Router
        , private modal: PagesComponent,private renderer: Renderer2 ) {

        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.userProfileId = parseInt(Common.GetSession("UserProfileId"));
        if ((Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0")) {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 34]);
        }
        else {
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            this.bindIncidentInfo();
            this.bindTagChildIncidentInfo();
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
        this._router.navigate(['/pages/fostercarer/incidentdata', 0, 3]);
    }
    edit(allegationinfoId, hasDraft) {
        if (hasDraft)
            Common.SetSession("SaveAsDraft", "Y");
        else
            Common.SetSession("SaveAsDraft", "N");
        this._router.navigate(['/pages/fostercarer/incidentdata', allegationinfoId, 3]);
    }

    lstTemp = [];
    fnLoadSaveDraft() {
        this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = 211;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;
        this.objSaveDraftInfoDTO.TypeId = this.CarerParentId;
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
        this.apiService.get(this.controllerName, "GetListByCarerParentId", this.CarerParentId).then(data => {
           // this.lstTemp = data;
            //this.fnLoadSaveDraft();
            this.lstIncidentInfo =data;
        });

    }



    delete(SequenceNo, hasDraft) {


        this.objIncidentInfo.SequenceNo = SequenceNo;
        //this.objIncidentInfo.UniqueID = UniqueID;
        if (!hasDraft) {
            this.apiService.delete(this.controllerName, this.objIncidentInfo).then(data => this.Respone(data));
        } else {
            this.objSaveDraftInfoDTO.SequenceNo = SequenceNo;
            this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
            this.objSaveDraftInfoDTO.FormCnfgId = 211;
            this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;
            this.objSaveDraftInfoDTO.TypeId = this.CarerParentId;
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
            this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }

    private bindTagChildIncidentInfo() {
        this.apiService.get("ChildIncidentInfo", "GetTagIncidentByCarerParentId", this.CarerParentId).then(data => {
            this.lstTagChildIncidentInfo = data;
        });
        this.apiService.get("ChildIncidentInfo", "GetTagIncidentListByCarerParentId", this.CarerParentId).then(data => {
          this.tagChildIncidentInfo = data;
      });

    }
    tagChildIncidentInfo=[];
    hisTaggedChildIncident=[];
    hisChildName;
    IsShowTaggedIncident=false;
    fnShowTaggedIncident()
    {
        this.IsShowTaggedIncident=!this.IsShowTaggedIncident;

    }
    fnViewChildRiskAssessmentHistory(SequenceNo) {
        this.hisTaggedChildIncident = [];
        let data = this.lstTagChildIncidentInfo.filter(x => x.FieldName != 'IsActive' &&
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
            && x.FieldName != 'AddtoSiblingsRecord'
            && x.FieldName != 'SelectSiblings'
            && x.SequenceNo == SequenceNo);
        if (data.length > 0) {
            this.hisTaggedChildIncident = data;
        }

        let carerName = this.lstTagChildIncidentInfo.filter(x => x.SequenceNo == SequenceNo && x.FieldName == 'CreatedUserId');
        if (carerName.length > 0) {
            this.hisChildName = carerName[0].FieldValue;
        }

        let event = new MouseEvent('click', { bubbles: true });
        this.btnViewTaggedChildIncident.nativeElement.dispatchEvent(event);
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
