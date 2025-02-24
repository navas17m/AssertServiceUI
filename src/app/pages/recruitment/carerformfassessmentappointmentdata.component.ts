import { Component, Pipe, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { CarerFormFAssessmentAppointmentDTO } from './DTO/carerformfassessmentappointmentdto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component({
    selector: 'assessmentappointmentdata',
    templateUrl: './carerformfassessmentappointmentdata.component.template.html',

})

export class CarerFormFAssessmentAppointmentDataComponent {
    controllerName = "CarerFormFAssessmentAppointment";
    objCarerFormFAssessmentAppointmentDTO: CarerFormFAssessmentAppointmentDTO = new CarerFormFAssessmentAppointmentDTO();
    submitted = false;
    dynamicformcontrol = [];
    _Form: FormGroup;
    isVisibleMandatortMsg;
    SequenceNo;
    objQeryVal;
    //Doc
    FormCnfgId;
    formId;
    tblPrimaryKey;
    TypeId;
    submittedUpload = false;
    @ViewChild('uploads') uploadCtrl;
    CarerParentId: number;

    FormFAssessmentActive = "active";
    DocumentActive;
    isLoading: boolean = false;SocialWorkerId;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    constructor(private _formBuilder: FormBuilder,
        private route: ActivatedRoute, private _router: Router, private module: PagesComponent, private apiService: APICallService) {

        this.route.params.subscribe(data => this.objQeryVal = data);

        if (this.objQeryVal.mid == 36) {
            this.FormCnfgId = 68;
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            this.SocialWorkerId = Common.GetSession("ACarerSSWId");
        }
        else if (this.objQeryVal.mid == 37) {
            this.FormCnfgId = 40;
            this.CarerParentId = parseInt(Common.GetSession("CarerParentId"));
            this.SocialWorkerId = Common.GetSession("CarerSSWId");
        }

        this.objCarerFormFAssessmentAppointmentDTO.CarerParentId = this.CarerParentId;
        this.SequenceNo = this.objQeryVal.Id;

        //Doc
        this.formId = 40;
        this.TypeId = this.CarerParentId;
        this.tblPrimaryKey = this.SequenceNo;

        if (this.SequenceNo != 0 && this.SequenceNo != null) {
            this.objCarerFormFAssessmentAppointmentDTO.SequenceNo = this.SequenceNo;
        } else {
            this.objCarerFormFAssessmentAppointmentDTO.SequenceNo = 0;
        }

        //cfaaServics.getByFormCnfgId(this.objCarerFormFAssessmentAppointmentDTO).then(data => {
        //    this.dynamicformcontrol = data;
        //});

        this.apiService.post(this.controllerName, "GetDynamicControls", this.objCarerFormFAssessmentAppointmentDTO).then(data => {
            this.dynamicformcontrol = data;
        });

        this._Form = _formBuilder.group({});
        if(Common.GetSession("ViweDisable")=='1'){
          this.objUserAuditDetailDTO.ActionId = 4;
          this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
          this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
          this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
          this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
          this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
          this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
          Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
          }
    }

    fnFormFAssessment() {
        this.FormFAssessmentActive = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetail() {
        this.FormFAssessmentActive = "";
        this.DocumentActive = "active";
    }

    DocOk = true;
    clicksubmit(dynamicForm, subformbuilder, UploadDocIds, IsUpload, uploadFormBuilder, AddtionalEmailIds, EmailIds) {
        this.submitted = true;
        this.DocOk = true;
        if (IsUpload) {
            this.submittedUpload = true;
            if (uploadFormBuilder.valid) {
                this.DocOk = true;
            }
            else
                this.DocOk = false;
        }

        if (!subformbuilder.valid) {
            this.FormFAssessmentActive = "active";
            this.DocumentActive = "";
            this.module.GetErrorFocus(subformbuilder);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.FormFAssessmentActive = "";
            this.DocumentActive = "active";
            this.module.GetErrorFocus(uploadFormBuilder);
        }

        if (subformbuilder.valid && this.DocOk) {
            this.isLoading = true;
            let type = "save";
            if (this.SequenceNo > 0)
                type = "update";
            let val2 = dynamicForm.filter(x => x.FieldName == "SocialWorkerId");
            if (val2.length > 0 && (val2[0].FieldValue == null || val2[0].FieldValue == ''))
            {
                val2[0].FieldValue = this.SocialWorkerId;
            }
            this.objCarerFormFAssessmentAppointmentDTO.NotificationEmailIds = EmailIds;
            this.objCarerFormFAssessmentAppointmentDTO.NotificationAddtionalEmailIds = AddtionalEmailIds;
            this.objCarerFormFAssessmentAppointmentDTO.DynamicValue = dynamicForm;
            this.objCarerFormFAssessmentAppointmentDTO.CarerParentId = this.CarerParentId;
            //  this.cfaaServics.post(this.objCarerFormFAssessmentAppointmentDTO, type).then(data => this.Respone(data, type, IsUpload));
            this.apiService.save(this.controllerName, this.objCarerFormFAssessmentAppointmentDTO, type).then(data => this.Respone(data, type, IsUpload));

        }
    }

    private Respone(data, type, IsUpload) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (type == "save") {
              this.objUserAuditDetailDTO.ActionId =1;
              this.objUserAuditDetailDTO.RecordNo = data.SequenceNumber;
                this.module.alertSuccess(Common.GetSaveSuccessfullMsg);
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(data.SequenceNumber);
                }
            }
            else {
              this.objUserAuditDetailDTO.ActionId =2;
              this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
                this.module.alertSuccess(Common.GetUpdateSuccessfullMsg);
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.SequenceNo);
                }
            }
            this._router.navigate(['/pages/recruitment/assessmentappointmentlist/' + this.objQeryVal.mid]);
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
}
