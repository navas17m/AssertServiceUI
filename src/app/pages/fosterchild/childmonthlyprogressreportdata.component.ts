import { Component, Pipe, ViewChild,OnDestroy,ElementRef,Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Common,CompareSaveasDraft, deepCopy, Compare, ConvertDateAndDateTimeSaveFormat}  from  '../common'
import { PagesComponent } from '../pages.component'
import { ChildMonthlyProgressReportDTO } from './DTO/childmonthlyprogressreportdto'
import { ValChangeDTO} from '../dynamic/ValChangeDTO'
import { APICallService } from '../services/apicallservice.service';
import * as moment from 'moment';
import { FormNotificationDTO } from '../systemadmin/DTO/formnotificationdto';
import { environment } from '../../../environments/environment';
import { SaveDraftInfoDTO} from '../savedraft/DTO/savedraftinfodto';
import {SimpleTimer} from 'ng2-simple-timer';
import { UserAuditHistoryDetailDTO } from '../common';

declare var window: any;
declare var $: any;
@Component({
    selector: 'ChildMonthlyProgressReportData',
    templateUrl: './childmonthlyprogressreportdata.component.template.html',
})

export class ChildMonthlyProgressReportData {
    objChildMonthlyProgressReport: ChildMonthlyProgressReportDTO = new ChildMonthlyProgressReportDTO();
    submitted = false;
    dynamicformcontrol = []; dynamicformcontrolOrginal = [];
    objValChangeDTO: ValChangeDTO = new ValChangeDTO();
    AgencyProfileId: number;
    clamedicalList = [];
    dentalList = [];
    opticianList = [];

    lstClaMedical = [];
    lstDental = [];
    lstOptician = [];
    tableSource=[];

    clamedicalListVisible = false;
    dentalListVisible = false;
    opticianVisible = false;

    _Form: FormGroup;
    SequenceNo;
    objQeryVal;
    //Print
    insChildDetailsTemp;
    ChildCode;
    apiURL = environment.api_url + "/api/GeneratePDF/";
    @ViewChild('btnPrint') infoPrint: ElementRef;
    @ViewChild('btnCancel') infoCancel: ElementRef;
    subject; eAddress; submittedprint = false; _FormPrint: FormGroup;
    objNotificationDTO: FormNotificationDTO = new FormNotificationDTO();
    //Doc
    formId;
    tblPrimaryKey;
    TypeId;
    submittedUpload = false;
    @ViewChild('uploads') uploadCtrl;
    ChildID: number;

