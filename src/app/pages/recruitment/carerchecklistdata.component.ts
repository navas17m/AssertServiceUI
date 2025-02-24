import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { CarerCheckList, CarerStatusChange } from './DTO/carerstatuscnfg';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component({
    selector: 'CarerCheckListData',
    templateUrl: './carerchecklistdata.component.template.html',
})

export class CarerCheckListDataComponet {

    controllerName = "CarerStatusChange";
    CarerParentId;
    objQeryVal;
    stageChangeInfo;
    FormCnfgId;
    _Form: FormGroup;
    isLoading = false; submitted = false;
    objCarerStatusChange: CarerStatusChange = new CarerStatusChange();
    insCarerDetails;
    CarerStatusId;
    //Doc
    formId;
    tblPrimaryKey;
    TypeId;
    submittedUpload = false;
    @ViewChild('uploads') uploadCtrl;
    //  //
    Stage1TabHidden = true;
    Stage2TabHiddden = true;
    //
    objCarerCheckList: CarerCheckList = new CarerCheckList();
    InterestedCheckList = [];
    Stage1CheckList = [];
    Stage2CheckList = [];
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    constructor(private module: PagesComponent, private _formBuilder: FormBuilder, private activatedroute: ActivatedRoute,
        private _router: Router,
        private apiService: APICallService) {
        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        if (this.objQeryVal.mid == 3) {
            this.FormCnfgId = 190;
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            this.BindCheckListDetail();
            this.TypeId = this.CarerParentId;
            this.tblPrimaryKey = this.CarerParentId;
            if (Common.GetSession("SelectedCarerProfile") != null) {
                this.insCarerDetails = JSON.parse(Common.GetSession("SelectedCarerProfile"));
                this.CarerStatusId = this.insCarerDetails.CarerStatusId;
            }
        }
        else if (this.objQeryVal.mid == 13) {
            this.FormCnfgId = 189;
            this.CarerParentId = parseInt(Common.GetSession("CarerParentId"));
            this.BindCheckListDetail();
            this.TypeId = this.CarerParentId;
            this.tblPrimaryKey = this.CarerParentId;
            if (Common.GetSession("SelectedApplicantProfile") != null) {
                this.insCarerDetails = JSON.parse(Common.GetSession("SelectedApplicantProfile"));
                this.CarerStatusId = this.insCarerDetails.CarerStatusId;
            }

        }
        this._Form = _formBuilder.group({});
        //Doc
        this.formId = 36;

    }

    BindCheckListDetail() {
        if (this.CarerParentId != 0 && this.CarerParentId != null) {
            this.objCarerCheckList.CarerParentId = this.CarerParentId;
            this.objCarerCheckList.ControlLoadFormat = ['Interested', 'Stage1', 'Stage2'];
            this.apiService.post(this.controllerName, "GetDynamicControls", this.objCarerCheckList).then(data => {
                this.InterestedCheckList = data.filter(item => item.ControlLoadFormat == "Interested");
                this.Stage1CheckList = data.filter(item => item.ControlLoadFormat == "Stage1");
                this.Stage2CheckList = data.filter(item => item.ControlLoadFormat == "Stage2");
            //    console.log(this.InterestedCheckList);
                //let statge1Tem = this.Stage1CheckList.filter(x => x.IsMandatory == true && x.FieldValue != null && x.FieldValue != "");
                //if (statge1Tem.length > 0) {
                //    this.Stage1TabHidden = false;
                //}
                //   alert(this.CarerStatusId);
                if (this.CarerStatusId == 3 || this.CarerStatusId == 11 || this.CarerStatusId == 12 || this.CarerStatusId == 13) {
                    this.Stage1TabHidden = false;
                }

                //let statge2Tem = this.Stage2CheckList.filter(x => x.IsMandatory == true && x.FieldValue != null && x.FieldValue != "");
                //if (statge2Tem.length > 0) {
                //    this.Stage2TabHiddden = false;
                //}

                if (this.CarerStatusId == 4 || this.CarerStatusId == 14
                    || this.CarerStatusId == 15 || this.CarerStatusId == 16) {
                    this.Stage1TabHidden = false;
                    this.Stage2TabHiddden = false;
                }
                // console.log(data);
                // console.log(this.Stage1CheckList);

            });
        }
    }

