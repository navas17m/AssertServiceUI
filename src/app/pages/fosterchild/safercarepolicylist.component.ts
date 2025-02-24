import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { SaveDraftInfoDTO } from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';
import { ChildSaferCarePolicyDTO } from './DTO/childsafercarepolicydto';
import { AgencyKeyNameValueCnfgDTO } from '../superadmin/DTO/agencykeynamecnfgdto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component
    ({
    selector: 'safercarepolicylist',
    templateUrl: './safercarepolicylist.component.template.html',
    })

export class SaferCarePolicyList{
    
 objAgencyKeyNameValueCnfgDTO: AgencyKeyNameValueCnfgDTO = new AgencyKeyNameValueCnfgDTO();
    public searchText: string = "";
    rows:any[]=[];
    seqNo;
    tableSource = [];
    lstSaveDraftList = [];
    safercarepolicyList = []; loading = false;
    objSaferCarePolicyDTO: ChildSaferCarePolicyDTO = new ChildSaferCarePolicyDTO();
    returnVal;
    carerParentId; objQeryVal;
    ChildID: number;
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO(); controllerName = "ChildSaferPolicy";
    insActivePage:number;
    columns =[];
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
     FormCnfgId=98;
    constructor(private apiService: APICallService, private _router: Router,
        private activatedroute: ActivatedRoute, private modal: PagesComponent
        ) {
            this.insActivePage=1;
            this.showGridColumns();
            this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindSaferCarePolicy();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/safercarepolicylist/4");
            this._router.navigate(['/pages/referral/childprofilelist/1/16']);
        }

        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }
    private showGridColumns()
    {
        this.objAgencyKeyNameValueCnfgDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objAgencyKeyNameValueCnfgDTO.AgencyKeyNameCnfgId = 32;
        this.apiService.post("AgencyKeyNameCnfg", "GetById", this.objAgencyKeyNameValueCnfgDTO).then(data => {
            if(data)
            {              
                this.objAgencyKeyNameValueCnfgDTO = data;     
                if(this.objAgencyKeyNameValueCnfgDTO.Value!=null && this.objAgencyKeyNameValueCnfgDTO.Value=="1")
                {                   
                    this.columns=[
                        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
                        {name:'Carer Name',prop:'CarerName',sortable:true,width:'200'},
                        {name:'Inspection Date',prop:'InspectionDate',sortable:true,width:'120',date:'Y'},
                        {name:'Next Inspection Date',prop:'NextInspectionDate',sortable:true,width:'150',date:'Y'},
                        {name:'Status',prop:'SaveAsDraftStatus',sortable:true,width:'100'},
                        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
                        {name:'View',prop:'View',sortable:false,width:'60'},
                        {name:'Delete',prop:'Delete',sortable:false,width:'60'},
                        {name:'Signature', prop:'SignatureStatus',sortable:false,width:'60',link:'/pages/child/childsafecarefcsignature'}];
                }
                else
                {                    
                    this.columns=[
                        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
                        {name:'Carer Name',prop:'CarerName',sortable:true,width:'200'},
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
        this.objSaveDraftInfoDTO.FormCnfgId = 98;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
        this.objSaveDraftInfoDTO.TypeId = this.ChildID;
        let lstSaveDraft = [];
        this.apiService.post("SaveAsDraftInfo","getall",this.objSaveDraftInfoDTO).then(data => {
            let jsonData = [];
            data.forEach(item => {
                jsonData = JSON.parse(item.JsonList);
                jsonData.forEach(T => {
                    lstSaveDraft.push(T);
                });

            });
            this.safercarepolicyList = this.lstTemp.concat(lstSaveDraft);
            if(this.objQeryVal.apage!=undefined)
            this.insActivePage= parseInt(this.objQeryVal.apage);
        });
    }
    private bindSaferCarePolicy() {
        this.loading = true;
        //this.apiService.get(this.controllerName,"GetAll",this.ChildID).then(data => {
        this.apiService.get(this.controllerName,"GetList",this.ChildID).then(data => {
            this.lstTemp = data;
            this.safercarepolicyList = this.lstTemp;
            //this.fnLoadSaveDraft();
            this.loading=false;
        });
    }

    public onPageChange() {
        let tem = document.querySelector('.pagination .page-item.active a');
        this.insActivePage=parseInt(tem.innerHTML);
    }
    fnAddData() {
        this._router.navigate(['/pages/child/safercarepolicy/0/0/4/1']);
    }

    editSaferCarePolicy(id, CId,hasDraft) {
        if (hasDraft)
            Common.SetSession("SaveAsDraft", "Y");
        else
            Common.SetSession("SaveAsDraft", "N");
        this._router.navigate(['/pages/child/safercarepolicy/' + id + "/" + CId + "/" + "4/"+this.insActivePage]);
    }

    deleteSaferCarePolicy(SequenceNo, UniqueID, hasDraft) {
        this.objSaferCarePolicyDTO.SequenceNo = SequenceNo;
            this.objSaferCarePolicyDTO.UniqueID = UniqueID;
            if (!hasDraft)
                this.apiService.delete(this.controllerName,this.objSaferCarePolicyDTO).then(data => this.Respone(data));
            else {
                this.objSaveDraftInfoDTO.SequenceNo = SequenceNo;
                this.apiService.post("SaveAsDraftInfo","Delete",this.objSaveDraftInfoDTO).then(data => {
                    this.Respone(data);
                });
            }
    }
    deleteSaferCarePolicyNew(SequenceNo, hasDraft){
        this.objSaferCarePolicyDTO.SequenceNo = SequenceNo;
            //this.objSaferCarePolicyDTO.UniqueID = UniqueID;
            if (!hasDraft)
                this.apiService.delete(this.controllerName,this.objSaferCarePolicyDTO).then(data => this.Respone(data));
            else {
                this.objSaveDraftInfoDTO.FormCnfgId = 98;
                this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
                this.objSaveDraftInfoDTO.TypeId = this.ChildID;
                this.objSaveDraftInfoDTO.SequenceNo = SequenceNo;
                this.apiService.post("SaveAsDraftInfo","Delete",this.objSaveDraftInfoDTO).then(data => {
                    this.Respone(data);
                });
            }
    }

    //Not used.
    private getTableSource(data):any{
        this.tableSource = [];
        let seqNos = [...new Set(data.map(item => item.SequenceNo))];
            seqNos.forEach( SeqNo =>{
                let temp:any= {};
                const seqGroup = data.filter(element => element.SequenceNo == SeqNo);
                seqGroup.forEach( element => {
                        temp.carerName = element.CarerName==null? 'Not Placed' : element.CarerName;
                        temp.sequenceNo = element.SequenceNo;
                        temp.carerParentId = element.CarerParentId;
                        temp.isFCSignatureSigned = false;
                        if(element.FieldName === "InspectionDate")
                            temp.inspectionDate = element.FieldValue;
                        else if(element.FieldName === "NextInspectionDate")
                            temp.nextInspectionDate = element.FieldValue;
                        else if(element.FieldName === "SaveAsDraftStatus")
                            temp.saveAsDraftStatus = element.FieldValue==0? 'Submitted':'Saved as Draft';
                        else if(element.FieldName === "IsActive")
                            temp.isActive = element.FieldValue;
                });
                this.tableSource.push(temp);
            });
            return this.tableSource;
            //console.log(JSON.stringify(this.rows));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindSaferCarePolicy();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objSaferCarePolicyDTO.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
        
    }

    onEdit($event){
        if($event.SaveAsDraftStatus=='Submitted')
            this.editSaferCarePolicy($event.SequenceNo,$event.CarerParentId,false);
        else if($event.SaveAsDraftStatus=='Saved as Draft')
            this.editSaferCarePolicy($event.SequenceNo,$event.CarerParentId,true);
    }
    onDelete($event){
        if($event.SaveAsDraftStatus=='Submitted')
            this.deleteSaferCarePolicyNew($event.SequenceNo,false);
        else if($event.SaveAsDraftStatus=='Saved as Draft')
            this.deleteSaferCarePolicyNew($event.SequenceNo,true);
    }
    onSignClick($event){
        this._router.navigate(['/pages/child/childsafecarefcsignature',$event.SequenceNo]);
    }
}
