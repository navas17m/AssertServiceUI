import { Component } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
//import { SaveDraftService } from '../services/savedraft/savedraftinfo.service';
import { SaveDraftInfoDTO } from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';
//import {CarerUnannouncedHomeVisitService } from '../services/carerunannouncedhomevisit.service'
import { CarerUnannouncedHomeVisitDTO } from './DTO/carerunannouncedhomevisitdto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
import { AgencyKeyNameValueCnfgDTO } from '../superadmin/DTO/agencykeynamecnfgdto';

@Component
    ({
        selector: 'carerunannouncedhomevisitlist',
        templateUrl: './carerunannouncedhomevisitlist.component.template.html',

    })

export class CarerUnannouncedHomeVisitListComponent {
    objAgencyKeyNameValueCnfgDTO: AgencyKeyNameValueCnfgDTO = new AgencyKeyNameValueCnfgDTO();
    public searchText: string = "";
    loading = false;
    insActivePage:number;
    controllerName = "CarerUnannouncedHomeVisit";
    lstCarerUnannouncedHomeVisit = [];
    objCarerUnannouncedHomeVisitDTO: CarerUnannouncedHomeVisitDTO = new CarerUnannouncedHomeVisitDTO();
    CarerParentId: number;
    returnVal;objQeryVal;
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    columns =[ ];
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=60;
    constructor(private _router: Router, private module: PagesComponent,
        private activatedroute: ActivatedRoute,
        private apiService: APICallService) {
            this.showGridColumns();
        this.insActivePage=1;
        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
        if (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0") {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 16]);
        }
        else
            this.bindCarerUnannouncedHomeVisit();
        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }
    private showGridColumns()
    {
        this.objAgencyKeyNameValueCnfgDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objAgencyKeyNameValueCnfgDTO.AgencyKeyNameCnfgId = 35;
        this.apiService.post("AgencyKeyNameCnfg", "GetById", this.objAgencyKeyNameValueCnfgDTO).then(data => {
            if(data)
            {              
                this.objAgencyKeyNameValueCnfgDTO = data;     
                if(this.objAgencyKeyNameValueCnfgDTO.Value!=null && this.objAgencyKeyNameValueCnfgDTO.Value=="1")
                {                   
                    this.columns=[
                        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
                        {name:'Date of Visit',prop:'HomeVisitDate',sortable:true,width:'120',datetime:'Y'},
                        {name:'Home Visit Status',prop:'HomeVisitStatus',sortable:true,width:'150'},
                        {name:'Status',prop:'SaveAsDraftStatus',sortable:true,width:'100'},
                        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
                        {name:'View',prop:'View',sortable:false,width:'60'},
                        {name:'Delete',prop:'Delete',sortable:false,width:'60'},
                        {name:'Signature', prop:'SignatureStatus',sortable:false,width:'60'}];
                }
                else
                {                    
                    this.columns=[
                        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
                        {name:'Date of Visit',prop:'HomeVisitDate',sortable:true,width:'120',datetime:'Y'},
                        {name:'Home Visit Status',prop:'HomeVisitStatus',sortable:true,width:'150'},
                        {name:'Status',prop:'SaveAsDraftStatus',sortable:true,width:'100'},
                        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
                        {name:'View',prop:'View',sortable:false,width:'60'},
                        {name:'Delete',prop:'Delete',sortable:false,width:'60'},
                        ];
                }
            }
        });

    }

    bindCarerUnannouncedHomeVisit() {
        this.loading = true;
        this.apiService.get(this.controllerName, "GetAllByCarerParentId", this.CarerParentId).then(data => {
            //  this.cuhvServices.getUnannouncedHomeVisitList(this.CarerParentId).subscribe(data => {
            this.lstTemp = data;
            this.fnLoadSaveDraft()
        });
        this.apiService.get(this.controllerName, "GetListByCarerParentId", this.CarerParentId).then(data => {
          //this.lstTemp = data;
          //this.fnLoadSaveDraft()
          this.unAnnouncedHomevisitList=data;
      });
    }
    lstTemp = [];
    unAnnouncedHomevisitList=[];
    fnLoadSaveDraft() {
        this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = 60;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;
        this.objSaveDraftInfoDTO.TypeId = this.CarerParentId;
        let lstSaveDraft = [];
        this.apiService.post("SaveAsDraftInfo", "getall", this.objSaveDraftInfoDTO).then(data => {
            //this.sdService.getList(this.objSaveDraftInfoDTO).then(data => {
            let jsonData = [];
            data.forEach(item => {
                jsonData = JSON.parse(item.JsonList);
                jsonData.forEach(T => {
                    lstSaveDraft.push(T);
                });

            });
            this.loading = false;
            this.lstCarerUnannouncedHomeVisit = this.lstTemp.concat(lstSaveDraft);
            if(this.objQeryVal.apage!=undefined)
              this.insActivePage= parseInt(this.objQeryVal.apage);

        });
    }
    fnAddData() {
        this._router.navigate(['/pages/fostercarer/carerunannouncedhomevisitdata/0/3/1']);
    }

    public onPageChange() {
        let tem = document.querySelector('.pagination .page-item.active a');
        this.insActivePage=parseInt(tem.innerHTML);
    }

    editCarerUnannouncedHomeVisit(CarerUnannouncedHomeVisitId, hasDraft) {
        if (hasDraft)
            Common.SetSession("SaveAsDraft", "Y");
        else
            Common.SetSession("SaveAsDraft", "N");
        this._router.navigate(['/pages/fostercarer/carerunannouncedhomevisitdata', CarerUnannouncedHomeVisitId, 3,this.insActivePage]);
    }

    deleteCarerUnannouncedHomeVisit(SequenceNo, hasDraft) {

        this.objCarerUnannouncedHomeVisitDTO.SequenceNo = SequenceNo;
        //this.objCarerUnannouncedHomeVisitDTO.UniqueID = UniqueID;
        if (!hasDraft)
            this.apiService.delete(this.controllerName, this.objCarerUnannouncedHomeVisitDTO).then(data => this.Respone(data));
        // this.cuhvServices.post(this.objCarerUnannouncedHomeVisitDTO, "delete").then(data => this.Respone(data));
        else {
          this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
          this.objSaveDraftInfoDTO.FormCnfgId = 60;
          this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;
          this.objSaveDraftInfoDTO.TypeId = this.CarerParentId;

            this.objSaveDraftInfoDTO.SequenceNo = SequenceNo;
            this.apiService.delete("SaveAsDraftInfo", this.objSaveDraftInfoDTO).then(data => {
                // this.sdService.delete(this.objSaveDraftInfoDTO).then(data => {
                this.Respone(data);
            });
        }

    }

    private Respone(data) {
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.module.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindCarerUnannouncedHomeVisit();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objCarerUnannouncedHomeVisitDTO.SequenceNo;
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
          this.editCarerUnannouncedHomeVisit($event.SequenceNo,false);
      else if($event.SaveAsDraftStatus=='Saved as Draft')
          this.editCarerUnannouncedHomeVisit($event.SequenceNo,true);
  }
  onDelete($event){
      if($event.SaveAsDraftStatus=='Submitted')
          this.deleteCarerUnannouncedHomeVisit($event.SequenceNo,false);
      else if($event.SaveAsDraftStatus=='Saved as Draft')
          this.deleteCarerUnannouncedHomeVisit($event.SequenceNo,true);
  }
  onSignClick($event){
      this._router.navigate(['/pages/fostercarer/uhvfcsignature',$event.SequenceNo]);
  }
}