    Tab1Active = "active";
    Tab2Active;
    isLoading: boolean = false; controllerName = "ChildMonthlyProgressReport";
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    draftSavedTime;
    timer2Id: string;
    timer2button = 'Subscribe';
    @ViewChild('btnSaveDraft') btnSaveDraft: ElementRef;
    @ViewChild('btnSubmit') btnSubmit;
    skipAlert: boolean = true;
    saveDraftText = "Draft auto-saved @"; showAutoSave: boolean = false;
    showbtnSaveDraft: boolean = true; showAlert: boolean = false; isUploadDoc: boolean = false;
    footerMessage={
      'emptyMessage': `<div align=center><strong>No records found.</strong></div>`,
      'totalMessage': ' - Records'
    };
    saveAsDraftText=Common.GetSaveasDraftText;
    submitText=Common.GetSubmitText;
    isLoadingSAD: boolean = false;
    SocialWorkerId;
    LASocialWorkerId;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=171;
    constructor(private apiService: APICallService,private renderer:Renderer2, private _formBuilder: FormBuilder,
        private route: ActivatedRoute, private _router: Router, private pComponent: PagesComponent,
        private st: SimpleTimer) {
        this.route.params.subscribe(data => this.objQeryVal = data);
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.SocialWorkerId = Common.GetSession("SSWId");
        this.LASocialWorkerId = Common.GetSession("ChildLASocialWorkerId");
        this.SequenceNo = this.objQeryVal.Id;
        if (this.SequenceNo != 0 && this.SequenceNo != null) {
            this.objChildMonthlyProgressReport.SequenceNo = this.SequenceNo;
        } else {
            this.objChildMonthlyProgressReport.SequenceNo = 0;
        }
        this.ChildID = parseInt(Common.GetSession("ChildId"));
        if (Common.GetSession("SelectedChildProfile") != null) {
            this.insChildDetailsTemp = JSON.parse(Common.GetSession("SelectedChildProfile"));
            this.ChildCode = this.insChildDetailsTemp.ChildCode;
        }
        this._FormPrint = _formBuilder.group({
            subject: ['', Validators.required],
            eAddress: ['', Validators.required],
            signature: ['']
        });
        //Doc
        this.formId = 171;
        Common.SetSession("formcnfgid", this.formId);
        this.TypeId = this.ChildID;
        this.tblPrimaryKey = this.SequenceNo;
        this.objChildMonthlyProgressReport.ChildId = this.ChildID;
        this.objChildMonthlyProgressReport.ControlLoadFormat = ["Default", "CLAMedical", "Dental", "Optician"];

        if (this.SequenceNo != 0 && this.SequenceNo != null) {
            this.tblPrimaryKey = this.SequenceNo;
            this.objChildMonthlyProgressReport.SequenceNo = this.SequenceNo;
        } else {
        apiService.post(this.controllerName, "GetDynamicControls", this.objChildMonthlyProgressReport).then(data => {
            //   console.log(data);
            this.dynamicformcontrol = data.AgencyFieldMapping;
			this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
            // this.clamedicalList = data.CLAMedical;
            // this.dentalList = data.DentalCheck;
            //  this.opticianList = data.OpticianCheck;

            this.LoadStatutoryCheckInfo(data.CLAMedical, 'cla');
            this.LoadStatutoryCheckInfo(data.DentalCheck, 'dental');
            this.LoadStatutoryCheckInfo(data.OpticianCheck, 'opt');

			// console.log(data.CLAMedical);
            //  console.log(data.DentalCheck);
            //  console.log(data.OpticianCheck);

            });
        }
        this._Form = _formBuilder.group({});
        if (Common.GetSession("SaveAsDraft") == "N") {
            if (this.SequenceNo != 0)
                this.showbtnSaveDraft = false;
                apiService.post(this.controllerName, "GetDynamicControls", this.objChildMonthlyProgressReport).then(data => {
                this.dynamicformcontrol = data.AgencyFieldMapping;
                this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
                this.clamedicalList=[];
                this.dentalList=[];
                this.opticianList=[];
                this.LoadStatutoryCheckInfo(data.CLAMedical, 'cla');
                this.LoadStatutoryCheckInfo(data.DentalCheck, 'dental');
                this.LoadStatutoryCheckInfo(data.OpticianCheck, 'opt');
            });
        }
        else {
             //Get only Cla,dental,opt value
             apiService.post(this.controllerName, "GetDynamicControls", this.objChildMonthlyProgressReport).then(data => {
                this.clamedicalList=[];
                this.dentalList=[];
                this.opticianList=[];
                this.LoadStatutoryCheckInfo(data.CLAMedical, 'cla');
                this.LoadStatutoryCheckInfo(data.DentalCheck, 'dental');
                this.LoadStatutoryCheckInfo(data.OpticianCheck, 'opt');

                this.objSaveDraftInfoDTO.SequenceNo = this.SequenceNo;
                this.objSaveDraftInfoDTO.FormCnfgId = this.formId;
                this.objSaveDraftInfoDTO.TypeId = this.ChildID;
                this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
                this.apiService.post("SaveAsDraftInfo", "GetById", this.objSaveDraftInfoDTO).then(data => {
                    this.dynamicformcontrol = JSON.parse(data.JsonData);
                  //  console.log(this.dynamicformcontrol);
                    this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
                    let tempDoc = JSON.parse(data.JsonList);
                    if (tempDoc != null)
                        this.isUploadDoc = tempDoc[0].IsDocumentExist;

                });
            });
        }
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

    fnTab1() {
        this.Tab1Active = "active";
        this.Tab2Active = "";
    }
    fnTab2() {
        this.Tab1Active = "";
        this.Tab2Active = "active";
    }
    isDirty = true;
    DocOk = true;
    IsNewOrSubmited = 1;//New=1 and Submited=2
    clicksubmit(dynamicForm, dynamicformbuilder,
        dynamicFormCLA, dynamicformbuilderCLA,
        dynamicFormDental, dynamicformbuilderDental,
        dynamicFormOptician, dynamicformbuilderOptician,
        dynamicFormDefault2, dynamicformbuilderDefault2,
        UploadDocIds, IsUpload, uploadFormBuilder) {

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

        if (!dynamicformbuilder.valid) {
            this.Tab1Active = "active";
            this.Tab2Active = "";
            this.pComponent.GetErrorFocus(dynamicformbuilder);
        }
        else if (!dynamicformbuilderDefault2.valid) {
            this.Tab1Active = "active";
            this.Tab2Active = "";
            this.pComponent.GetErrorFocus(dynamicformbuilderDefault2);
        }
        else if (IsUpload && !uploadFormBuilder.valid) {
            this.Tab1Active = "";
            this.Tab2Active = "active";
            this.pComponent.GetErrorFocus(uploadFormBuilder);
        }
        else {
            this.Tab1Active = "active";
            this.Tab2Active = "";
        }

            dynamicFormCLA.forEach(item => {
                dynamicForm.push(item);
            });

            dynamicFormDental.forEach(item => {
                dynamicForm.push(item);
            });

            dynamicFormOptician.forEach(item => {
                dynamicForm.push(item);
            });
            dynamicFormDefault2.forEach(item => {
                dynamicForm.push(item);
            });

            if (dynamicformbuilder.valid && dynamicformbuilderDefault2.valid && this.DocOk) {

            this.isDirty = true;
            if (this.SequenceNo != 0 && Compare(dynamicForm, this.dynamicformcontrolOrginal)) {

                this.isDirty = false;
            }

            if (this.isDirty || (IsUpload && uploadFormBuilder.valid)) {

                let val1 = dynamicForm.filter(x => x.FieldName == "CLAMedicalId");
                if (val1.length > 0)
                    val1[0].FieldValue = this.objChildMonthlyProgressReport.claSequenceNo;

                let val2 = dynamicForm.filter(x => x.FieldName == "DentalCheckId");
                if (val2.length > 0)
                    val2[0].FieldValue = this.objChildMonthlyProgressReport.dentalSequenceNo;

                let val3 = dynamicForm.filter(x => x.FieldName == "OpticianCheckId");
                if (val3.length > 0)
                    val3[0].FieldValue = this.objChildMonthlyProgressReport.opticianSequenceNo;
               if((this.SequenceNo == 0) || (this.SequenceNo != 0 && Common.GetSession("SaveAsDraft") == "Y"))
                {
                let val = dynamicForm.filter(x => x.FieldName == "SocialWorkerId");
                if (val.length > 0 && (val[0].FieldValue == null || val[0].FieldValue == ''))
                  val[0].FieldValue = this.SocialWorkerId;

                let valLASW = dynamicForm.filter(x => x.FieldName == "LASocialWorkerId");
                if (valLASW.length > 0 && (valLASW[0].FieldValue == null || valLASW[0].FieldValue == ''))
                  valLASW[0].FieldValue = this.LASocialWorkerId;
                }
                this.isLoading = true;
                let type = "save";
                if (this.SequenceNo > 0  && Common.GetSession("SaveAsDraft") == "N")
                    type = "update";
                this.objChildMonthlyProgressReport.DynamicValue = dynamicForm;
                this.objChildMonthlyProgressReport.ChildId = this.ChildID;
                this.apiService.save(this.controllerName, this.objChildMonthlyProgressReport, type).then(data => this.Respone(data, type, IsUpload,this.skipAlert));
            }
            else {
                this.submitText=Common.GetSubmitText;
                this.showAutoSave = false;
                if (this.skipAlert && this.IsNewOrSubmited == 1)
                    this.pComponent.alertWarning(Common.GetNoChangeAlert);
                else if (this.skipAlert && this.IsNewOrSubmited == 2)
                    this.pComponent.alertSuccess(Common.GetRecordAlreadySavedfullMsg);
                this.skipAlert = true;
            }


        }
    }

    private Respone(data, type, IsUpload, skipAlert: boolean) {

        if (data.IsError == true) {
            this.isLoading = false;
            this.pComponent.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
            this.dynamicformcontrolOrginal = ConvertDateAndDateTimeSaveFormat(this.dynamicformcontrolOrginal);
            if (type == "save") {
                this.objUserAuditDetailDTO.ActionId =1;
                this.objUserAuditDetailDTO.RecordNo = data.SequenceNumber;
                if (skipAlert)
                    this.pComponent.alertSuccess(Common.GetSaveSuccessfullMsg);
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(data.SequenceNumber);
                }
            }
            else {
                this.isLoading = false;
                this.submitText=Common.GetSubmitText;
                this.objUserAuditDetailDTO.ActionId =2;
                this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
                if (skipAlert)
                    this.pComponent.alertSuccess(Common.GetUpdateSuccessfullMsg);
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.SequenceNo);
                }
            }

