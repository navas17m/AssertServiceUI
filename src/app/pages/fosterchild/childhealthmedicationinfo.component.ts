import { Component, Pipe, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Common, deepCopy, Compare, ConvertDateAndDateTimeSaveFormat}  from  '../common'
import { ChildHealthMedicationInfo,ChildHealthMedicationInfoDetailDTO} from './DTO/childhealthmedicationinfo'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { ValChangeDTO} from '../dynamic/ValChangeDTO';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
//import { areAllEquivalent } from '@angular/compiler/src/output/output_ast';

//.@Pipe({ name: 'groupBy' })
@Component({
    selector: 'childhealthmedicationinfo',
    templateUrl: './childhealthmedicationinfo.component.template.html',
})

export class ChildHealthMedicationInfoComponent {
    objChildHealthMedicationInfo: ChildHealthMedicationInfo = new ChildHealthMedicationInfo();
    submitted = false; submittedUpload = false;
    dynamicformcontrol = [];
    dynamicformcontrolDetail = [];
    dynamicformcontrolOrginal = [];
    _Form: FormGroup;
    isVisibleMandatortMsg;
    SequenceNo;
    objQeryVal;
    formId;
    tblPrimaryKey;
    @ViewChild('uploads') uploadCtrl;
    TypeId;
    ChildID: number;
    AgencyProfileId: number;
    ngxList = [];
    subColumns=[{prop:'MedicationName', name:'Name of Medication'},
                {prop:'MedicationDosage', name:'Dosage/Frequency'},
                {prop:'DateMedicationGiven', name:'Date Medication Given'}
            ];
    MedicationTabActive = "active";
    DocumentActive;
    isLoading: boolean = false; controllerName = "ChildHealthMedicationInfo";
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=117;            
    constructor(private apiService: APICallService, private _formBuilder: FormBuilder,
        private route: ActivatedRoute, private _router: Router, private modal: PagesComponent) {
        if (Common.GetSession("ChildId") != null)
            this.ChildID = parseInt(Common.GetSession("ChildId"));
        this.route.params.subscribe(data => this.objQeryVal = data);
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objChildHealthMedicationInfo.AgencyProfileId = this.AgencyProfileId;
        this.objChildHealthMedicationInfo.ChildId = this.ChildID;
        this.SequenceNo = this.objQeryVal.Id;
        if (this.SequenceNo != 0 && this.SequenceNo != null) {
            this.tblPrimaryKey = this.SequenceNo;
            this.objChildHealthMedicationInfo.SequenceNo = this.SequenceNo;
        } else {
            this.objChildHealthMedicationInfo.SequenceNo = 0;
        }

        apiService.post(this.controllerName, "GetDynamicControls", this.objChildHealthMedicationInfo).then(data => {
            this.dynamicformcontrol = data.DynamicControls;
            this.dynamicformcontrolDetail = data.DynamicControls.filter(item => item.ControlLoadFormat == 'Details');
            this.LoadAlreadyStoreDate(data.ChildHealthMedicationInfoDetail);
            this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
        });
        this._Form = _formBuilder.group({});
        //Doc
        this.formId = 117;
        this.TypeId = this.ChildID;
        this.tblPrimaryKey = this.SequenceNo;
        this.deletbtnAccess = this.modal.GetDeletAccessPermission(this.formId);

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
    convertToGridData(objInput){
        this.ngxList = [];
        objInput.forEach(item =>{
            let temp:any= {};
            item.forEach(subitem => {
            temp.StatusId = subitem.StatusId;
            if(subitem.FieldName==="MedicationName")
                temp.MedicationName = subitem.FieldValue;
            else if (subitem.FieldName ==="MedicationDosage")
                temp.MedicationDosage=subitem.FieldValue;
            else if (subitem.FieldName ==="DateMedicationGiven")
                temp.DateMedicationGiven = moment(subitem.FieldValue).format("DD/MM/YYYY");
            });
            this.ngxList.push(temp);
        });
        this.ngxList = [...this.ngxList];
    }
    fnMedicationTab() {
        this.MedicationTabActive = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetailTab() {
        this.MedicationTabActive = "";
        this.DocumentActive = "active";
    }
    isDirty = true;
    DocOk = true;
    isShowPrescriptionError = false;
    clicksubmit(mainFormBuilder, dynamicForm, subformbuilder, dynamicValC, dynamicFormC, UploadDocIds, IsUpload, uploadFormBuilder, AddtionalEmailIds, EmailIds) {
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

        if (!mainFormBuilder.valid) {
            this.MedicationTabActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(mainFormBuilder);
        } else if (!subformbuilder.valid) {
            this.MedicationTabActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(subformbuilder);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.MedicationTabActive = "";
            this.DocumentActive = "active";
            this.modal.GetErrorFocus(uploadFormBuilder);
        }
        else {
            this.MedicationTabActive = "active";
            this.DocumentActive = "";
        }

        if (mainFormBuilder.valid && subformbuilder.valid && dynamicFormC.valid && dynamicForm != '') {
            this.isDirty = true;
            if (this.SequenceNo != 0 && Compare(dynamicForm, this.dynamicformcontrolOrginal)) {
                this.isDirty = false;
            }
            if (this.isDirty || (IsUpload && uploadFormBuilder.valid)) {
                let isOkPrescription = true;
                // let valPrescription = dynamicForm.filter(x => x.FieldName == "PrescriptionIssueDate");
                // if (valPrescription.length > 0 && (valPrescription[0].FieldValue == null || valPrescription[0].FieldValue == '')) {
                //     isOkPrescription = false;
                // }

                let isOkNonPrescription = true;
                // let valNonPrescribe = dynamicForm.filter(x => x.FieldName == "NonPrescribedMedicationIssueDate");
                // if (valNonPrescribe.length > 0 && (valNonPrescribe[0].FieldValue == null || valNonPrescribe[0].FieldValue == '')) {
                //     isOkNonPrescription = false;
                // }
                if (isOkPrescription || isOkNonPrescription) {

                    dynamicValC.forEach(item => {
                        dynamicForm.push(item);
                    });

                    this.isShowPrescriptionError = false;
                    this.isLoading = true;
                    let type = "save";
                    if (this.SequenceNo > 0)
                        type = "update";

                    this.objChildHealthMedicationInfo.SequenceNo=this.SequenceNo;
                    this.objChildHealthMedicationInfo.NotificationEmailIds = EmailIds;
                    this.objChildHealthMedicationInfo.NotificationAddtionalEmailIds = AddtionalEmailIds;
                    this.objChildHealthMedicationInfo.DynamicValue = dynamicForm;
                    this.objChildHealthMedicationInfo.ChildId = this.ChildID;
                    this.objChildHealthMedicationInfo.ChildHealthMedicationInfoDetail = this.globalobjHealthDetailsList;
                    this.apiService.save(this.controllerName, this.objChildHealthMedicationInfo, type).then(data => this.Respone(data, type, IsUpload));
                }
                else {
                    this.isShowPrescriptionError = true;
                }
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
                    this.uploadCtrl.fnUploadAll(data.SequenceNumber);
                }
                this.modal.alertSuccess(Common.GetSaveSuccessfullMsg);
            }
            else {
                this.objUserAuditDetailDTO.ActionId =2;
                this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.tblPrimaryKey);
                }
                this.modal.alertSuccess(Common.GetUpdateSuccessfullMsg);
            }
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.formId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
            this._router.navigate(['/pages/child/childhealthmedicationinfolist/19']);
        }
    }

    //---Discussion Dynamic Grid
  //  dynamicformcontrolDiscussion = [];
    globalobjHealthDetailsList = [];
    objHealthDetailsList: ChildHealthMedicationInfoDetailDTO[] = [];
    objHealthDetailsListInsert = [];
    submittedHealthDetails = false;

    LoadAlreadyStoreDate(data) {

        if (data != null) {
            data.forEach(item => {
                this.objHealthDetailsList = [];
                item.forEach(subItem => {
                    let add: ChildHealthMedicationInfoDetailDTO = new ChildHealthMedicationInfoDetailDTO();
                    add.FieldCnfgId = subItem.FieldCnfgId;
                    add.FieldName = subItem.FieldName;
                    add.FieldValue = subItem.FieldValue;
                    add.FieldDataTypeName = subItem.FieldDataTypeName;
                    add.FieldValueText = subItem.FieldValueText;
                    add.UniqueID = subItem.UniqueID;
                    add.SequenceNo = subItem.SequenceNo;
                    add.StatusId = 4;
                    this.objHealthDetailsList.push(add);
                    this.objHealthDetailsListInsert.push(add);
                });
                this.globalobjHealthDetailsList.push(this.objHealthDetailsList);
            });
        }
        this.convertToGridData(this.globalobjHealthDetailsList);
        //console.log(this.globalobjHealthDetailsList);
    }

    AddAttendedDetails(dynamicVal, dynamicForm) {

        this.objHealthDetailsList = [];

        if (this._Form.valid && dynamicForm.valid) {

            dynamicVal.forEach(item => {
                let add: ChildHealthMedicationInfoDetailDTO = new ChildHealthMedicationInfoDetailDTO();
                add.FieldCnfgId = item.FieldCnfgId;
                add.FieldName = item.FieldName;
                add.FieldValue = item.FieldValue;
                add.FieldDataTypeName = item.FieldDataTypeName;
                add.FieldValueText = item.FieldValueText;
                add.StatusId = 1;
                add.UniqueID = 0;
                this.objHealthDetailsList.push(add);
                this.objHealthDetailsListInsert.push(add);
            })
            this.globalobjHealthDetailsList.push(this.objHealthDetailsList);
            this.submittedHealthDetails = false;
            this.dynamicformcontrolDetail.forEach(itemTemp => {
                itemTemp.FieldValue = null;
               // this.dynamicformcontrolDiscussion.filter(item => item.FieldValue = null);
            });
            this.convertToGridData(this.globalobjHealthDetailsList);
        }
        else
            this.submittedHealthDetails = true;
    }

    EditAttendedStatusList(index) {
        this.healthDetailId = index;
        this.isEdit = true;
        let tempObj = this.globalobjHealthDetailsList[index];
        tempObj.forEach(itemTemp => {
            let val = this.dynamicformcontrolDetail.filter(item => item.FieldCnfg.FieldCnfgId == itemTemp.FieldCnfgId);
            if (val.length > 0) {
                switch (val[0].FieldCnfg.FieldDataTypeCnfg.Name) {
                    case "date":
                        {
                            val[0].FieldValue = this.modal.GetDateEditFormat(itemTemp.FieldValue);
                            break;
                        }
                    case "datetime":
                        {
                            val[0].FieldValue = this.modal.GetDateTimeEditFormat(itemTemp.FieldValue);
                            break;
                        }
                    case "bit":
                        {
                            if(itemTemp.FieldValue != null)
                            {
                            val[0].FieldValue =  (itemTemp.FieldValue == "1");
                            }
                            break;
                        }
                    default: {
                        val[0].FieldValue = itemTemp.FieldValue;
                    }
                }

               // console.log(val[0]);
               if(val[0].FieldCnfg.FieldName == "MedicationGivenPeriod")
               {
                  // console.log('1111111111 ');
                   val[0].FieldValue = itemTemp.FieldValue;
                   val[0].FieldValueText = itemTemp.FieldValueText;
               }
            }
        });
    }

    DeleteAttendedStatusList(index) {
        let temp = this.globalobjHealthDetailsList[index];
        temp.forEach(item => {
            item.StatusId = 3;
        });
        this.ngxList[index].StatusId=3;
        this.ngxList = [...this.ngxList];
    }

    UpdateAttendedDetails(dynamicVal, dynamicForm) {

        if (dynamicForm.valid) {

            this.isEdit = false;
            let temp = this.globalobjHealthDetailsList[this.healthDetailId];
            temp.forEach(item => {
                if(item.FieldValue!=dynamicVal.filter(subItem => subItem.FieldCnfgId == item.FieldCnfgId)[0].FieldValue)
                {
                item.FieldValue = dynamicVal.filter(subItem => subItem.FieldCnfgId == item.FieldCnfgId)[0].FieldValue;
                item.FieldValueText = dynamicVal.filter(subItem => subItem.FieldCnfgId == item.FieldCnfgId)[0].FieldValueText;
                }
                item.StatusId = 2;
            });
            this.convertToGridData(this.globalobjHealthDetailsList);
            this.dynamicformcontrolDetail.forEach(itemTemp => {
                this.dynamicformcontrolDetail.filter(item => item.FieldValue = null);

            });
            this.submittedHealthDetails = false;
        }
        else
            this.submittedHealthDetails = true;
        this.healthDetailId = null;
    }

    CancelEdit() {
        this.isEdit = false;
        this.healthDetailId = null;
        this.dynamicformcontrolDetail.forEach(itemTemp => {
            this.dynamicformcontrolDetail.filter(item => item.FieldValue = null);

        });
    }
    deletbtnAccess = false;
    isEdit = false;
    healthDetailId;
    //---End


    DynamicOnValChange(InsValChange: ValChangeDTO, dynamicValA) {

        //console.log('----------')
        if (InsValChange.currnet.FieldCnfg.FieldName == "MedicationGivenPeriod") {


            let insMothWeek = dynamicValA.filter(x => x.FieldName == "MedicationGivenPeriod");
            if (insMothWeek.length > 0)
            {
                let valMonthWeek = insMothWeek[0].FieldValueText;
               // console.log("valMonthWeek "+valMonthWeek);
                if (valMonthWeek == "Day")
                {
                    InsValChange.all.forEach(item => {
                        if (item.FieldCnfg.FieldName == "FromDateMedicationGiven" || item.FieldCnfg.FieldName == "ToDateMedicationGiven")
                            item.IsVisible = false;
                        else if (item.FieldCnfg.FieldName == "DateMedicationGiven")
                            item.IsVisible = true;

                    });
                }
                else if (valMonthWeek == "Week" || valMonthWeek == "Month")
                {
                    InsValChange.all.forEach(item => {
                        if (item.FieldCnfg.FieldName == "DateMedicationGiven")
                            item.IsVisible = false;
                         else if (item.FieldCnfg.FieldName == "FromDateMedicationGiven" || item.FieldCnfg.FieldName == "ToDateMedicationGiven")
                             item.IsVisible = true;
                    });

                }
            }
        }
        else if(this.SequenceNo!=0)
        {
            let insMedicationGivenPeriod= dynamicValA.filter(x => x.FieldName == "MedicationGivenPeriod")
            let valMonthWeek = insMedicationGivenPeriod[0].FieldValue;

            let tem=this.dynamicformcontrolDetail.filter(x=>x.FieldCnfg.FieldName=="MedicationGivenPeriod");
            if(tem.length>0)
            {
                let ctv=tem[0].ConfigTableValues.filter(x=>x.CofigTableValuesId==valMonthWeek);
                if (ctv[0].Value == "Day")
                {
                    InsValChange.all.forEach(item => {
                        if (item.FieldCnfg.FieldName == "FromDateMedicationGiven" || item.FieldCnfg.FieldName == "ToDateMedicationGiven")
                            item.IsVisible = false;
                        else if (item.FieldCnfg.FieldName == "DateMedicationGiven")
                            item.IsVisible = true;

                    });
                }
                else if (ctv[0].Value == "Week" || ctv[0].Value == "Month")
                {
                    InsValChange.all.forEach(item => {
                        if (item.FieldCnfg.FieldName == "DateMedicationGiven")
                            item.IsVisible = false;
                         else if (item.FieldCnfg.FieldName == "FromDateMedicationGiven" || item.FieldCnfg.FieldName == "ToDateMedicationGiven")
                             item.IsVisible = true;
                    });

                }
            }

        }

        if (InsValChange.currnet.FieldCnfg.FieldName == "FromDateMedicationGiven") {
            //console.log(11111111111111);
            let valMonthWeek = null;
            let insMothWeek = dynamicValA.filter(x => x.FieldName == "MedicationGivenPeriod");
            if (insMothWeek.length > 0)
                valMonthWeek = insMothWeek[0].FieldValueText;

            let valFromDate = InsValChange.all.find(x => x.FieldCnfg.FieldName == "FromDateMedicationGiven").FieldValue;
            let valToDate = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "ToDateMedicationGiven");

            if (valFromDate != null && valMonthWeek != null) {
                let days = 7;
                if (valMonthWeek == "Month")
                    days = 30;

                let date = new Date(this.modal.GetDateSaveFormat(valFromDate));
                date.setDate(date.getDate() + days);
                if (valToDate.length > 0) {
                    //let dt = new Date(date);
                    valToDate[0].FieldValue = this.modal.GetDateEditFormat(moment(date).format("YYYY-MM-DD"));

                }
            }
        }

        // if (InsValChange.currnet.FieldCnfg.FieldName == "GoalAchievedDays") {

        //     let valMonthWeek = null;
        //     let insMothWeek = dynamicValA.filter(x => x.FieldName == "WeekorMonth");
        //     if (insMothWeek.length > 0)
        //         valMonthWeek = insMothWeek[0].FieldValueText;

        //     let valGoalAchievedDays = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "GoalAchievedDays");
        //     if (valMonthWeek != null && valMonthWeek == "Week" && valGoalAchievedDays.length > 0 && valGoalAchievedDays[0].FieldValue != null) {
        //         if (parseInt(valGoalAchievedDays[0].FieldValue) > 7) {
        //             valGoalAchievedDays[0].FieldValue = null;
        //             this.module.alertInfo("Goal Achieved Days should not be greater than 7 days");
        //         }
        //     }
        //     else if (valMonthWeek != null && valMonthWeek == "Month" && valGoalAchievedDays.length > 0 && valGoalAchievedDays[0].FieldValue != null) {
        //         if (parseInt(valGoalAchievedDays[0].FieldValue) > 30) {
        //             valGoalAchievedDays[0].FieldValue = null;
        //             this.module.alertInfo("Goal Achieved Days should not be greater than 30 days");
        //         }
        //     }
        // }
    }
}
