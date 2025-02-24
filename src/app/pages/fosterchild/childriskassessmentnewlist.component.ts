
import { Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { Router, ActivatedRoute} from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { ChildRiskAssessmentNewComboDTO } from './DTO/childriskassessmentnewdto'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { SaveDraftInfoDTO} from '../savedraft/DTO/savedraftinfodto';
import { sequence } from '@angular/animations';
import { AgencyKeyNameValueCnfgDTO } from '../superadmin/DTO/agencykeynamecnfgdto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component
    ({
        selector: 'ChildRiskAssessmentNewList',
        templateUrl: './childriskassessmentnewlist.component.template.html',
       // template: ``,
    })

export class ChildRiskAssessmentNewListComponent {
    objAgencyKeyNameValueCnfgDTO: AgencyKeyNameValueCnfgDTO = new AgencyKeyNameValueCnfgDTO();
    public searchText: string = "";
    lstChildRiskAssessmentNew = []; loading = false;
    childRiskAssessmentNewList = [];
    columns =[];
    objChildRiskAssessmentNewComboDTO: ChildRiskAssessmentNewComboDTO = new ChildRiskAssessmentNewComboDTO();
    returnVal;
    objQeryVal;
    ChildId: number;
    controllerName = "ChildRiskAssessmentNew";
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    lstTemp = [];
    isDefaultSortOrderVal: string;
    insActivePage:number;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
     FormCnfgId=239;
    constructor(private apiService: APICallService, private _formBuilder: FormBuilder,
        private _router: Router, private modal: PagesComponent,
        private route: ActivatedRoute) {
            this.showGridColumns();
            this.insActivePage=1;
       // this._router.navigate(['/pages/child/childriskassessmentnew/4']);

        this.route.params.subscribe(data => this.objQeryVal = data);
        if (this.objQeryVal.mid == 16) {
           if (Common.GetSession("ReferralChildId") != null && Common.GetSession("ReferralChildId") != "null") {
               this.ChildId = parseInt(Common.GetSession("ReferralChildId"));
               this.bindChildRiskAssessment();
           }
           else {
               Common.SetSession("UrlReferral", "pages/referral/childriskassessmentlist/16");
               this._router.navigate(['/pages/referral/childprofilelist/0/16']);
           }
        }
        else if (this.objQeryVal.mid == 4) {
           if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != "null") {
               this.ChildId = parseInt(Common.GetSession("ChildId"));
               this.bindChildRiskAssessment();
           }
           else {
               Common.SetSession("UrlReferral", "pages/child/childriskassessmentlist/4");
               this._router.navigate(['/pages/child/childprofilelist/1/4']);
           }
        }

        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildId;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }
    private showGridColumns()
    {
        this.objAgencyKeyNameValueCnfgDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objAgencyKeyNameValueCnfgDTO.AgencyKeyNameCnfgId = 30;
        this.apiService.post("AgencyKeyNameCnfg", "GetById", this.objAgencyKeyNameValueCnfgDTO).then(data => {
            if(data)
            {              
                this.objAgencyKeyNameValueCnfgDTO = data;     
                if(this.objAgencyKeyNameValueCnfgDTO.Value!=null && this.objAgencyKeyNameValueCnfgDTO.Value=="1")
                {                   
                    this.columns=[
                        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
                        {name:'Date of Assessment',prop:'DateofAssessment',sortable:true,width:'120',date:'Y'},
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
                        {name:'Date of Assessment',prop:'DateofAssessment',sortable:true,width:'120',date:'Y'},
                        {name:'Status',prop:'SaveAsDraftStatus',sortable:true,width:'100'},
                        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
                        {name:'View',prop:'View',sortable:false,width:'60'},
                        {name:'Delete',prop:'Delete',sortable:false,width:'60'},
                       ];
                }
            }
        });

    }
    public onPageChange() {
        let tem = document.querySelector('.pagination .page-item.active a');
        this.insActivePage=parseInt(tem.innerHTML);
    }

    private bindChildRiskAssessment() {
       if (this.ChildId != null) {
           this.loading = true;
        //    this.apiService.get(this.controllerName, "GetListByChildId", this.ChildId).then(data => {
        //        this.lstTemp = data;
        //        this.fnLoadSaveDraft();
        //    });
           this.apiService.get(this.controllerName, "GetNewListByChildId", this.ChildId).then(data => {
            this.childRiskAssessmentNewList = data;
            this.loading = false;
            //this.fnLoadSaveDraft();
        });
       }
    }
    fnLoadSaveDraft() {
       this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
       this.objSaveDraftInfoDTO.FormCnfgId = 239;
       this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
       this.objSaveDraftInfoDTO.TypeId = this.ChildId;
       let lstSaveDraft = [];
       this.apiService.post("SaveAsDraftInfo", "getall", this.objSaveDraftInfoDTO).then(data => {
           let jsonData = [];
           //console.log(data);
           data.forEach(item => {
               let jsonDataTemp = JSON.parse(item.JsonList);
               //  console.log(jsonDataTemp.DynamicValue);
               jsonData = jsonDataTemp;
               jsonData.forEach(T => {
                   lstSaveDraft.push(T);
               });

           });
           this.loading = false;
           this.lstChildRiskAssessmentNew = this.lstTemp.concat(lstSaveDraft);
           this.isDefaultSortOrderVal = "desc";
           if(this.objQeryVal.apage!=undefined)
              this.insActivePage=this.objQeryVal.apage;
       });
    }

    fnAddData() {
        Common.SetSession("SaveAsDraftrisk", null);
       this._router.navigate(['/pages/child/childriskassessmentdata/0/4/1']);
    }

    edit(Id,ChildId, hasDraft) {

       if(Id==1)
       {
           Id=ChildId;
       }

       if (hasDraft)
           Common.SetSession("SaveAsDraftrisk", "Y");
       else
           Common.SetSession("SaveAsDraftrisk", "N");
       this._router.navigate(['/pages/child/childriskassessmentdata', Id, 4,this.insActivePage]);
    }

    delete(SequenceNo,ChildId, hasDraft) {

      // console.log(SequenceNo);
       this.objChildRiskAssessmentNewComboDTO.SequenceNo = SequenceNo;
       //   this.objChildRiskAssessmentNewComboDTO.UniqueID = UniqueID;
       if (!hasDraft)
           this.apiService.delete(this.controllerName, this.objChildRiskAssessmentNewComboDTO).then(data => this.Respone(data));
       else {

            if(SequenceNo==1)
            {
             SequenceNo=ChildId;
            }
          // console.log(SequenceNo) ;
           this.objSaveDraftInfoDTO.SequenceNo = SequenceNo;
           this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
            this.objSaveDraftInfoDTO.FormCnfgId = 239;
            this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
            this.objSaveDraftInfoDTO.TypeId = this.ChildId;

           //console.log(this.objSaveDraftInfoDTO);
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
           this.bindChildRiskAssessment();
           this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objChildRiskAssessmentNewComboDTO.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildId;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
       }
    }
    onEdit($event){
        if($event.SaveAsDraftStatus=='Submitted')
            this.edit($event.SequenceNo,$event.ChildId,false);
        else if($event.SaveAsDraftStatus=='Saved as Draft')
            this.edit($event.SequenceNo,$event.ChildId,true);
    }
    onDelete($event){
        if($event.SaveAsDraftStatus=='Submitted')
            this.delete($event.SequenceNo,$event.ChildId,false);
        else if($event.SaveAsDraftStatus=='Saved as Draft')
            this.delete($event.SequenceNo,$event.ChildId,true);
    }
    onSignClick($event){
        this._router.navigate(['/pages/child/childriskassessmentlistsignature',$event.SequenceNo]);
    }
}
