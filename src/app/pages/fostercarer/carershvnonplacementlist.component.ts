import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { SaveDraftInfoDTO } from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';
import { CarerSHVNonPlacementDTO } from './DTO/carershvnonplacementdto';

@Component
    ({
        selector: 'CarerSHVNonPlacementList',
        templateUrl: './carershvnonplacementlist.component.template.html',
    })

export class CarerSHVNonPlacementListComponent {
    public searchText: string = "";
    lstCarerSHVNonPlacement = [];
    objCarerSHVNonPlacementDTO: CarerSHVNonPlacementDTO = new CarerSHVNonPlacementDTO();
    returnVal;
    CarerParentId: number;
    controllerName = "CarerSHVNonPlacement";
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    lstTemp = [];
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'Date of Supervision',prop:'DateofSupervision',sortable:true,width:'200'},
        {name:'Status',prop:'SaveAsDraftStatus',sortable:false,width:'150'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
        {name:'View',prop:'View',sortable:false,width:'60'},
        {name:'Delete',prop:'Delete',sortable:false,width:'60'}
       ];
    constructor(private apiService: APICallService, private _formBuilder: FormBuilder, private _router: Router, private modal: PagesComponent) {


        if (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0") {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 37]);
        }
        else {
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            this.bindCarerSHVNonPlacement();
        }
    }

    private bindCarerSHVNonPlacement() {
        if (this.CarerParentId != null) {
            this.apiService.get(this.controllerName, "GetListByCarerParentId", this.CarerParentId).then(data => {
                //this.lstTemp = data;
                //this.fnLoadSaveDraft();
                this.lstCarerSHVNonPlacement=data;
            });
        }
    }
    fnLoadSaveDraft() {
        this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = 240;
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
            this.lstCarerSHVNonPlacement = this.lstTemp.concat(lstSaveDraft);
        });
    }

    fnAddData() {
        this._router.navigate(['/pages/fostercarer/shvnonplacementdata/0/3']);
    }

    edit(Id, hasDraft) {
        if (hasDraft)
            Common.SetSession("SaveAsDraft", "Y");
        else
            Common.SetSession("SaveAsDraft", "N");
        this._router.navigate(['/pages/fostercarer/shvnonplacementdata', Id, 3]);
    }

    delete(SequenceNo,  hasDraft) {
        this.objCarerSHVNonPlacementDTO.SequenceNo = SequenceNo;
        //this.objCarerSHVNonPlacementDTO.UniqueID = UniqueID;
        if (!hasDraft)
            this.apiService.delete(this.controllerName, this.objCarerSHVNonPlacementDTO).then(data => this.Respone(data));
        else {
            this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
            this.objSaveDraftInfoDTO.FormCnfgId = 240;
            this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;
            this.objSaveDraftInfoDTO.TypeId = this.CarerParentId;
            this.objSaveDraftInfoDTO.SequenceNo = SequenceNo;
            this.apiService.delete("SaveAsDraftInfo", this.objSaveDraftInfoDTO).then(data => {
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
            this.bindCarerSHVNonPlacement();
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