            if (skipAlert)
            {
                this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
                this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
                this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
                this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
                Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
                this._router.navigate(['/pages/child/childmonthlyprogressreportlist/4']);
            }                
        }
    }


    fnSaveDraft(dynamicForm,dynamicForm2,dynamicForm3,dynamicForm4,dynamicForm5, IsUpload, uploadFormBuilder) {

        //  console.log(1);
          dynamicForm2.forEach(item => {
              dynamicForm.push(item);
          });
         // console.log(2);
          dynamicForm3.forEach(item => {
              dynamicForm.push(item);
          });
          dynamicForm4.forEach(item => {
              dynamicForm.push(item);
          });
          dynamicForm5.forEach(item => {
              dynamicForm.push(item);
          });

          let val1 = this.dynamicformcontrol.filter(x => x.FieldCnfg.FieldName == "CLAMedicalId");
          if (val1.length > 0)
          {
             // console.log('11111=> '+this.objChildMonthlyProgressReport.claSequenceNo);
              val1[0].FieldValue = JSON.stringify(this.objChildMonthlyProgressReport.claSequenceNo);
             // console.log('22=> '+val1[0].FieldValue);
          }
         // console.log(this.dynamicformcontrol.filter(x => x.FieldCnfg.FieldName == "CLAMedicalId"));

          let val2 = this.dynamicformcontrol.filter(x => x.FieldCnfg.FieldName == "DentalCheckId");
          if (val2.length > 0)
              val2[0].FieldValue = this.objChildMonthlyProgressReport.dentalSequenceNo;

          let val3 = this.dynamicformcontrol.filter(x => x.FieldCnfg.FieldName == "OpticianCheckId");
          if (val3.length > 0)
              val3[0].FieldValue = this.objChildMonthlyProgressReport.opticianSequenceNo;

         // console.log(3);
          this.submitted = false;
          let userId: number = parseInt(Common.GetSession("UserProfileId"));
          this.objSaveDraftInfoDTO.AgencyProfileId = this.AgencyProfileId;
          this.objSaveDraftInfoDTO.FormCnfgId = this.formId;
          this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
          this.objSaveDraftInfoDTO.TypeId = this.ChildID;
          this.objSaveDraftInfoDTO.CreatedUserId = userId;
          this.objSaveDraftInfoDTO.UpdatedUserId = userId;
          if (IsUpload) {
              this.submittedUpload = true;
              if (uploadFormBuilder.valid)
                  this.fnSubSaveDraft(dynamicForm, IsUpload, uploadFormBuilder);
          }
          else
              this.fnSubSaveDraft(dynamicForm, IsUpload, uploadFormBuilder);
          Common.SetSession("SaveAsDraft", "Y");

      }
      fnSubSaveDraft(dynamicForm, IsUpload, uploadFormBuilder) {
          let type = "save";
          if (this.SequenceNo > 0) {
              type = "update";
              this.isDirty = true;
              if (this.SequenceNo != 0 && CompareSaveasDraft(this.dynamicformcontrol, this.dynamicformcontrolOrginal)) {
                  this.isDirty = false;
              }
              if (this.isDirty || (IsUpload && uploadFormBuilder.valid)) {

                this.isLoadingSAD = true;
                  this.fnUpdateDynamicForm(dynamicForm, IsUpload);
                  this.objChildMonthlyProgressReport.SequenceNo = this.SequenceNo;
                  this.objSaveDraftInfoDTO.JsonList = JSON.stringify(dynamicForm);
                  this.objSaveDraftInfoDTO.JsonData = JSON.stringify(this.dynamicformcontrol);
                  this.objSaveDraftInfoDTO.SequenceNo = this.SequenceNo;
                  this.apiService.post("SaveAsDraftInfo", "Save", this.objSaveDraftInfoDTO).then(data => this.ResponeDraft(data, type, IsUpload));
              }
              else {
                this.saveAsDraftText=Common.GetSaveasDraftText;
                this.isLoadingSAD = true;
                  this.showAutoSave = false;
                  if (this.showAlert == false && this.IsNewOrSubmited == 1)
                      this.pComponent.alertWarning(Common.GetNoChangeAlert);
                  else if (this.showAlert == false && this.IsNewOrSubmited == 2)
                      this.pComponent.alertSuccess(Common.GetRecordAlreadySavedfullMsg);
                  this.showAlert = false;
                  this.isLoadingSAD = false;
              }
          }
          else {
            this.isLoadingSAD = true;
              this.apiService.get(this.controllerName, "GetNextSequenceNo", this.formId).then(data => {
                  this.SequenceNo = parseInt(data);
                  this.tblPrimaryKey = this.SequenceNo;
                  this.objChildMonthlyProgressReport.SequenceNo = this.SequenceNo;
                  this.fnUpdateDynamicForm(dynamicForm, IsUpload);
                  this.objSaveDraftInfoDTO.JsonList = JSON.stringify(dynamicForm);
                  this.objSaveDraftInfoDTO.JsonData = JSON.stringify(this.dynamicformcontrol);
                  this.objSaveDraftInfoDTO.SequenceNo = this.SequenceNo;
                  this.apiService.post("SaveAsDraftInfo", "Save", this.objSaveDraftInfoDTO).then(data => this.ResponeDraft(data, type, IsUpload));
              });
          }

      }
      private fnUpdateDynamicForm(dynamicForm, IsUpload) {
          dynamicForm.forEach(item => {
              item.AgencyProfileId = this.AgencyProfileId;
              item.SequenceNo = this.SequenceNo;
              if (item.FieldName == "SaveAsDraftStatus")
                  item.FieldValue = "1";
              if (IsUpload)
                  item.IsDocumentExist = true;
              else
                  item.IsDocumentExist = this.isUploadDoc;
          });
      }


      private ResponeDraft(data, type, IsUpload) {
          this.isLoading = false;
          this.isLoadingSAD = false;
          this.saveAsDraftText=Common.GetSaveasDraftText;
          if (data.IsError == true) {
              this.pComponent.alertDanger(data.ErrorMessage)
          }
          else if (data.IsError == false) {
              this.IsNewOrSubmited = 2;
              this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
              if (type == "save") {
                  if (IsUpload) {
                      this.uploadCtrl.fnUploadAll(data.SequenceNumber);
                  }
                  if (!this.showAlert)
                      this.pComponent.alertSuccess(Common.GetSaveDraftSuccessfullMsg);
              }
              else {
                  if (IsUpload) {
                      this.uploadCtrl.fnUploadAll(this.tblPrimaryKey);
                  }
                  if (!this.showAlert)
                      this.pComponent.alertSuccess(Common.GetUpdateDraftSuccessfullMsg);
              }
              this.showAlert = false;
          }
      }
      DynamicDefaultOnValChange(InsValChange: ValChangeDTO) {
        if (InsValChange.currnet.FieldCnfg.FieldName == "SocialWorkerId") {
          InsValChange.currnet.IsVisible = false;
        }
        if (InsValChange.currnet.FieldCnfg.FieldName == "LASocialWorkerId") {
          InsValChange.currnet.IsVisible = false;
        }
      }
      DynamicOnValChange(InsValChange: ValChangeDTO) {

          if (InsValChange.currnet.FieldCnfg.FieldName == "SaveAsDraftStatus") {
              InsValChange.currnet.IsVisible = false;
          }

          let CLAMedical = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "CLAMedicalId");
          if (CLAMedical.length > 0)
              CLAMedical[0].IsVisible = false;

          let Dental = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "DentalCheckId");
          if (Dental.length > 0)
              Dental[0].IsVisible = false;


          let Optician = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "OpticianCheckId");
          if (Optician.length > 0)
              Optician[0].IsVisible = false;


         // console.log(InsValChange.newValue);
          if (InsValChange.currnet.FieldCnfg.FieldName == "HasCLAMedical" && InsValChange.newValue == true && this.clamedicalList.length > 0 && this.clamedicalList[0] != null) {
              this.clamedicalListVisible = true;
              this.objChildMonthlyProgressReport.claSequenceNo = this.clamedicalList[0][0].SequenceNo;
             //  console.log('sa=> '+this.objChildMonthlyProgressReport.claSequenceNo);
          } else if (InsValChange.currnet.FieldCnfg.FieldName == "HasCLAMedical") {
              this.clamedicalListVisible = false;
              this.objChildMonthlyProgressReport.claSequenceNo = null;
             // console.log(22);
          }

          if (InsValChange.currnet.FieldCnfg.FieldName == "HasDentalCheck" && InsValChange.newValue == true && this.dentalList.length > 0 && this.dentalList[0] != null) {
              this.dentalListVisible = true;
              this.objChildMonthlyProgressReport.dentalSequenceNo = this.dentalList[0][0].SequenceNo;

          } else if (InsValChange.currnet.FieldCnfg.FieldName == "HasDentalCheck") {
              this.dentalListVisible = false;
              this.objChildMonthlyProgressReport.dentalSequenceNo = null;

          }

         // console.log(this.clamedicalList);

          if (InsValChange.currnet.FieldCnfg.FieldName == "HasOpticianCheck" && InsValChange.newValue == true && this.opticianList.length > 0 && this.opticianList[0] != null) {
              this.opticianVisible = true;
              this.objChildMonthlyProgressReport.opticianSequenceNo = this.opticianList[0][0].SequenceNo;

          }
          else if (InsValChange.currnet.FieldCnfg.FieldName == "HasOpticianCheck") {
              this.opticianVisible = false;
              this.objChildMonthlyProgressReport.opticianSequenceNo = null;

          }

      }
      isFirstTime: boolean = false;
      isReadOnly;
      ngOnInit() {
          this.isReadOnly = Common.GetSession("ViweDisable");
          this.st.newTimer('childMonthReport', environment.autoSaveTime);
          this.subscribeTimer2();
      }
      subscribeTimer2() {
          if (this.timer2Id) {
              // Unsubscribe if timer Id is defined
              this.st.unsubscribe(this.timer2Id);
              this.timer2Id = undefined;
              this.timer2button = 'Subscribe';
          } else {
              // Subscribe if timer Id is undefined
              this.timer2Id = this.st.subscribe('childMonthReport', () => this.timer2callback());
              this.timer2button = 'Unsubscribe';

          }
      }
      timer2callback() {
          //this.counter2++;
          if (this.isReadOnly == "0" || this.isReadOnly == null) {
              if (this.isFirstTime) {
                  this.showAutoSave = true;
                  let event = new MouseEvent('click', { bubbles: true });
                  if (this.SequenceNo > 0 && Common.GetSession("SaveAsDraft") == "N") {
                      this.saveDraftText = "Record auto-saved @";
                      this.skipAlert = false;
                      this.objChildMonthlyProgressReport.IsSubmitted = false;
                      this.submitText=Common.GetAutoSaveProgressText;
                      this.btnSubmit.fnClick();
                  }
                  else {
                      this.showAlert = true;
                      this.saveDraftText = "Draft auto-saved @";
                      this.saveAsDraftText=Common.GetSaveasDraftProgressText;
                      this.btnSaveDraft.nativeElement.dispatchEvent(event);
                  }
                  this.draftSavedTime = Date.now();
              }
              this.isFirstTime = true;
          }

      }
      ngOnDestroy() {
          this.st.delTimer('childMonthReport');
          Common.SetSession("formcnfgid", "0");
      }


      objList = [];
      LoadStatutoryCheckInfo(data, type) {

          //    console.log(data);
          if (data != null && data.length > 0 && data[0] != null) {
              data.forEach(item => {
                  this.objList = [];
                  item.forEach(subItem => {
                      let add: ComplaintInfos = new ComplaintInfos();
                      add.FieldCnfgId = subItem.FieldCnfgId;
                      add.FieldName = subItem.FieldName;
                      add.FieldValue = subItem.FieldValue;
                      add.FieldDataTypeName = subItem.FieldDataTypeName;
                      add.FieldValueText = subItem.FieldValueText;
                      add.UniqueID = subItem.UniqueID;
                      add.SequenceNo = subItem.SequenceNo;
                      add.DisplayName = subItem.DisplayName;
                      this.objList.push(add);
                  });
                  if (type == 'cla')
                      this.clamedicalList.push(this.objList);
                  else if (type == 'dental')
                      this.dentalList.push(this.objList);
                  else
                      this.opticianList.push(this.objList);

             //     console.log(this.clamedicalList);
              });
          }

      }


      fnDonloadPDF() {

          window.location.href = this.apiURL + "GenerateChildMonthlyProgressReportPDF/" + this.ChildCode + "," + this.ChildID + "," + this.SequenceNo + "," + this.AgencyProfileId;
      }
      fnDonloadWord() {
          window.location.href = this.apiURL + "GenerateChildMonthlyProgressReportWord/" + this.ChildCode + "," + this.ChildID + "," + this.SequenceNo + "," + this.AgencyProfileId;
      }
      fnPrint() {
          this.apiService.get("GeneratePDF", "GenerateChildMonthlyProgressReportPrint", this.ChildCode + "," + this.ChildID + "," + this.SequenceNo + "," + this.AgencyProfileId).then(data => {
              var popupWin;
            //   var style = ""; var link = "";
            //   var i;
            //   for (i = 0; i < $("style").length; i++) {
            //       style = style + $("style")[i].outerHTML;
            //   }
            //   var j;
            //   for (j = 0; j < $("link").length; j++) {
            //       link = link + $("link")[j].outerHTML;
            //   }
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
              this.objNotificationDTO.Body = this.ChildCode + "," + this.ChildID + "," + this.SequenceNo + "," + this.AgencyProfileId;
              this.apiService.post("GeneratePDF", "EmailChildMonthlyProgressReport", this.objNotificationDTO).then(data => {
                  if (data == true)
                      this.pComponent.alertSuccess("Email Send Successfully..");
                  else
                      this.pComponent.alertDanger("Email not Send Successfully..");
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

export class ComplaintInfos {
    FieldCnfgId: number;
    FieldName: string;
    FieldValue: string;
    SequenceNo: number;
    FieldDataTypeName: string;
    FieldValueText: string;
    StatusId: number;
    UniqueID: number;
    DisplayName: string;
    ComplianceCheckId: number;
    UserProfileId: number;
    CheckName: string;
    MemberTypeId: string;
}
