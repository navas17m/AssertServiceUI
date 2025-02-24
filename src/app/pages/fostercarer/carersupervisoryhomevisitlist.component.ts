import { filter } from 'rxjs/operators';
import { Component } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
//import { SaveDraftService } from '../services/savedraft/savedraftinfo.service';
import { SaveDraftInfoDTO } from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';
//import {CarerSupervisoryHomeVisitService } from '../services/carersupervisoryhomevisit.service'
import { CarerSupervisoryHomeVisitDTO } from './DTO/carersupervisoryhomevisitdto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component
    ({
        selector: 'carersupervisoryhomevisitlist',
        templateUrl: './carersupervisoryhomevisitlist.component.template.html',
    })

export class CarerSupervisoryHomeVisitListComponent {
    public searchText: string = "";
    public isLoading: boolean = false;
    insSupervisionAgreement: CarerSupervisoryHomeVisitDTO = new CarerSupervisoryHomeVisitDTO();
    isDefaultSortOrderVal: string;
    public loading:boolean = false;
    UserTypeId;
    controllerName = "CarerSupervisoryHomeVisit";
    lstCarerSupervisoryHomeVisit = [];
    objCarerSupervisoryHomeVisitDTO: CarerSupervisoryHomeVisitDTO = new CarerSupervisoryHomeVisitDTO();
    returnVal;objQeryVal;
    CarerParentId: number;
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    insActivePage:number;
    columns =[
      {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
      {name:'Supervising Social Worker',prop:'SocialWorker',sortable:true,width:'170'},
      {name:'Date of Visit',prop:'HomeVisitDate',sortable:true,width:'120',datetime:'Y'},
      {name:'Visit Type',prop:'HomeVisitType',sortable:true,width:'120'},
      {name:'Status',prop:'SaveAsDraftStatus',sortable:true,width:'100'},
      {name:'Locked',prop:'IsLocked',sortable:true,width:'60'},
      {name:'Edit',prop:'Edit',sortable:false,width:'60'},
      {name:'View',prop:'View',sortable:false,width:'60'},
      {name:'Delete',prop:'Delete',sortable:false,width:'60'},
      {name:'Child Outcome',prop:'Button',label:'',sortable:false,width:'100',class:'btn btn-info fa fa-child'},
      {name:'Signature', prop:'SignatureStatus',sortable:false,width:'80'}];
      objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
      FormCnfgId=59;
    constructor(private _router: Router,
        private activatedroute: ActivatedRoute,
        private module: PagesComponent, private apiService: APICallService) {

        this.insActivePage=1;
        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        this.insSupervisionAgreement.IsActive = false;
        this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
        if ((Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0")) {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 15]);
        }
        else {
            this.bindCarerSupervisoryHomeVisit();
            this.apiService.get(this.controllerName, "GetSupervisionAgreement", this.CarerParentId).then(data => {
                this.insSupervisionAgreement.AgreementOnFile = data;
            });
            this.UserTypeId = Common.GetSession("UserTypeId");

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

    public onPageChange() {
        let tem = document.querySelector('.pagination .page-item.active a');
        this.insActivePage=parseInt(tem.innerHTML);
    }


    SubmitSupervisionAgreement() {
        this.insSupervisionAgreement.CarerParentId = this.CarerParentId;
        this.apiService.post(this.controllerName, "SaveSupervisionAgreement", this.insSupervisionAgreement).then(data => { this.ResponeupervisionAgreement(data) });

    }
    private ResponeupervisionAgreement(data) {
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.module.alertSuccess(Common.GetSaveSuccessfullMsg);
        }
    }
    private bindCarerSupervisoryHomeVisit() {
      if(this.UserTypeId == 4)
          this.columns= this.columns.filter(item => item.prop!='Button');

        if (this.CarerParentId != null)
            this.loading = true;
            this.apiService.get(this.controllerName, "GetAllByCarerParentId", this.CarerParentId).then(data => {
                //this.cdlServics.getCarerSupervisoryHomeVisitList(this.CarerParentId).subscribe(data => {
                this.lstTemp = data;
                this.fnLoadSaveDraft();
            });
            this.apiService.get(this.controllerName, "GetListByCarerParentId", this.CarerParentId).then(data => {
              this.lstSupervisoryHomeVisit = data;
          });
    }
    lstTemp = [];
    lstSupervisoryHomeVisit = [];
    fnLoadSaveDraft() {
        this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = 59;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;
        this.objSaveDraftInfoDTO.TypeId = this.CarerParentId;
        let lstSaveDraft = [];
        this.apiService.post("SaveAsDraftInfo", "getall", this.objSaveDraftInfoDTO).then(data => {
            // this.sdService.getList(this.objSaveDraftInfoDTO).then(data => {
            let jsonData = [];
            data.forEach(item => {
                jsonData = JSON.parse(item.JsonList);
                jsonData.forEach(T => {
                    lstSaveDraft.push(T);
                });

            });
            this.loading = false;
            this.lstCarerSupervisoryHomeVisit = this.lstTemp.concat(lstSaveDraft);
            this.isDefaultSortOrderVal = "desc";
            if(this.objQeryVal.apage!=undefined)
            this.insActivePage= parseInt(this.objQeryVal.apage);
        });
    }
    fnAddData() {
        this._router.navigate(['/pages/fostercarer/carersupervisoryhomevisitdata/0/3/1']);
    }

    editCarerSupervisoryHomeVisit(CarerSupervisoryHomeVisitId, hasDraft) {
        if (hasDraft)
            Common.SetSession("SaveAsDraft", "Y");
        else
            Common.SetSession("SaveAsDraft", "N");
        this._router.navigate(['/pages/fostercarer/carersupervisoryhomevisitdata', CarerSupervisoryHomeVisitId, 3,this.insActivePage]);
    }

    deleteCarerSupervisoryHomeVisit(SequenceNo, hasDraft) {

        this.objCarerSupervisoryHomeVisitDTO.SequenceNo = SequenceNo;
        //this.objCarerSupervisoryHomeVisitDTO.UniqueID = UniqueID;
        if (!hasDraft)
            this.apiService.delete(this.controllerName, this.objCarerSupervisoryHomeVisitDTO).then(data => this.Respone(data));
        //  this.cdlServics.post(this.objCarerSupervisoryHomeVisitDTO, "delete").then(data => this.Respone(data));
        else {
            this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
            this.objSaveDraftInfoDTO.FormCnfgId = 59;
            this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;
            this.objSaveDraftInfoDTO.TypeId = this.CarerParentId;
            this.objSaveDraftInfoDTO.SequenceNo = SequenceNo;
            //this.sdService.delete(this.objSaveDraftInfoDTO).then(data => {
            //    this.Respone(data);
            //});

            this.apiService.delete("SaveAsDraftInfo", this.objSaveDraftInfoDTO).then(data => {
                this.Respone(data);
            });
        }

    }
    fnGoChildSHV(seqNo) {
        let val = this.lstCarerSupervisoryHomeVisit.filter(x => x.FieldName == "HomeVisitDate" && x.SequenceNo == seqNo);
        if (val[0] != null)
            Common.SetSession("HomeVisitDate", val[0].FieldValue);
        this._router.navigate(['/pages/fostercarer/childsupervisoryhomevisitlist', seqNo]);

    }
    private Respone(data) {
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.module.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindCarerSupervisoryHomeVisit();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objCarerSupervisoryHomeVisitDTO.SequenceNo;
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
          this.editCarerSupervisoryHomeVisit($event.SequenceNo,false);
      else if($event.SaveAsDraftStatus=='Saved as Draft')
          this.editCarerSupervisoryHomeVisit($event.SequenceNo,true);
    }
    onDelete($event){
      if($event.SaveAsDraftStatus=='Submitted')
          this.deleteCarerSupervisoryHomeVisit($event.SequenceNo,false);
      else if($event.SaveAsDraftStatus=='Saved as Draft')
          this.deleteCarerSupervisoryHomeVisit($event.SequenceNo,true);
    }
    onSignClick($event){
      this._router.navigate(['/pages/fostercarer/shvfcsignature',$event.SequenceNo]);
    }
    onButtonEvent($event){
      this.fnGoChildSHV($event.SequenceNo);
  }
}
