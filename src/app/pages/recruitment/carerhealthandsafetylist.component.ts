import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { SaveDraftInfoDTO } from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';
import { CarerHealthAndSafetyDTO } from './DTO/carerhealthandsafetydto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
import { AgencyKeyNameValueCnfgDTO } from '../superadmin/DTO/agencykeynamecnfgdto';
@Component
    ({
        selector: 'carerhealthandsafetylist',
        templateUrl: './carerhealthandsafetylist.component.template.html',
    })

export class CarerHealthAndSafetyListComponent {
    objAgencyKeyNameValueCnfgDTO: AgencyKeyNameValueCnfgDTO = new AgencyKeyNameValueCnfgDTO();
    public searchText: string = "";
    controllerName = "CarerHealthAndSafetyInfo";
    lstCarerHealthAndSafety = [];
    objCarerHealthAndSafetyDTO: CarerHealthAndSafetyDTO = new CarerHealthAndSafetyDTO();
    objQeryVal;
    returnVal;
    CarerParentId: number;
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    FormCnfgId;
    loading = false;
    columns =[];
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    constructor(private _router: Router,
        private route: ActivatedRoute, private module: PagesComponent, private apiService: APICallService) {
            this.showGridColumns();
        this.route.params.subscribe(data => this.objQeryVal = data);
        if (this.objQeryVal.mid == 3 && (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0")) {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 13]);
        }
        else if (this.objQeryVal.mid == 13 && (Common.GetSession("CarerParentId") == null || Common.GetSession("CarerParentId") == "0")) {
            this._router.navigate(['/pages/recruitment/applicantlist', 13, 13]);
        }
        else if (this.objQeryVal.mid == 3) {
            this.FormCnfgId = 46;
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
        }
        else if (this.objQeryVal.mid == 13) {
            this.FormCnfgId = 26;
            this.CarerParentId = parseInt(Common.GetSession("CarerParentId"));
        }
        this.bindCarerHealthAndSafety();
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
        this.objAgencyKeyNameValueCnfgDTO.AgencyKeyNameCnfgId = 36;
        this.apiService.post("AgencyKeyNameCnfg", "GetById", this.objAgencyKeyNameValueCnfgDTO).then(data => {
            if(data)
            {              
                this.objAgencyKeyNameValueCnfgDTO = data;     
                if(this.objAgencyKeyNameValueCnfgDTO.Value!=null && this.objAgencyKeyNameValueCnfgDTO.Value=="1")
                {                   
                    this.columns=[
                        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
                        {name:'Date of Inspection',prop:'DateOfInspection',sortable:true,width:'120',datetime:'Y'},
                        {name:'Date of Next Inspection',prop:'DateOfNextInspection',sortable:true,width:'150',date:'Y'},
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
                        {name:'Date of Inspection',prop:'DateOfInspection',sortable:true,width:'120',datetime:'Y'},
                        {name:'Date of Next Inspection',prop:'DateOfNextInspection',sortable:true,width:'150',date:'Y'},
                        {name:'Status',prop:'SaveAsDraftStatus',sortable:true,width:'100'},
                        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
                        {name:'View',prop:'View',sortable:false,width:'60'},
                        {name:'Delete',prop:'Delete',sortable:false,width:'60'},
                        ];
                }
            }
        });

    }
    private bindCarerHealthAndSafety() {
        this.loading = true;
        if (this.CarerParentId) {
            this.objCarerHealthAndSafetyDTO.CarerParentId = this.CarerParentId;
            this.objCarerHealthAndSafetyDTO.FormCnfgId = 26;

            // this.apiService.post(this.controllerName, "GetAllByCarerParentId", this.objCarerHealthAndSafetyDTO).then(data => {
            //     this.lstTemp = data;
            //     this.fnLoadSaveDraft()
            // });
            this.apiService.post(this.controllerName, "GetListByCarerParentId", this.objCarerHealthAndSafetyDTO).then(data => {
                 this.lstCarerHealthAndSafety = data;
                 this.loading=false;
                 //this.fnLoadSaveDraft()
             });
        }
    }
    lstTemp = [];
    fnLoadSaveDraft() {
        this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = 26;
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
            this.lstCarerHealthAndSafety = this.lstTemp.concat(lstSaveDraft);

        });
    }

    fnAddData() {

        if (this.objQeryVal.mid == 13)
            this._router.navigate(['/pages/recruitment/carerhealthandsafetydata/0/13']);
        else
            this._router.navigate(['/pages/fostercarer/carerhealthandsafetydata/0/3']);
    }

    editCarerHealthAndSafety(CarerHealthAndSafetyId, hasDraft) {
        if (hasDraft)
            Common.SetSession("SaveAsDraft", "Y");
        else
            Common.SetSession("SaveAsDraft", "N");
        if (this.objQeryVal.mid == 13)
            this._router.navigate(['/pages/recruitment/carerhealthandsafetydata', CarerHealthAndSafetyId, this.objQeryVal.mid]);
        else
            this._router.navigate(['/pages/fostercarer/carerhealthandsafetydata', CarerHealthAndSafetyId, this.objQeryVal.mid]);
    }

    deleteCarerHealthAndSafety(SequenceNo, hasDraft) {

        this.objCarerHealthAndSafetyDTO.SequenceNo = SequenceNo;
        //this.objCarerHealthAndSafetyDTO.UniqueID = UniqueID;
        if (!hasDraft)
        {
            this.apiService.delete(this.controllerName, this.objCarerHealthAndSafetyDTO).then(data => this.Respone(data));
          //  this.cdlServics.post(this.objCarerHealthAndSafetyDTO, "delete").then(data => this.Respone(data));
        }else {
            this.objSaveDraftInfoDTO.SequenceNo = SequenceNo;
            this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = 26;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;
        this.objSaveDraftInfoDTO.TypeId = this.CarerParentId;
            //this.sdService.delete(this.objSaveDraftInfoDTO).then(data => {
            //    this.Respone(data);
            //});
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
            this.bindCarerHealthAndSafety();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objCarerHealthAndSafetyDTO.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
    onEdit(item){
        if(item.SaveAsDraftStatus=='Submitted')
            this.editCarerHealthAndSafety(item.SequenceNo,false);
        else if(item.SaveAsDraftStatus == 'Saved as Draft')
            this.editCarerHealthAndSafety(item.SequenceNo,true);
    }
    onDelete(item){
        if(item.SaveAsDraftStatus=='Submitted')
            this.deleteCarerHealthAndSafety(item.SequenceNo,false);
        else if(item.SaveAsDraftStatus == 'Saved as Draft')
            this.deleteCarerHealthAndSafety(item.SequenceNo,true);
    }
    onSignClick(item){
        this._router.navigate(['/pages/recruitment/healthfcsignature',item.SequenceNo,this.objQeryVal.mid]);
    }
}
