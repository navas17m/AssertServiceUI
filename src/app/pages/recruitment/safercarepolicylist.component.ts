import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
//import { SaferCarePolicyService}  from '../services/safercarepolicy.services'
import { PagesComponent } from '../pages.component';
//import { SaveDraftService } from '../services/savedraft/savedraftinfo.service';
import { SaveDraftInfoDTO } from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';
import { SaferCarePolicyDTO } from './DTO/safercarepolicy';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
import { AgencyKeyNameValueCnfgDTO } from '../superadmin/DTO/agencykeynamecnfgdto';
@Component
    ({
        selector: 'SaferCarePolicyList',
        templateUrl: './safercarepolicylist.component.template.html',
    })

export class SaferCarePolicyListComponent {
    objAgencyKeyNameValueCnfgDTO: AgencyKeyNameValueCnfgDTO = new AgencyKeyNameValueCnfgDTO();
    public searchText: string = "";
    loading = false;
    controllerName = "CarerSaferPolicy";
    safercarepolicyList = [];
    objSaferCarePolicyDTO: SaferCarePolicyDTO = new SaferCarePolicyDTO();
    returnVal;
    objQeryVal;
    CarerParentId: number;
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    FormCnfgId;
    insActivePage:number;
    columns =[];
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    constructor(private _router: Router,
        private activatedroute: ActivatedRoute, private module: PagesComponent,
        private apiService: APICallService) {
            this.insActivePage=1;
            this.showGridColumns();
        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        if (this.objQeryVal.mid == 3 && (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0")) {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 12]);
        }
        else if (this.objQeryVal.mid == 13 && (Common.GetSession("CarerParentId") == null || Common.GetSession("CarerParentId") == "0")) {
            this._router.navigate(['/pages/recruitment/applicantlist', 13, 12]);
        }
        else if (this.objQeryVal.mid == 3) {
            this.FormCnfgId = 49;
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
        }
        else if (this.objQeryVal.mid == 13) {
            this.FormCnfgId = 29;
            this.CarerParentId = parseInt(Common.GetSession("CarerParentId"));
        }

        this.bindSaferCarePolicy();
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
        this.objAgencyKeyNameValueCnfgDTO.AgencyKeyNameCnfgId = 37;
        this.apiService.post("AgencyKeyNameCnfg", "GetById", this.objAgencyKeyNameValueCnfgDTO).then(data => {
            if(data)
            {              
                this.objAgencyKeyNameValueCnfgDTO = data;     
                if(this.objAgencyKeyNameValueCnfgDTO.Value!=null && this.objAgencyKeyNameValueCnfgDTO.Value=="1")
                {                   
                    this.columns=[
                        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
                        {name:'Child Code',prop:'ChildName',sortable:true,width:'200'},
                        {name:'Inspection Date',prop:'InspectionDate',sortable:true,width:'120',date:'Y'},
                        {name:'Next Inspection Date',prop:'NextInspectionDate',sortable:true,width:'150',date:'Y'},
                        {name:'Status',prop:'SaveAsDraftStatus',sortable:true,width:'100'},
                        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
                        {name:'View',prop:'View',sortable:false,width:'60'},
                        {name:'Delete',prop:'Delete',sortable:false,width:'60'},
                        {name:'Signature', prop:'SignatureStatus',sortable:false,width:'60',link:'/pages/recruitment/safecarefcsignature'}];
                }
                else
                {                    
                    this.columns=[
                        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
                        {name:'Child Code',prop:'ChildName',sortable:true,width:'200'},
                        {name:'Inspection Date',prop:'InspectionDate',sortable:true,width:'120',date:'Y'},
                        {name:'Next Inspection Date',prop:'NextInspectionDate',sortable:true,width:'150',date:'Y'},
                        {name:'Status',prop:'SaveAsDraftStatus',sortable:true,width:'100'},
                        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
                        {name:'View',prop:'View',sortable:false,width:'60'},
                        {name:'Delete',prop:'Delete',sortable:false,width:'60'},
                        ];
                }
            }
        });

    }
    lstTemp = [];
    fnLoadSaveDraft() {
        this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = 29;
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
            this.safercarepolicyList = this.lstTemp.concat(lstSaveDraft);
            if(this.objQeryVal.apage!=undefined)
                this.insActivePage= parseInt(this.objQeryVal.apage);

        });
    }
    public onPageChange() {
        let tem = document.querySelector('.pagination .page-item.active a');
        this.insActivePage=parseInt(tem.innerHTML);
    }

    private bindSaferCarePolicy() {
        if (this.CarerParentId != null && this.CarerParentId != 0) {
            this.objSaferCarePolicyDTO.CarerParentId = this.CarerParentId;
            this.objSaferCarePolicyDTO.FormCnfgId = 29;
            //this.saferService.getByCarerParentId(this.objSaferCarePolicyDTO).then(data => {
            //    this.lstTemp = data;
            //    this.fnLoadSaveDraft();
            //});
            this.loading = true;
            //this.apiService.post(this.controllerName, "GetByCarerParentId", this.objSaferCarePolicyDTO).then(data => {
            this.apiService.get(this.controllerName, "GetList", this.CarerParentId).then(data => {
                //this.lstTemp = data;
                //this.fnLoadSaveDraft();
                this.safercarepolicyList=data;
                this.loading=false;
            });
        }
    }

    fnAddData() {
        if (this.objQeryVal.mid == 13)
            this._router.navigate(['/pages/recruitment/safercarepolicy/0/13/1']);
        else
            this._router.navigate(['/pages/fostercarer/safecarepolicydata/0/3/1']);
    }

    editSaferCarePolicy(id, hasDraft) {
        if (hasDraft)
            Common.SetSession("SaveAsDraft", "Y");
        else
            Common.SetSession("SaveAsDraft", "N");
        if (this.objQeryVal.mid == 13)
            this._router.navigate(['/pages/recruitment/safercarepolicy', id, this.objQeryVal.mid,this.insActivePage]);
        else
            this._router.navigate(['/pages/fostercarer/safecarepolicydata', id, this.objQeryVal.mid,this.insActivePage]);
    }

    deleteSaferCarePolicy(SequenceNo, hasDraft) {

        this.objSaferCarePolicyDTO.SequenceNo = SequenceNo;
        //this.objSaferCarePolicyDTO.UniqueID = UniqueID;
        if (!hasDraft) {
            this.apiService.delete(this.controllerName, this.objSaferCarePolicyDTO).then(data => this.Respone(data));
            //this.saferService.post(this.objSaferCarePolicyDTO, "delete").then(data => this.Respone(data));
        }
        else {
            this.objSaveDraftInfoDTO.SequenceNo = SequenceNo;
            this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
            this.objSaveDraftInfoDTO.FormCnfgId = 29;
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
            this.bindSaferCarePolicy();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objSaferCarePolicyDTO.SequenceNo;
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
            this.editSaferCarePolicy($event.SequenceNo,false);
        else if($event.SaveAsDraftStatus=='Saved as Draft')
            this.editSaferCarePolicy($event.SequenceNo,true);
    }
    onDelete($event){
        if($event.SaveAsDraftStatus=='Submitted')
            this.deleteSaferCarePolicy($event.SequenceNo,false);
        else if($event.SaveAsDraftStatus=='Saved as Draft')
            this.deleteSaferCarePolicy($event.SequenceNo,true);
    }
    onSignClick($event){
        this._router.navigate(['/pages/recruitment/safecarefcsignature',$event.SequenceNo,this.objQeryVal.mid]);
    }
}
