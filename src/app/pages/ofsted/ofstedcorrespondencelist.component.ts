import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { SaveDraftInfoDTO } from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';
import { OfstedCorrespondenceDTO } from './DTO/ofstedcorrespondencedto';

@Component
    ({
        selector: 'Ofsted Correspondence List',
        templateUrl: './ofstedcorrespondencelist.component.template.html',
    })

export class OfstedCorrespondenceListComponent {
    public searchText: string = "";
    lstofstedcorrespondence = [];
    objQeryVal;
    objOfstedCorrespondenceDTO: OfstedCorrespondenceDTO = new OfstedCorrespondenceDTO();
    returnVal;
    AgencyProfileId: number;
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    FormCnfgId;
    loading = false;
    controllerName = "OfstedCorrespondence";
    isDefaultSortOrderVal: string;
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'Date of Occurrence/Time',prop:'OccurenceDate',sortable:true,width:'200'},
        {name:'Type',prop:'EntryType',sortable:true,width:'150'},
        {name:'Subject',prop:'Subject',sortable:true,width:'200'},
        {name:'Status',prop:'SaveAsDraftStatus',sortable:true,width:'150'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
        {name:'View',prop:'View',sortable:false,width:'60'},
        {name:'Delete',prop:'Delete',sortable:false,width:'60'}
       ];

    constructor(private activatedroute: ActivatedRoute,
        private _router: Router, private module: PagesComponent, private apiService: APICallService) {

        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });

        this.FormCnfgId = 283;
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.bindOfstedorrespondence();
    }

    private bindOfstedorrespondence() {
        if (this.AgencyProfileId != null) {
            this.objOfstedCorrespondenceDTO.AgencyProfileId = this.AgencyProfileId;
            this.objOfstedCorrespondenceDTO.FormCnfgId = 283;
            this.loading = true;
            this.apiService.post(this.controllerName, "GetListByAgencyProfileId", this.objOfstedCorrespondenceDTO).then(data => {
                this.lstofstedcorrespondence = data;
                //this.fnLoadSaveDraft();
            });
        }
    }

    fnAddData() {
        this._router.navigate(['/pages/ofsted/ofstedcorrespondencedata/0/8']);
    }
    lstTemp = [];
    fnLoadSaveDraft() {
        this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = 283;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 8;
        this.objSaveDraftInfoDTO.TypeId = this.AgencyProfileId;
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
            this.lstofstedcorrespondence = this.lstTemp.concat(lstSaveDraft);
            this.isDefaultSortOrderVal = "desc";
        });
    }
    edit(ofstedcorrespondenceId, hasDraft) {
        if (hasDraft)
            Common.SetSession("SaveAsDraft", "Y");
        else
            Common.SetSession("SaveAsDraft", "N");

        this._router.navigate(['/pages/ofsted/ofstedcorrespondencedata', ofstedcorrespondenceId, 8]);
    }

    delete(SequenceNo, hasDraft) {
        this.objOfstedCorrespondenceDTO.SequenceNo = SequenceNo;
        this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = 283;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 8;
        this.objSaveDraftInfoDTO.TypeId = this.AgencyProfileId;
        
        //this.objOfstedCorrespondenceDTO.UniqueID = UniqueID;
        if (!hasDraft) {
            this.apiService.delete(this.controllerName, this.objOfstedCorrespondenceDTO).then(data => this.Respone(data));
        }
        else {
            this.objSaveDraftInfoDTO.SequenceNo = SequenceNo;
            this.apiService.delete("SaveAsDraftInfo", this.objSaveDraftInfoDTO).then(data => this.Respone(data));
        }

    }

    private Respone(data) {
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.module.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindOfstedorrespondence();
        }
    }
    onEdit(ofsted){
        if(ofsted.SaveAsDraftStatus == 'Submitted')
            this.edit(ofsted.SequenceNo,false);
        else if (ofsted.SaveAsDraftStatus == 'Saved as Draft')
            this.edit(ofsted.SequenceNo,true);
    }
    onDelete(ofsted){
        if(ofsted.SaveAsDraftStatus == 'Submitted')
            this.delete(ofsted.SequenceNo,false);
        else if (ofsted.SaveAsDraftStatus == 'Saved as Draft')
            this.delete(ofsted.SequenceNo,true);
    }
}