import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { CarerFireEscapePlanDTO } from './DTO/carerfireescapeplandto';
import { FormNotificationDTO } from '../systemadmin/DTO/formnotificationdto';
import { environment } from '../../../environments/environment';
//deepCopy, Compare
declare var window: any;
declare var $: any;


@Component({
    selector: 'CarerFireEscapePlanData',
    templateUrl: './carerfireescapeplandata.component.template.html',

})

export class CarerFireEscapePlanDataComponent {
    controllerName = "CarerFireEscapePlan";
    objCarerFireEscapePlanDTO: CarerFireEscapePlanDTO = new CarerFireEscapePlanDTO();
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
    AgencyProfileId;
    FireEscapePlanActive = "active";
    DocumentActive;
    isLoading: boolean = false;
     //Print
     insCarerDetails;
     CarerCode;
     apiURL = environment.api_url + "/api/GeneratePDF/";
     @ViewChild('btnPrint') infoPrint: ElementRef;
     @ViewChild('btnCancel') infoCancel: ElementRef;
     subject; eAddress; submittedprint = false; _FormPrint: FormGroup;
     objNotificationDTO: FormNotificationDTO = new FormNotificationDTO();
     SocialWorkerId;
    constructor(private _formBuilder: FormBuilder,
        private route: ActivatedRoute, private _router: Router, private module: PagesComponent,  private renderer: Renderer2, private apiService: APICallService) {

        this.route.params.subscribe(data => this.objQeryVal = data);
        this.AgencyProfileId = Common.GetSession("AgencyProfileId");
        if (this.objQeryVal.mid == 3) {
            this.FormCnfgId = 282;
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            this.SocialWorkerId = Common.GetSession("ACarerSSWId");
            if (Common.GetSession("SelectedCarerProfile") != null) {
                this.insCarerDetails = JSON.parse(Common.GetSession("SelectedCarerProfile"));
                this.CarerCode = this.insCarerDetails.CarerCode;
            }
        }
        else if (this.objQeryVal.mid == 13) {
            this.FormCnfgId = 282;
            this.CarerParentId = parseInt(Common.GetSession("CarerParentId"));
            this.SocialWorkerId = Common.GetSession("CarerSSWId");
            if (Common.GetSession("SelectedApplicantProfile") != null) {
                this.insCarerDetails = JSON.parse(Common.GetSession("SelectedApplicantProfile"));
                this.CarerCode = this.insCarerDetails.CarerCode;
            }
        }

        this.objCarerFireEscapePlanDTO.CarerParentId = this.CarerParentId;
        this.SequenceNo = this.objQeryVal.Id;

        //Doc
        this.formId = 282;
        this.TypeId = this.CarerParentId;
        this.tblPrimaryKey = this.SequenceNo;

        if (this.SequenceNo != 0 && this.SequenceNo != null) {
            this.objCarerFireEscapePlanDTO.SequenceNo = this.SequenceNo;
        } else {
            this.objCarerFireEscapePlanDTO.SequenceNo = 0;
        }
        this.apiService.post(this.controllerName, "GetDynamicControls", this.objCarerFireEscapePlanDTO).then(data => {
            this.dynamicformcontrol = data;
        });

        this._Form = _formBuilder.group({});
        this._FormPrint = _formBuilder.group({
            subject: ['', Validators.required],
            eAddress: ['', Validators.required],
            signature: ['']
        });
    }

