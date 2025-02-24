import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { SaveDraftInfoDTO } from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';
import { CarerComplementsDTO } from './DTO/carercomplementsdto';

@Component
    ({
        selector: 'CarerComplementsList',
        templateUrl: './carercomplementslist.component.template.html',
    })

export class CarerComplementsListComponent{
    public searchText: string = "";
    lstCarerComplements = [];
    objQeryVal;
    objCarerComplementsDTO: CarerComplementsDTO = new CarerComplementsDTO();
    returnVal;
    CarerParentId: number;
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    FormCnfgId;
    loading = false;
    controllerName = "CarerComplements";
    isDefaultSortOrderVal="";
    columns =[
      {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
      {name:'Date of Occurrence/Time',prop:'OccurenceDate',sortable:true,width:'150',datetime:'Y'},
      {name:'Type',prop:'EntryType',sortable:true,width:'150'},
      {name:'Subject',prop:'Subject',sortable:true,width:'150'},
      {name:'Status',prop:'SaveAsDraftStatus',sortable:false,width:'150'},
      {name:'Edit',prop:'Edit',sortable:false,width:'60'},
      {name:'View',prop:'View',sortable:false,width:'60'},
      {name:'Delete',prop:'Delete',sortable:false,width:'60'}
     ];
    constructor(private activatedroute: ActivatedRoute,
        private _router: Router, private module: PagesComponent, private apiService: APICallService) {

        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        if (this.objQeryVal.mid == 3 && (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0")) {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 43]);
        }
        else if (this.objQeryVal.mid == 3) {
            this.FormCnfgId = 310;
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            this.bindCarerDayLog();
        }
    }

    private bindCarerDayLog() {
        if (this.CarerParentId != null) {
            this.objCarerComplementsDTO.CarerParentId = this.CarerParentId;
            this.objCarerComplementsDTO.FormCnfgId = 310;
            this.loading = true;
            this.apiService.post(this.controllerName, "GetListByCarerParentId", this.objCarerComplementsDTO).then(data => {
                //this.lstTemp = data;
                //this.fnLoadSaveDraft();
                this.lstCarerComplements = data;
                console.log(this.lstCarerComplements);
                this.loading=false;
            });
        }
    }

    fnAddData() {
        this._router.navigate(['/pages/fostercarer/complementsdata/0/3']);
    }
    lstTemp = [];
    fnLoadSaveDraft() {
        this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = 310;
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
            this.loading = false;
            this.lstCarerComplements = this.lstTemp.concat(lstSaveDraft);
            this.isDefaultSortOrderVal = "desc";
        });
    }
    edit(CarerDayLogId, hasDraft) {
        if (hasDraft)
            Common.SetSession("SaveAsDraft", "Y");
        else
            Common.SetSession("SaveAsDraft", "N");

        this._router.navigate(['/pages/fostercarer/complementsdata', CarerDayLogId, this.objQeryVal.mid]);
    }

    delete(SequenceNo, hasDraft) {

        this.objCarerComplementsDTO.SequenceNo = SequenceNo;
        //this.objCarerComplementsDTO.UniqueID = UniqueID;
        if (!hasDraft) {
            this.apiService.delete(this.controllerName, this.objCarerComplementsDTO).then(data => this.Respone(data));
        }
        else {
            this.objSaveDraftInfoDTO.SequenceNo = SequenceNo;
            this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
            this.objSaveDraftInfoDTO.FormCnfgId = 310;
            this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;
            this.objSaveDraftInfoDTO.TypeId = this.CarerParentId;

            this.apiService.delete("SaveAsDraftInfo", this.objSaveDraftInfoDTO).then(data => this.Respone(data));
        }

    }

    private Respone(data) {
        this.loading=false;
            if (data.IsError == true) {
                this.module.alertDanger(data.ErrorMessage)
            }
            else if (data.IsError == false) {
                this.module.alertSuccess(Common.GetDeleteSuccessfullMsg);
                this.bindCarerDayLog();
            }
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
}
