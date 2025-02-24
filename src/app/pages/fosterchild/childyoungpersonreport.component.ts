import { APICallService } from '../services/apicallservice.service';
import { Component, Pipe, ViewChild} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Common}  from  '../common'
import { ChildYoungPersonReportDTO, ChildYPReportHealthDTO, ChildYPReportFinanceDTO } from './DTO/childyoungpersonreportdto'
import { PagesComponent } from '../pages.component'
import { ValChangeDTO} from '../dynamic/ValChangeDTO';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
//.@Pipe({ name: 'groupBy' })
@Component({
    selector: 'ChildYoungPersonReportData',
    templateUrl: './childyoungpersonreport.component.template.html',
})

export class ChildYoungPersonReportDataComponent {
    controllerName = "ChildYoungPersonReport";
    globalObjChildYPRHealthList = [];
    globalObjChildYPRFinanceList = [];
    objChildYoungPersonReportDTO: ChildYoungPersonReportDTO = new ChildYoungPersonReportDTO();
    objChildYPReportHealthDTOlist: ChildYPReportHealthDTO[] = [];
    objChildYPReportFinanceDTOlist: ChildYPReportFinanceDTO[] = [];
    deletbtnAccess = false;
    submitted = false;
    submittedHealth= false;
    submittedFinance = false;
    coursedatesubmitted = false;
    dynamicformcontroldata = [];
    dynamicformcontroldataOrginal = [];
    dynamicformcontroldataHealth = [];
    dynamicformcontroldataFinance = [];
    dynamicformcontrolgrid;
    _Form: FormGroup;
    isVisibleMandatoryMsg;
    SequenceNo;
    objQeryVal;
    AttendedDateValid = false;
    ChildId;
    isLoading: boolean = false;
    insypReportActive="active";
    insDocumentActive="";
    //Doc
    formId;
    tblPrimaryKey;
    TypeId;
    submittedUpload = false;
    @ViewChild('uploads') uploadCtrl;
    ypHealthList=[];
    ypHealthColumns=[{prop:'Appointments', name:'Appointments'},
                    {prop:'Date', name:'Date'},
                    {prop:'Outcome', name:'Outcome'}];
    ypFinanceList=[];
    ypFinanceColumns=[{prop:'Expenses', name:'Expenses'},
                    {prop:'Date', name:'Date'},
                    {prop:'Amount', name:'Amount'}];
    footerMessage={
      'emptyMessage': `<div align=center><strong>No records found.</strong></div>`,
      'totalMessage': ' - Records'
    };
    SocialWorkerId;
    LASocialWorkerId;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId = 187;
    constructor(private _formBuilder: FormBuilder, private route: ActivatedRoute,
        private _router: Router, private module: PagesComponent, private apiService: APICallService) {
        this.ChildId = parseInt(Common.GetSession("ChildId"));
        this.SocialWorkerId = Common.GetSession("SSWId");
        this.LASocialWorkerId = Common.GetSession("ChildLASocialWorkerId");
        this.route.params.subscribe(data => this.objQeryVal = data);
        this.SequenceNo = this.objQeryVal.id;
        this.objChildYoungPersonReportDTO.ChildId = this.ChildId;
        this.objChildYoungPersonReportDTO.ControlLoadFormat = ["Default", "Default2", "Default3", "Appointments", "Expenses"]
        this.objChildYoungPersonReportDTO.SequenceNo = this.SequenceNo;
        this.apiService.post(this.controllerName, "GetDynamicControls", this.objChildYoungPersonReportDTO).then(data => {
            this.ResponseTrainingProfileDataDyanmic(data);
        });
        this._Form = _formBuilder.group({});
        this.deletbtnAccess = this.module.GetDeletAccessPermission(187);
        //Doc
        this.formId = 187;
        this.TypeId = this.ChildId;
        this.tblPrimaryKey = this.objQeryVal.id;

        if (Common.GetSession("ViweDisable") == '1') {
            this.objUserAuditDetailDTO.ActionId = 4;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildId;
            this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }

    fnYpReportActive()
    {
        this.insypReportActive="active";
        this.insDocumentActive="";
    }

    fnDocumentActive()
    {
        this.insypReportActive="";
        this.insDocumentActive="active";
    }

    private ResponseTrainingProfileDataDyanmic(data) {
        if (data != null) {
            this.dynamicformcontroldataOrginal = data.DynamicControls;
            this.dynamicformcontroldata = data.DynamicControls;
            this.dynamicformcontroldataHealth = this.dynamicformcontroldata.filter(item => item.ControlLoadFormat == 'Appointments');
            this.dynamicformcontroldataFinance = this.dynamicformcontroldata.filter(item => item.ControlLoadFormat == 'Expenses');
            this.LoadAlreadyStoreHealth(data.LstChildYPReportHealth);
            this.LoadAlreadyStoreFinance(data.LstChildYPReportFinance);
        }
    }

    DocOk = true;
    clicksubmitdata(_Form, dynamicValA, dynamicFormA, dynamicValB, dynamicFormB, dynamicValC, dynamicFormC,
        UploadDocIds,IsUpload, uploadFormBuilder,
        AddtionalEmailIds, EmailIds) {
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
        if (_Form.valid && dynamicFormA.valid && dynamicFormB.valid && dynamicFormC.valid) {
            this.isLoading = true;
            let type = "save";
            if (this.SequenceNo > 0)
                type = "update";

            dynamicValB.forEach(item => {
                dynamicValA.push(item);
            });

            dynamicValC.forEach(item => {
                dynamicValA.push(item);
            });

            if(this.SequenceNo == 0){
            let val = dynamicValA.filter(x => x.FieldName == "SocialWorkerId");
            if (val.length > 0 && (val[0].FieldValue == null || val[0].FieldValue == ''))
              val[0].FieldValue = this.SocialWorkerId;

            let valLASW = dynamicValA.filter(x => x.FieldName == "LASocialWorkerId");
            if (valLASW.length > 0 && (valLASW[0].FieldValue == null || valLASW[0].FieldValue == ''))
              valLASW[0].FieldValue = this.LASocialWorkerId;
            }
            this.objChildYoungPersonReportDTO.LstChildYPReportHealth = this.globalObjChildYPRHealthList;
            this.objChildYoungPersonReportDTO.LstChildYPReportFinance = this.globalObjChildYPRFinanceList;
            this.objChildYoungPersonReportDTO.DynamicValue = dynamicValA;
            this.objChildYoungPersonReportDTO.ChildId = this.ChildId;
            this.objChildYoungPersonReportDTO.NotificationEmailIds = EmailIds;
            this.objChildYoungPersonReportDTO.NotificationAddtionalEmailIds = AddtionalEmailIds;
            this.apiService.save(this.controllerName, this.objChildYoungPersonReportDTO, type).then(data => this.Respone(data, type,IsUpload));
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
                    this.uploadCtrl.fnUploadAll(this.tblPrimaryKey);
                }
            }

            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildId;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
            this._router.navigate(['/pages/child/childypreportlist/4']);
        }
    }


    //---Dynamic Grid Health
    objYPHealthInsert = [];
    convertToHealthGrid(objInput){
        this.ypHealthList = [];
        objInput.forEach(item =>{
            let temp:any= {};
            item.forEach(subitem => {
            temp.StatusId = subitem.StatusId;
            if(subitem.FieldName==="AppointmentId")
                temp.Appointments = subitem.FieldValueText;
            else if (subitem.FieldName ==="AppointmentDate")
                temp.Date = moment(subitem.FieldValue).format("DD/MM/YYYY");
            else if (subitem.FieldName ==="Outcome")
                temp.Outcome=subitem.FieldValue;
            });
            this.ypHealthList.push(temp);
        });
        this.ypHealthList = [...this.ypHealthList];
    }
    LoadAlreadyStoreHealth(data) {

        if (data != null) {
            data.forEach(item => {
                this.objChildYPReportHealthDTOlist = [];
                item.forEach(subItem => {
                    let add: ChildYPReportHealthDTO = new ChildYPReportHealthDTO();
                    add.FieldCnfgId = subItem.FieldCnfgId;
                    add.FieldName = subItem.FieldName;
                    add.FieldValue = subItem.FieldValue;
                    add.FieldDataTypeName = subItem.FieldDataTypeName;
                    add.FieldValueText = subItem.FieldValueText;
                    add.UniqueID = subItem.UniqueID;
                    add.SequenceNo = subItem.SequenceNo;
                    add.StatusId = 4;
                    this.objChildYPReportHealthDTOlist.push(add);
                    this.objYPHealthInsert.push(add);
                });
                this.globalObjChildYPRHealthList.push(this.objChildYPReportHealthDTOlist);
            });
        this.convertToHealthGrid(this.globalObjChildYPRHealthList);
        }
    }

    AddYpHealthDetails(dynamicVal, dynamicForm) {
        this.objChildYPReportHealthDTOlist = [];
        this.submittedHealth = true;
        if (dynamicForm.valid) {
            dynamicVal.forEach(item => {
                let add: ChildYPReportHealthDTO = new ChildYPReportHealthDTO();
                add.FieldCnfgId = item.FieldCnfgId;
                add.FieldName = item.FieldName;
                add.FieldValue = item.FieldValue;
                add.FieldDataTypeName = item.FieldDataTypeName;
                add.FieldValueText = item.FieldValueText;
                add.StatusId = 1;
                add.UniqueID = 0;
                this.objChildYPReportHealthDTOlist.push(add);
                this.objYPHealthInsert.push(add);
                this.AttendedDateValid = false;

            })
            this.globalObjChildYPRHealthList.push(this.objChildYPReportHealthDTOlist);
            this.submittedHealth = false;
            this.convertToHealthGrid(this.globalObjChildYPRHealthList);
            this.dynamicformcontroldataHealth.forEach(itemTemp => {
                this.dynamicformcontroldataHealth.filter(item => item.FieldValue = null);

            });
        }
        else
            this.submittedHealth = true;
    }

    EditYpHealtList(index) {
        this.YPReportHealthId = index;
        this.isEdit = true;
        let tempObj = this.globalObjChildYPRHealthList[index];
        tempObj.forEach(itemTemp => {
            this.dynamicformcontroldataHealth.filter(item => item.FieldCnfg.FieldCnfgId == itemTemp.FieldCnfgId)[0].FieldValue = itemTemp.FieldValue;
        });
    }

    DeleteYpHealtList(index) {
        let temp = this.globalObjChildYPRHealthList[index];
        temp.forEach(item => {
            item.StatusId = 3;
        });
        this.ypHealthList[index].StatusId=3;
        this.ypHealthList=[...this.ypHealthList];
    }

    UpdateYpHealthDetails(dynamicVal, dynamicForm) {

        if (dynamicForm.valid) {
            this.isEdit = false;
            let temp = this.globalObjChildYPRHealthList[this.YPReportHealthId];
            temp.forEach(item => {
                item.FieldValue = dynamicVal.filter(subItem => subItem.FieldCnfgId == item.FieldCnfgId)[0].FieldValue;
                item.FieldValueText = dynamicVal.filter(subItem => subItem.FieldCnfgId == item.FieldCnfgId)[0].FieldValueText;
                item.StatusId = 2;
            });
            this.convertToHealthGrid(this.globalObjChildYPRHealthList);
            this.dynamicformcontroldataHealth.forEach(itemTemp => {
                this.dynamicformcontroldataHealth.filter(item => item.FieldValue = null);
            });
            this.submittedHealth = false;
        }
        else
            this.submittedHealth = true;
        this.YPReportHealthId = null;
    }

    CancelEdit() {
        this.isEdit = false;
        this.YPReportHealthId = null;
        this.dynamicformcontroldataHealth.forEach(itemTemp => {
            this.dynamicformcontroldataHealth.filter(item => item.FieldValue = null);
        });
    }

    isEdit = false;
    YPReportHealthId;

    //---End


    //---Dynamic Grid Finance
    objYPFinanceInsert = [];
    convertToFinanceGrid(objInput){
        this.ypFinanceList = [];
        objInput.forEach(item =>{
            let temp:any= {};
            item.forEach(subitem => {
            temp.StatusId = subitem.StatusId;
            if(subitem.FieldName==="ExpensesId")
                temp.Expenses = subitem.FieldValueText;
            else if (subitem.FieldName ==="ExpensesDate")
                temp.Date = moment(subitem.FieldValue).format("DD/MM/YYYY");
            else if (subitem.FieldName ==="Amount")
                temp.Amount=subitem.FieldValue;
            });
            this.ypFinanceList.push(temp);
        });
        this.ypFinanceList = [...this.ypFinanceList];
    }

    LoadAlreadyStoreFinance(data) {
        if (data != null) {
            data.forEach(item => {
                this.objChildYPReportFinanceDTOlist = [];
                item.forEach(subItem => {
                    let add: ChildYPReportFinanceDTO = new ChildYPReportFinanceDTO();
                    add.FieldCnfgId = subItem.FieldCnfgId;
                    add.FieldName = subItem.FieldName;
                    add.FieldValue = subItem.FieldValue;
                    add.FieldDataTypeName = subItem.FieldDataTypeName;
                    add.FieldValueText = subItem.FieldValueText;
                    add.UniqueID = subItem.UniqueID;
                    add.SequenceNo = subItem.SequenceNo;
                    add.StatusId = 4;
                    this.objChildYPReportFinanceDTOlist.push(add);
                    this.objYPHealthInsert.push(add);
                });
                this.globalObjChildYPRFinanceList.push(this.objChildYPReportFinanceDTOlist);
            });
            this.convertToFinanceGrid(this.globalObjChildYPRFinanceList)
        }
    }

    AddYpFinanceDetails(dynamicVal, dynamicForm) {
        this.objChildYPReportFinanceDTOlist = [];
        this.submittedFinance = true;
        if (dynamicForm.valid) {
            dynamicVal.forEach(item => {
                let add: ChildYPReportFinanceDTO = new ChildYPReportFinanceDTO();
                add.FieldCnfgId = item.FieldCnfgId;
                add.FieldName = item.FieldName;
                add.FieldValue = item.FieldValue;
                add.FieldDataTypeName = item.FieldDataTypeName;
                add.FieldValueText = item.FieldValueText;
                add.StatusId = 1;
                add.UniqueID = 0;
                this.objChildYPReportFinanceDTOlist.push(add);
                this.objYPHealthInsert.push(add);
                this.AttendedDateValid = false;
            })
            this.globalObjChildYPRFinanceList.push(this.objChildYPReportFinanceDTOlist);
            this.submittedFinance = false;
            this.convertToFinanceGrid(this.globalObjChildYPRFinanceList);
            this.dynamicformcontroldataFinance.forEach(itemTemp => {
                this.dynamicformcontroldataFinance.filter(item => item.FieldValue = null);
            });
        }
        else
            this.submittedFinance = true;
    }

    EditYpFinanceList(index) {
        this.YPReportFinanceId = index;
        this.isEditFinance = true;
        let tempObj = this.globalObjChildYPRFinanceList[index];
        tempObj.forEach(itemTemp => {
            this.dynamicformcontroldataFinance.filter(item => item.FieldCnfg.FieldCnfgId == itemTemp.FieldCnfgId)[0].FieldValue = itemTemp.FieldValue;
        });
    }

    DeleteYpFinanceList(index) {
        let temp = this.globalObjChildYPRFinanceList[index];
        temp.forEach(item => {
            item.StatusId = 3;
        });
        this.ypFinanceList[index].StatusId=3;
        this.ypFinanceList = [...this.ypFinanceList];
    }

    UpdateYpFinanceDetails(dynamicVal, dynamicForm) {

        if (dynamicForm.valid) {
            this.isEdit = false;
            let temp = this.globalObjChildYPRFinanceList[this.YPReportFinanceId];
            temp.forEach(item => {
                item.FieldValue = dynamicVal.filter(subItem => subItem.FieldCnfgId == item.FieldCnfgId)[0].FieldValue;
                item.FieldValueText = dynamicVal.filter(subItem => subItem.FieldCnfgId == item.FieldCnfgId)[0].FieldValueText;
                item.StatusId = 2;
            });
            this.ypFinanceList = [...this.ypFinanceList];
            this.dynamicformcontroldataFinance.forEach(itemTemp => {
                this.dynamicformcontroldataFinance.filter(item => item.FieldValue = null);

            });
            this.submittedFinance = false;
        }
        else
            this.submittedFinance = true;
        this.YPReportFinanceId = null;
    }

    CancelFinanceEdit() {
        this.isEditFinance = false;
        this.YPReportFinanceId = null;
        this.dynamicformcontroldataFinance.forEach(itemTemp => {
            this.dynamicformcontroldataFinance.filter(item => item.FieldValue = null);

        });
    }

    isEditFinance = false;
    YPReportFinanceId;

    //---End
}