    fnFireEscapePlan() {
        this.FireEscapePlanActive = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetail() {
        this.FireEscapePlanActive = "";
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
            this.FireEscapePlanActive = "active";
            this.DocumentActive = "";
            this.module.GetErrorFocus(subformbuilder);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.FireEscapePlanActive = "";
            this.DocumentActive = "active";
            this.module.GetErrorFocus(uploadFormBuilder);
        }

        if (subformbuilder.valid && this.DocOk) {
            this.isLoading = true;
            let type = "save";
            if (this.SequenceNo > 0)
                type = "update";
            if((this.SequenceNo == 0) || (this.SequenceNo != 0 && Common.GetSession("SaveAsDraft") == "Y") ){
            let val2 = dynamicForm.filter(x => x.FieldName == "SocialWorkerId");
            if (val2.length > 0 && (val2[0].FieldValue == null || val2[0].FieldValue == ''))
            {
                val2[0].FieldValue = this.SocialWorkerId;
            }
        }
            this.objCarerFireEscapePlanDTO.NotificationEmailIds = EmailIds;
            this.objCarerFireEscapePlanDTO.NotificationAddtionalEmailIds = AddtionalEmailIds;
            this.objCarerFireEscapePlanDTO.DynamicValue = dynamicForm;
            this.objCarerFireEscapePlanDTO.CarerParentId = this.CarerParentId;
            this.apiService.save(this.controllerName, this.objCarerFireEscapePlanDTO, type).then(data => this.Respone(data, type, IsUpload));

        }
    }

    private Respone(data, type, IsUpload) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (type == "save") {
                this.module.alertSuccess(Common.GetSaveSuccessfullMsg);
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(data.SequenceNumber);
                }
            }
            else {
                this.module.alertSuccess(Common.GetUpdateSuccessfullMsg);
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.SequenceNo);
                }
            }
            this._router.navigate(['/pages/fostercarer/fireescapeplanlist/' + this.objQeryVal.mid]);
        }
    }


    fnDonloadPDF() {
        window.location.href = this.apiURL + "GenerateCarerFireEscapePlanPDF/" + this.CarerCode + "," + this.CarerParentId + "," + this.SequenceNo + "," + this.AgencyProfileId;
    }
    fnDonloadWord() {
        window.location.href = this.apiURL + "GenerateCarerFireEscapePlanWord/" + this.CarerCode + "," + this.CarerParentId + "," + this.SequenceNo + "," + this.AgencyProfileId;
    }
    fnPrint() {
        this.apiService.get("GeneratePDF", "GenerateCarerFireEscapePlanPrint", this.CarerCode + "," + this.CarerParentId + "," + this.SequenceNo + "," + this.AgencyProfileId).then(data => {
            var popupWin;
            // var style = ""; var link = "";
            // var i;
            // for (i = 0; i < $("style").length; i++) {
            //     style = style + $("style")[i].outerHTML;
            // }
            // var j;
            // for (j = 0; j < $("link").length; j++) {
            //     link = link + $("link")[j].outerHTML;
            // }
            popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
            popupWin.document.open();
            popupWin.document.write(`
      <html>
        <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <title>Print tab</title>

        <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
    <body onload="window.print();window.close()">${data}</body>
      </html>`);
            popupWin.document.close();
        });
    }
    fnShowEmail() {
        this.subject = "";
        this.eAddress = "";
        this.submittedprint = false;
        let event = new MouseEvent('click', { bubbles: true });
        this.infoPrint.nativeElement.dispatchEvent(event);
    }
    fnEmail(form) {
        this.submittedprint = true;
        if (form.valid) {
            this.isLoading = true;
            this.objNotificationDTO.UserIds = this.eAddress;
            this.objNotificationDTO.Subject = this.subject;
            this.objNotificationDTO.Body = this.CarerCode + "," + this.CarerParentId + "," + this.SequenceNo + "," + this.AgencyProfileId;
            this.apiService.post("GeneratePDF", "EmailCarerFireEscapePlan", this.objNotificationDTO).then(data => {
                if (data == true)
                    this.module.alertSuccess("Email Send Successfully..");
                else
                    this.module.alertDanger("Email not Send Successfully..");
                this.fnCancelClick();
                this.isLoading = false;
            });

        }
    }
    fnCancelClick() {
        let event = new MouseEvent('click', { bubbles: true });
        this.infoCancel.nativeElement.dispatchEvent(event);
    }
}
