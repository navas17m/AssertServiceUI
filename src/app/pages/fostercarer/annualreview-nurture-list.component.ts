import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { SaveDraftInfoDTO } from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';
import { AnnualReviewDTO } from './DTO/annualreview';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component({
    selector: 'AnnualReviewNurtureList',
    templateUrl: './annualreview-nurture-list.component.template.html',

})

export class AnnualReviewNurtureListComponet {
    controllerName = "CarerAnnualReviewNurture";
    objAnnualReviewDTO: AnnualReviewDTO = new AnnualReviewDTO();
    submitted = false;
    _Form: FormGroup;
    objQeryVal;
    annualReviweList = [];
    CarerParentId: number;
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    loading = false;insActivePage:number;
    formcnfgid=408;
    searchText;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();

    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'Review Date',prop:'ReviewDate',sortable:true,width:'120',date:'Y'},
        {name:'Status',prop:'SaveAsDraftStatus',sortable:true,width:'100'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
        {name:'View',prop:'View',sortable:false,width:'60'},
        {name:'Delete',prop:'Delete',sortable:false,width:'60'},
        {name:'Signature', prop:'SignatureStatus',sortable:false,width:'60'}];

    constructor(private _formBuilder: FormBuilder,
        private activatedroute: ActivatedRoute,
        private _router: Router,
        private module: PagesComponent, private apiService: APICallService) {
        this.insActivePage=1;
        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
        if (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0") {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 51]);
        }
        else
            this.BindAnnualReviewList();
        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.formcnfgid;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }

    public onPageChange() {
        let tem = document.querySelector('.pagination .page-item.active a');
        this.insActivePage=parseInt(tem.innerHTML);
    }

    BindAnnualReviewList() {
        if (this.CarerParentId != null) {
            this.loading = true;
            this.apiService.get(this.controllerName, "GetAllByCarerParentId", this.CarerParentId).then(data => {
                this.annualReviweList = data;
                this.loading = false;
                //this.fnLoadSaveDraft();
            });
        }
    }
    lstTemp = [];
    fnLoadSaveDraft() {
        this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = this.formcnfgid;
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
            this.annualReviweList = this.lstTemp.concat(lstSaveDraft);
            if(this.objQeryVal.apage!=undefined)
            this.insActivePage= parseInt(this.objQeryVal.apage);
        });
    }

    fnAddData() {
        Common.SetSession("SaveAsDraft", "N");
      //  console.log(1111111111111);
        this._router.navigate(['/pages/fostercarer/annualreviewdatanurture/0/3/1']);
    }

    onEdit($event){
        if($event.SaveAsDraftStatus=='Submitted')
            this.editAnnualReview($event.SequenceNo,false);
        else if($event.SaveAsDraftStatus=='Saved as Draft')
            this.editAnnualReview($event.SequenceNo,true);
    }
    onDelete($event){
        if($event.SaveAsDraftStatus=='Submitted')
            this.deleteAnnualReview($event.SequenceNo,$event.UniqueID,false);
        else if($event.SaveAsDraftStatus=='Saved as Draft')
            this.deleteAnnualReview($event.SequenceNo,$event.UniqueID,true);
    }
    onSignClick($event){
        this._router.navigate(['/pages/fostercarer/annualreviewnurturefcsignature',$event.SequenceNo]);
    }


    editAnnualReview(sNo, hasDraft) {
        if (hasDraft)
            Common.SetSession("SaveAsDraft", "Y");
        else
            Common.SetSession("SaveAsDraft", "N");
        this._router.navigate(['/pages/fostercarer/annualreviewdatanurture', sNo, 3,this.insActivePage]);
    }

    deleteAnnualReview(SequenceNo, UniqueID, hasDraft) {
        if (!hasDraft) {
            this.objAnnualReviewDTO.SequenceNo = SequenceNo;
            this.objAnnualReviewDTO.UniqueID = UniqueID;
            this.apiService.delete(this.controllerName, this.objAnnualReviewDTO).then(data => this.Respone(data));
        }
        else {
          this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
          this.objSaveDraftInfoDTO.FormCnfgId = this.formcnfgid;
          this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;
          this.objSaveDraftInfoDTO.TypeId = this.CarerParentId;
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
            this.BindAnnualReviewList();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objAnnualReviewDTO.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.formcnfgid;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
}

