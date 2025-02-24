import { Component, Pipe, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Common, deepCopy, Compare, ConvertDateAndDateTimeSaveFormat}  from  '../common'
import { ChildCLAReview} from './DTO/childclareview'
import { PagesComponent } from '../pages.component';
import { ValChangeDTO} from '../dynamic/ValChangeDTO';
import { APICallService } from '../services/apicallservice.service';
import { environment } from '../../../environments/environment';
import { FormNotificationDTO } from '../systemadmin/DTO/formnotificationdto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
declare var window: any;
declare var $: any;

//.@Pipe({ name: 'groupBy' })
@Component({
    selector: 'childclareviewdata',
    templateUrl: './childclareviewdata.component.template.html',
})

export class ChildCLAReviewDataComponent{
    @ViewChild('btnPrint') infoPrint: ElementRef;
    @ViewChild('btnCancel') infoCancel: ElementRef;
    subject; eAddress; submittedprint = false; _FormPrint: FormGroup;
    objNotificationDTO: FormNotificationDTO = new FormNotificationDTO();
    apiURL = environment.api_url + "/api/GeneratePDF/";
    objChildCLAReview: ChildCLAReview = new ChildCLAReview();
    submitted = false; submittedUpload = false;
    dynamicformcontrol = [];
    dynamicformcontrolOrginal = [];
    _Form: FormGroup;
    isVisibleMandatortMsg;
    SequenceNo;
    objQeryVal;
    formId; tblPrimaryKey;
    @ViewChild('uploads') uploadCtrl;
    TypeId;
    ChildID: number;
    AgencyProfileId: number;

    CLAReviewTabActive = "active";
    DocumentActive;
    isLoading: boolean = false;
    controllerName = "ChildCLAReview";
    SocialWorkerId;
    LASocialWorkerId;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=82;
    constructor(private apiService: APICallService, private _formBuilder: FormBuilder,
        private route: ActivatedRoute, private _router: Router, private modal: PagesComponent, private renderer: Renderer2) {
        if (Common.GetSession("ChildId") != null)
            this.ChildID = parseInt(Common.GetSession("ChildId"));
        this.route.params.subscribe(data => this.objQeryVal = data);
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.SocialWorkerId = Common.GetSession("SSWId");
        this.LASocialWorkerId = Common.GetSession("ChildLASocialWorkerId");
        this.objChildCLAReview.AgencyProfileId = this.AgencyProfileId;
        this.objChildCLAReview.ChildId = this.ChildID;
        this.SequenceNo = this.objQeryVal.Id;
        if (this.SequenceNo != 0 && this.SequenceNo != null) {
            this.tblPrimaryKey = this.SequenceNo;
            this.objChildCLAReview.SequenceNo = this.SequenceNo;
        } else {
            this.objChildCLAReview.SequenceNo = 0;
        }

        apiService.post(this.controllerName, "GetDynamicControls", this.objChildCLAReview).then(data => {
            this.dynamicformcontrol = data;
            console.log(this.dynamicformcontrol);
            this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
        });
        //Doc
        this.formId = 82;
        this.TypeId = this.ChildID;
        this.tblPrimaryKey = this.SequenceNo;

        this._Form = _formBuilder.group({});
        this._FormPrint = _formBuilder.group({
            subject: ['', Validators.required],
            eAddress: ['', Validators.required],
            signature: ['']
        });

        if(Common.GetSession("ViweDisable")=='1'){
            this.objUserAuditDetailDTO.ActionId = 4;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
            }
    }

    fnBack()
    {
        this._router.navigate(['/pages/child/childclareviewlist/4/'+this.objQeryVal.apage]);
    }