    fnBack() {
        if (this.objQeryVal.mid == 3) {
            this._router.navigate(['/pages/fostercarer/carerchecklist/3']);
        }
        else if (this.objQeryVal.mid == 13) {
            this._router.navigate(['/pages/recruitment/carerchecklist/13']);
        }
    }
    fnInterTab() {
        this.InterTabActive = "active";
        this.Stage1TabActive = "";
        this.Stage2TabActive = "";
        this.DocumentActive = "";
    }

    fnStatge1Tab() {
        this.InterTabActive = "";
        this.Stage1TabActive = "active";
        this.Stage2TabActive = "";
        this.DocumentActive = "";
    }

    fnStatge2tab() {
        this.InterTabActive = "";
        this.Stage1TabActive = "";
        this.Stage2TabActive = "active";
        this.DocumentActive = "";
    }

    fnUploadDocTab() {
        this.InterTabActive = "";
        this.Stage1TabActive = "";
        this.Stage2TabActive = "";
        this.DocumentActive = "active";
    }


    InterTabActive = "active";
    Stage1TabActive = "";
    Stage2TabActive = "";
    DocumentActive = "";


    DocOk = true;
    IsOk = true;
    clicksubmitdata(dynamicValInter, dynamicFormInter, dynamicValStatge1, dynamicFormStatge1, dynamicValStatge2, dynamicFormStatge2, UploadDocIds, IsUpload, uploadFormBuilder) {
        this.submitted = true;
        this.DocOk = true;
        this.IsOk = true;
        if (IsUpload) {
            this.submittedUpload = true;
            if (uploadFormBuilder.valid) {
                this.DocOk = true;
            }
            else
                this.DocOk = false;
        }

        if (!dynamicFormInter.valid) {
            this.InterTabActive = "active";
            this.Stage1TabActive = "";
            this.Stage2TabActive = "";
            this.DocumentActive = "";
            this.module.GetErrorFocus(dynamicFormInter);
        } else if (!dynamicFormStatge1.valid && this.Stage1TabHidden == false) {
            this.InterTabActive = "";
            this.Stage1TabActive = "active";
            this.Stage2TabActive = "";
            this.DocumentActive = "";
            this.module.GetErrorFocus(dynamicFormStatge1);
            this.IsOk = false;
        } else if (!dynamicFormStatge2.valid && this.Stage2TabHiddden == false) {
            this.InterTabActive = "";
            this.Stage1TabActive = "";
            this.Stage2TabActive = "active";
            this.DocumentActive = "";
            this.module.GetErrorFocus(dynamicFormStatge2);
            this.IsOk = false;
        }
        //else if (IsUpload && !uploadFormBuilder.valid) {
        //    this.InterTabActive = "";
        //    this.Stage1TabActive = "";
        //    this.Stage2TabActive = "";
        //    this.DocumentActive = "active";
        //    this.module.GetErrorFocus(uploadFormBuilder);
        //}

        if (this.IsOk && dynamicFormInter.valid  && this.DocOk) {
            this.isLoading = true;
            let type = "save";

            //onsole.log(dynamicValInter);
           // console.log(dynamicValStatge1);
           // /*console*/.log(dynamicValStatge2);

            if (this.Stage1TabHidden == false) {
                dynamicValStatge1.forEach(item => {
                    dynamicValInter.push(item);
                });
            }

            if (this.Stage2TabHiddden == false) {

                dynamicValStatge1.forEach(item => {
                    dynamicValInter.push(item);
                });
                dynamicValStatge2.forEach(item => {
                    dynamicValInter.push(item);
                });
            }
            this.objCarerStatusChange.CarerParentId = this.CarerParentId;
            this.objCarerStatusChange.DynamicValue = dynamicValInter;

            this.apiService.post(this.controllerName, "UpdateCheckListInfo", this.objCarerStatusChange).then(data => this.Respone(data, type, IsUpload));
        }
    }

    private Respone(data, type, IsUpload) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (IsUpload) {
                this.uploadCtrl.fnUploadAll(this.CarerParentId);
            }
            this.module.alertSuccess(Common.GetUpdateSuccessfullMsg);
            this.objUserAuditDetailDTO.ActionId =2;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
            if (this.objQeryVal.mid == 3) {
                this._router.navigate(['/pages/fostercarer/carerchecklist/3']);
            }
            else if (this.objQeryVal.mid == 13) {
                this._router.navigate(['/pages/recruitment/carerchecklist/13']);
            }


        }
    }
}
