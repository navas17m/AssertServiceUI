import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { SaveDraftInfoDTO } from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';
import { CarerDisclosureDTO } from './DTO/carerdisclosuredto';
import { AgencyKeyNameValueCnfgDTO } from '../superadmin/DTO/agencykeynamecnfgdto';

@Component
    ({
        selector: 'carerdisclosurelist',
        templateUrl: './carerdisclosurelist.component.template.html',
    })

export class carerdisclosureListComponent {
    objAgencyKeyNameValueCnfgDTO: AgencyKeyNameValueCnfgDTO = new AgencyKeyNameValueCnfgDTO();
    public searchText: string = "";
    isDefaultSortOrderVal: string;
    loading = false;
    UserTypeId;
    controllerName = "carerdisclosure";
    lstCarerDisclosure = [];
    objCarerDisclosureDTO: CarerDisclosureDTO = new CarerDisclosureDTO();
    returnVal;
    CarerParentId: number;
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    carerDisclosureList = [];
    columns =[];

    constructor(private _router: Router,
        private module: PagesComponent, private apiService: APICallService) {
            this.showGridColumns();
        this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
        if ((Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0")) {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 46]);
        }
        else {
            this.bindcarerdisclosure();
        }
    }
    private showGridColumns()
    {
        this.objAgencyKeyNameValueCnfgDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objAgencyKeyNameValueCnfgDTO.AgencyKeyNameCnfgId = 34;
        this.apiService.post("AgencyKeyNameCnfg", "GetById", this.objAgencyKeyNameValueCnfgDTO).then(data => {
            if(data)
            {              
                this.objAgencyKeyNameValueCnfgDTO = data;     
                if(this.objAgencyKeyNameValueCnfgDTO.Value!=null && this.objAgencyKeyNameValueCnfgDTO.Value=="1")
                {                   
                    this.columns=[
                        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
                        {name:'Date and Time of Disclosure',prop:'DateandTimeofDisclosure',sortable:true,width:'120'},
                        {name:'Status',prop:'SaveAsDraftStatus',sortable:true,width:'100'},
                        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
                        {name:'View',prop:'View',sortable:false,width:'60'},
                        {name:'Delete',prop:'Delete',sortable:false,width:'60'},
                        {name:'Signature', prop:'IsFCSignatureSigned',sortable:false,width:'80'}];
                }
                else
                {                    
                    this.columns=[
                        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
                        {name:'Date and Time of Disclosure',prop:'DateandTimeofDisclosure',sortable:true,width:'120'},
                        {name:'Status',prop:'SaveAsDraftStatus',sortable:true,width:'100'},
                        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
                        {name:'View',prop:'View',sortable:false,width:'60'},
                        {name:'Delete',prop:'Delete',sortable:false,width:'60'},
                        ];
                }
            }
        });

    }
    private bindcarerdisclosure() {
        if (this.CarerParentId != null)
            this.loading = true;
            this.apiService.get(this.controllerName, "GetListByCarerParentId", this.CarerParentId).then(data => {
               this.carerDisclosureList = data;
               this.loading = false;
            });
    }
    lstTemp = [];
    fnLoadSaveDraft() {
        this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = 330;
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
            this.lstCarerDisclosure = this.lstTemp.concat(lstSaveDraft);
            this.isDefaultSortOrderVal = "desc";
        });
    }
    fnAddData() {
        this._router.navigate(['/pages/fostercarer/disclosuredata/0/3']);
    }

    editdisclosure(disclosureId, hasDraft) {
        if (hasDraft)
            Common.SetSession("SaveAsDraft", "Y");
        else
            Common.SetSession("SaveAsDraft", "N");
        this._router.navigate(['/pages/fostercarer/disclosuredata', disclosureId, 3]);
    }

    deletedisclosure(SequenceNo, hasDraft) {

        this.objCarerDisclosureDTO.SequenceNo = SequenceNo;

        if (!hasDraft)
            this.apiService.delete(this.controllerName, this.objCarerDisclosureDTO).then(data => this.Respone(data));
        else {
            this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
            this.objSaveDraftInfoDTO.FormCnfgId = 330;
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
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.module.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindcarerdisclosure();
        }
    }
    onEdit($event){
      if($event.SaveAsDraftStatus=='Submitted')
          this.editdisclosure($event.SequenceNo,false);
      else if($event.SaveAsDraftStatus=='Saved as Draft')
          this.editdisclosure($event.SequenceNo,true);
    }
    onDelete($event){
      if($event.SaveAsDraftStatus=='Submitted')
          this.deletedisclosure($event.SequenceNo,false);
      else if($event.SaveAsDraftStatus=='Saved as Draft')
          this.deletedisclosure($event.SequenceNo,true);
    }
    onSignClick($event){
      this._router.navigate(['/pages/fostercarer/disclosurefcsignature',$event.SequenceNo]);
    }

}