    fnCLAReviewTab() {
        this.CLAReviewTabActive = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetailTab() {
        this.CLAReviewTabActive = "";
        this.DocumentActive = "active";
    }
    isDirty = true;
    DocOk = true;
    clicksubmit(mainFormBuilder, dynamicForm, subformbuilder, UploadDocIds, IsUpload, uploadFormBuilder, AddtionalEmailIds, EmailIds) {
        this.submitted = true;
        this.DocOk = true;
        console.log(mainFormBuilder);
        console.log(subformbuilder);
        if (IsUpload) {
            this.submittedUpload = true;
            if (uploadFormBuilder.valid) {
                this.DocOk = true;
            }
            else
                this.DocOk = false;
        }

        if (!mainFormBuilder.valid) {
            this.CLAReviewTabActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(mainFormBuilder);
        } else if (!subformbuilder.valid) {
            this.CLAReviewTabActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(subformbuilder);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.CLAReviewTabActive = "";
            this.DocumentActive = "active";
            this.modal.GetErrorFocus(uploadFormBuilder);
        }
        else {
            this.CLAReviewTabActive = "active";
            this.DocumentActive = "";
        }

        if (mainFormBuilder.valid && subformbuilder.valid && dynamicForm != '' && this.DocOk) {

            this.isDirty = true;
            if (this.SequenceNo != 0 && Compare(dynamicForm, this.dynamicformcontrolOrginal)) {
                this.isDirty = false;
            }
            if (this.isDirty || (IsUpload && uploadFormBuilder.valid)) {
                this.isLoading = true;
                let type = "save";
                if (this.SequenceNo > 0)
                    type = "update";
                if(this.SequenceNo == 0){
                  let val = dynamicForm.filter(x => x.FieldName == "SocialWorkerId");
                  if (val.length > 0 && (val[0].FieldValue == null || val[0].FieldValue == ''))
                  val[0].FieldValue = this.SocialWorkerId;

                  let valLASW = dynamicForm.filter(x => x.FieldName == "LASocialWorkerId");
                  if (valLASW.length > 0 && (valLASW[0].FieldValue == null || valLASW[0].FieldValue == ''))
                  valLASW[0].FieldValue = this.LASocialWorkerId;

                }
                this.objChildCLAReview.NotificationEmailIds = EmailIds;
                this.objChildCLAReview.NotificationAddtionalEmailIds = AddtionalEmailIds;
                this.objChildCLAReview.DynamicValue = dynamicForm;
                this.objChildCLAReview.ChildId = this.ChildID;
                this.apiService.save(this.controllerName, this.objChildCLAReview, type).then(data => this.Respone(data, type, IsUpload));
            }
            else {
                this.modal.alertWarning(Common.GetNoChangeAlert);
            }
        }
    }

    private Respone(data, type, IsUpload) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (type == "save") {
                this.objUserAuditDetailDTO.ActionId =1;
                this.objUserAuditDetailDTO.RecordNo = data.SequenceNumber;
                if (IsUpload) {
                    this.uploadCtrl.fnUploadChildSiblingNParent(data.lstChildSiblingNParent);
                }
                this.modal.alertSuccess(Common.GetSaveSuccessfullMsg);
            }
            else {
                this.objUserAuditDetailDTO.ActionId =2;
                this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
                if (IsUpload) {
                    this.uploadCtrl.fnUploadChildSiblingNParent(data.lstChildSiblingNParent);
                }
                this.modal.alertSuccess(Common.GetUpdateSuccessfullMsg);
            }

            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.formId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
            this._router.navigate(['/pages/child/childclareviewlist/4/'+this.objQeryVal.apage]);
        }
    }

    DynamicOnValChange(InsValChange: ValChangeDTO) {
        if (InsValChange.currnet.FieldCnfg.FieldName == "SiblingParentSno") {
            InsValChange.currnet.IsVisible = false;
        }
        if (InsValChange.currnet.FieldCnfg.FieldName == "SocialWorkerId") {
          InsValChange.currnet.IsVisible = false;
        }
        if (InsValChange.currnet.FieldCnfg.FieldName == "LASocialWorkerId") {
          InsValChange.currnet.IsVisible = false;
        }
        if (this.SequenceNo != 0 && this.SequenceNo != null) {
           if (InsValChange.currnet.FieldCnfg.FieldName == "AddtoSiblingsRecord"
               || InsValChange.currnet.FieldCnfg.FieldName == "AddtoParent/ChildRecord") {
               InsValChange.currnet.IsVisible = false;
           }
        }
        if(Common.GetSession("HasChildSiblings")=='false')
        {
            if (InsValChange.currnet.FieldCnfg.FieldName == "AddtoSiblingsRecord")
                InsValChange.currnet.IsVisible = false;
        }
        if(Common.GetSession("HasChildParents")=='false')
        {
            if (InsValChange.currnet.FieldCnfg.FieldName == "AddtoParent/ChildRecord")
                InsValChange.currnet.IsVisible = false;
        }

        if (InsValChange.currnet.FieldCnfg.FieldName == "AddtoSiblingsRecord") {
            if (InsValChange.newValue == "1" || InsValChange.newValue == true)
             {
              InsValChange.all.forEach(item => {
                  if (item.FieldCnfg.FieldName == "SelectSiblings")
                      item.IsVisible = true;
              });
            }
          else {
              InsValChange.all.forEach(item => {
                  if (item.FieldCnfg.FieldName == "SelectSiblings")
                      item.IsVisible = false;
              });
          }
      }

    }
    fnDonloadPDF() {
        window.location.href = this.apiURL + "GenerateCLAReviewPDF/" + this.ChildID + "," + this.SequenceNo + "," + this.AgencyProfileId;
    }
    fnDonloadWord() {
        window.location.href = this.apiURL + "GenerateCLAReviewWord/" + this.ChildID + "," + this.SequenceNo + "," + this.AgencyProfileId;
    }
    fnPrint() {
        this.apiService.get("GeneratePDF", "GenerateCLAReviewPrint", this.ChildID + "," + this.SequenceNo + "," + this.AgencyProfileId).then(data => {
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
            this.objNotificationDTO.Body = this.ChildID + "," + this.SequenceNo + "," + this.AgencyProfileId;
            this.apiService.post("GeneratePDF", "EmailCLAReview", this.objNotificationDTO).then(data => {
                if (data == true)
                    this.modal.alertSuccess("Email Send Successfully..");
                else
                    this.modal.alertDanger("Email not Send Successfully..");
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
