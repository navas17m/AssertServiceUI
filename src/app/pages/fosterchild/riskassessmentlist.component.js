import { __decorate, __metadata } from "tslib";
import { Router, ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { Common } from '../common';
import { ChildRiskAssessmentDTO } from './DTO/childriskassessmentdto';
import { PagesComponent } from '../pages.component';
import { SaveDraftInfoDTO } from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';
let RiskAssessmentList = class RiskAssessmentList {
    constructor(apiService, modal, _router, activatedroute) {
        this.apiService = apiService;
        this.modal = modal;
        this._router = _router;
        this.activatedroute = activatedroute;
        this.riskAssessmentList = [];
        this.loading = false;
        this.objRiskAssessmentDTO = new ChildRiskAssessmentDTO();
        this.objSaveDraftInfoDTO = new SaveDraftInfoDTO();
        this.controllerName = "ChildRiskAssessment";
        this.lstTemp = [];
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindRiskAssessment();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/riskassessmentlist/4");
            this._router.navigate(['/pages/referral/childprofilelist/1/16']);
        }
    }
    fnLoadSaveDraft() {
        this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = 97;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
        this.objSaveDraftInfoDTO.TypeId = this.ChildID;
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
            this.riskAssessmentList = this.lstTemp.concat(lstSaveDraft);
        });
    }
    bindRiskAssessment() {
        this.loading = true;
        this.apiService.get(this.controllerName, "GetAll", this.ChildID).then(data => {
            this.lstTemp = data;
            this.fnLoadSaveDraft();
        });
    }
    fnAddData() {
        this._router.navigate(['/pages/child/riskassessment/0/0/4']);
    }
    editSaferCarePolicy(id, CId, hasDraft) {
        if (hasDraft)
            Common.SetSession("SaveAsDraft", "Y");
        else
            Common.SetSession("SaveAsDraft", "N");
        this._router.navigate(['/pages/child/riskassessment/' + id + "/" + CId + "/" + "4"]);
    }
    deleteSaferCarePolicy(SequenceNo, UniqueID, hasDraft) {
        this.objRiskAssessmentDTO.SequenceNo = SequenceNo;
        this.objRiskAssessmentDTO.UniqueID = UniqueID;
        if (!hasDraft)
            this.apiService.delete(this.controllerName, this.objRiskAssessmentDTO).then(data => this.Respone(data));
        else {
            this.objSaveDraftInfoDTO.SequenceNo = SequenceNo;
            this.apiService.post("SaveAsDraftInfo", "Delete", this.objSaveDraftInfoDTO).then(data => {
                this.Respone(data);
            });
        }
    }
    Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindRiskAssessment();
        }
    }
};
RiskAssessmentList = __decorate([
    Component({
        selector: 'RiskAssessmentList',
        templateUrl: './riskassessmentlist.component.template.html',
    }),
    __metadata("design:paramtypes", [APICallService, PagesComponent,
        Router, ActivatedRoute])
], RiskAssessmentList);
export { RiskAssessmentList };
//# sourceMappingURL=riskassessmentlist.component.js.map
