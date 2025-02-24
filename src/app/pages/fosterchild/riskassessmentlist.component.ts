import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component} from '@angular/core';
import { Common } from '../common'
import { Base } from '../services/base.service'
import { ChildRiskAssessmentDTO } from './DTO/childriskassessmentdto';
import { PagesComponent } from '../pages.component';
import { SaveDraftInfoDTO} from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';
import { AgencyKeyNameValueCnfgDTO } from '../superadmin/DTO/agencykeynamecnfgdto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component
    ({
    selector: 'RiskAssessmentList',
    templateUrl: './riskassessmentlist.component.template.html',
    })

export class RiskAssessmentList {
    objAgencyKeyNameValueCnfgDTO: AgencyKeyNameValueCnfgDTO = new AgencyKeyNameValueCnfgDTO();
    public searchText: string = "";
    riskAssessmentList = []; loading = false;
    listRiskAssessment = [];
    columns =[];
    objRiskAssessmentDTO: ChildRiskAssessmentDTO = new ChildRiskAssessmentDTO();
    returnVal;
    carerParentId; objQeryVal;
    ChildID: number;
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    controllerName = "ChildRiskAssessment"; 
    insActivePage:number;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
     FormCnfgId=97;
    constructor(private apiService: APICallService, private modal: PagesComponent,
        private _router: Router, private activatedroute: ActivatedRoute) {
        this.insActivePage=1;
        this.showGridColumns();
        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });

        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindRiskAssessment();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/riskassessmentlist/4");
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
        this.objAgencyKeyNameValueCnfgDTO.AgencyKeyNameCnfgId = 31;
        this.apiService.post("AgencyKeyNameCnfg", "GetById", this.objAgencyKeyNameValueCnfgDTO).then(data => {
            if(data)
            {              
                this.objAgencyKeyNameValueCnfgDTO = data;     
                if(this.objAgencyKeyNameValueCnfgDTO.Value!=null && this.objAgencyKeyNameValueCnfgDTO.Value=="1")
                {                   
                    this.columns=[
                        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
                        {name:'Child Name',prop:'ChildName',sortable:true,width:'150'},
                        {name:'Carer Name',prop:'CarerName',sortable:true,width:'150'},
                        {name:'Date of Assessment',prop:'AssessmentDate',sortable:true,width:'200',date:'Y'},
                        {name:'Status',prop:'SaveAsDraftStatus',sortable:true,width:'80'},
                        {name:'Edit',prop:'Edit',sortable:false,width:'50'},
                        {name:'View',prop:'View',sortable:false,width:'50'},
                        {name:'Delete',prop:'Delete',sortable:false,width:'50'},
                        {name:'Signature', prop:'IsFCSignatureSigned',sortable:false,width:'60'}];
                }
                else
                {                    
                    this.columns=[
                        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
                        {name:'Child Name',prop:'ChildName',sortable:true,width:'150'},
                        {name:'Carer Name',prop:'CarerName',sortable:true,width:'150'},
                        {name:'Date of Assessment',prop:'AssessmentDate',sortable:true,width:'200',date:'Y'},
                        {name:'Status',prop:'SaveAsDraftStatus',sortable:true,width:'80'},
                        {name:'Edit',prop:'Edit',sortable:false,width:'50'},
                        {name:'View',prop:'View',sortable:false,width:'50'},
                        {name:'Delete',prop:'Delete',sortable:false,width:'50'},
                        ];
                }
            }
        });

    }
    lstTemp = [];
    fnLoadSaveDraft() {
        this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = 97;
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
            this.loading = false;
            this.riskAssessmentList = this.lstTemp.concat(lstSaveDraft);
            if(this.objQeryVal.apage!=undefined)
            this.insActivePage= parseInt(this.objQeryVal.apage);

        });
    }
    private bindRiskAssessment() {
        this.loading = true;
        // this.apiService.get(this.controllerName,"GetAll",this.ChildID).then(data => {
        //     this.lstTemp = data;
        //     this.fnLoadSaveDraft();
        // });
        this.apiService.get(this.controllerName,"GetList",this.ChildID).then(data => {
            this.listRiskAssessment = data;
            this.loading=false;
            //this.fnLoadSaveDraft();
        });
    }

    public onPageChange() {
        let tem = document.querySelector('.pagination .page-item.active a');
        this.insActivePage=parseInt(tem.innerHTML);
    }

    fnAddData() {
        this._router.navigate(['/pages/child/riskassessment/0/0/4/1']);
    }

    editSaferCarePolicy(id, CId,hasDraft) {
        if (hasDraft)
            Common.SetSession("SaveAsDraft", "Y");
        else
            Common.SetSession("SaveAsDraft", "N");

        this._router.navigate(['/pages/child/riskassessment/' + id + "/" + CId + "/" + "4"+"/"+this.insActivePage]);
    }
    
    deleteSaferCarePolicy(SequenceNo, hasDraft) {
        this.objRiskAssessmentDTO.SequenceNo = SequenceNo;
        //this.objRiskAssessmentDTO.UniqueID = UniqueID;
        if (!hasDraft)
            this.apiService.delete(this.controllerName, this.objRiskAssessmentDTO).then(data => this.Respone(data));
        else {
            this.objSaveDraftInfoDTO.SequenceNo = SequenceNo;
            this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = 97;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
        this.objSaveDraftInfoDTO.TypeId = this.ChildID;
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
            this.bindRiskAssessment();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objRiskAssessmentDTO.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
    onEdit($event){
        if($event.SaveAsDraftStatus=='Submitted')
            this.editSaferCarePolicy($event.SequenceNo,$event.carerParentId,false);
        else if($event.SaveAsDraftStatus=='Saved as Draft')
            this.editSaferCarePolicy($event.SequenceNo,$event.carerParentId,true);
    }
    onDelete($event){
        if($event.SaveAsDraftStatus=='Submitted')
            this.deleteSaferCarePolicy($event.SequenceNo,false);
        else if($event.SaveAsDraftStatus=='Saved as Draft')
            this.deleteSaferCarePolicy($event.SequenceNo,true);
    }
    onSignClick($event){
        this._router.navigate(['/pages/child/riskassessmentfcsignature',$event.SequenceNo,$event.CarerParentId]);
    }

}