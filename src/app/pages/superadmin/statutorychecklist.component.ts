import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { ValChangeDTO } from '../dynamic/ValChangeDTO';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { ComplianceDTO } from './DTO/compliance';
import { StatutoryCheckDTO } from './DTO/statutorycheck';
declare var $: any;
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component({
    selector: 'StatutoryCheckList',
    templateUrl: './statutorychecklist.component.template.html',
})

export class StatutoryCheckListComponet {
    controllerName = "ComplianceCheckTypeCnfg";
    SourceFieldName;
    TargetFieldName;
    RenewalDaysDifferent;
    //////
    loading = false;
    _Form: FormGroup;
    CheckTypeSelectValues = [];
    MemberTypeList = [];
    MemberList = [];
    checkTypeList = [];
    objStatutoryCheckDTO: StatutoryCheckDTO = new StatutoryCheckDTO();
    objQeryVal;
    submitted = false;
    dynamicformcontrol = [];
    dynamicgridValues = [];
    IsMandatory = false;
    objComplianceDTO: ComplianceDTO = new ComplianceDTO();
    AddNew = true;
    AddNewBtnVisible = false;
    globalObjComplaintInfoList = [];
    objComplaintInfoList: ComplaintInfo[] = [];
    dynamicHeader = [];
    ComplianceStatusId;
    errorVisible = false;
    checkName;
    IsLoading = false;
    FormCnfgId;
    insFormCnfgId;
    IsShowCopyContentDocument = false;
    IsEditRecord = false;

    //Docs
    formId;
    tblPrimaryKey;
    TypeId;
    submittedUpload = false;
    @ViewChild('uploads') uploadCtrl;
    userTypeCnfgId;
    SequenceNumber;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    constructor(private _formBuilder: FormBuilder,
        private activatedroute: ActivatedRoute, private _router: Router,
        private pComponent: PagesComponent, private apiService: APICallService) {

        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });

        //  this.objStatutoryCheckDTO.CheckTypeId = null;
        //t
        this._Form = _formBuilder.group({
            MemberTypeId: ['0', Validators.required],
            MemberId: ['0', Validators.required],
            CheckTypeId: ['0', Validators.required],
            IsContentCopytoSC: [],
            IsDocumentCopytoSC: [],
        });



        //Bind Member Type
        if (this.objQeryVal.id == 3 || this.objQeryVal.id == 13) {

            //Carer
            if (this.objQeryVal.mid == 13 && Common.GetSession("CarerParentId") == null || Common.GetSession("CarerParentId") == "0") {
                this._router.navigate(['/pages/recruitment/applicantlist/3/10']);
            }

            //  alert(this.objQeryVal.mid);
            if (this.objQeryVal.mid == 3 && Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0") {
                this._router.navigate(['/pages/fostercarer/approvedcarerlist/3/10']);
            }
            this.insFormCnfgId = 33;
            this.FormCnfgId = 33;
            if (this.objQeryVal.mid == 3)
                this.FormCnfgId = 58;

            this.userTypeCnfgId = 4;
            this.BindUserType(4);
        }
        else if (this.objQeryVal.id == 5) {
            this.FormCnfgId = 120;
            this.insFormCnfgId = 120;
            //Child
            if (Common.GetSession("ChildId") == null || Common.GetSession("ChildId") == 'null' || Common.GetSession("ChildId") == "0") {
                this._router.navigate(['/pages/child/childprofilelist/1/4']);
            }
            this.BindUserType(5);
            this.userTypeCnfgId = 5;
        }
        else if (this.objQeryVal.id == 6) {
            this.insFormCnfgId = 163;
            this.FormCnfgId = 163;
            //Employee
            if (Common.GetSession("EmployeeId") == null || Common.GetSession("EmployeeId") == 'null' || Common.GetSession("EmployeeId") == "0") {
                this._router.navigate(['/pages/hr/employeelist/6/12']);
            }
            else
                this.BindUserType(6);
            this.userTypeCnfgId = 6;
        }


        //Doc
        this.formId = 58;

        // this.tblPrimaryKey = this.SequenceNo;
        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }

    fnViewAllCheck() {
        this._router.navigate(['/pages/superadmin/statutorycheck', this.objQeryVal.mid]);
    }

    BindUserType(typeID: number) {
        this.apiService.get(this.controllerName, "GetMemberTypeCnfg", typeID).then(data => {
            //this.cctcServices.GetMemberTypeCnfg(typeID).then(data => {
            this.MemberTypeList = data;
            if (data.length == 1) {
                this.objStatutoryCheckDTO.MemberTypeId = data[0].MemberTypeId;
                this.BindMemberName(data[0].MemberTypeId);
            }

        });
    }
    CarerParentId = 0;
    ChildId = 0;
    BindMemberName(mTypeId: number) {
        this.globalObjComplaintInfoList = [];
        this.AddNew = true;
        this.checkName = "";
        this.objStatutoryCheckDTO.CheckTypeId = null;
        this.objStatutoryCheckDTO.MemberId = null;
        this.MemberList = null;
        this.ComplianceStatusId = null;
        this.IsShowCopyContentDocument = false;

        if (mTypeId != null) {
            if (this.objQeryVal.mid == 13) {
                this.CarerParentId = parseInt(Common.GetSession("CarerParentId"));
                this.TypeId = this.CarerParentId;
            }
            else if (this.objQeryVal.mid == 3) {
                this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
                this.TypeId = this.CarerParentId;
            }
            else if (this.objQeryVal.id == 5 && Common.GetSession("ChildId") != null) {
                this.ChildId = parseInt(Common.GetSession("ChildId"));
                this.TypeId = this.ChildId;
            }
            else if (this.objQeryVal.id == 6) {
                this.objStatutoryCheckDTO.EmployeeId = parseInt(Common.GetSession("EmployeeId"));
                this.TypeId = this.objStatutoryCheckDTO.EmployeeId;
            }


            this.CheckTypeSelectValues = [];
            this.dynamicformcontrol = null;
            this.objStatutoryCheckDTO.ModuleId = this.objQeryVal.id;
            this.objStatutoryCheckDTO.MemberTypeId = mTypeId;
            this.objStatutoryCheckDTO.CarerParentId = this.CarerParentId;
            this.objStatutoryCheckDTO.CarerTypeId = mTypeId;
            this.objStatutoryCheckDTO.ChildId = this.ChildId;
            this.objStatutoryCheckDTO.ChildAge =parseInt(Common.GetSession("ChildAge"));

            if (mTypeId == 4)
                this.objStatutoryCheckDTO.CarerTypeId = 3;

            this.apiService.post("StatutoryCheck", "GetMemberName", this.objStatutoryCheckDTO).then(data => {
                //this.staCheckServices.getMemberName(this.objStatutoryCheckDTO).then(data => {
                this.MemberList = null;
                this.MemberList = data[0].StatutoryCheck;
                this.checkTypeList = data[0].ComplianceCheckTypeCnfg;
                if (this.MemberList.length == 1) {
                    this.objStatutoryCheckDTO.MemberId = this.MemberList[0].MemberId;
                }

                if (mTypeId == 1)
                    this.IsShowCopyContentDocument = data[0].IsSecondCarer;

            });
        }
    }

    ClickAddNewRecord() {

        this.tblPrimaryKey = null;
        this.uploadCtrl.fnSetPrimaryKeyId(this.tblPrimaryKey);
        this.ComplianceStatusId = null;
        this.AddNewBtnVisible = !this.AddNewBtnVisible;
        this.AddNew = !this.AddNew;
        this.BindDynamicControls();
        this.fnTab1Active();
        this.submitted = false;
        this.submittedUpload = false;
        this.uploadCtrl.fnClearQueue();
        this.IsEditRecord = false;
        this.ViewFalse();
    }

    CheckTypechange(options, CheckTypeId) {

        this.AddNewBtnVisible = false;
        this.dynamicformcontrol = null;
        this.AddNew = true;
        this.CheckTypeSelectValues = Array.apply(null, options)  // convert to real Array
            .filter(option => option.selected)
            .map(option => option.value)
        this.checkName = Array.apply(null, options)  // convert to real Array
            .filter(option => option.selected)
            .map(option => option.label)
        this.IsMandatory = true;
        this.BindDynamicControls();


        //Get SourceFieldName,TargetFieldName and RenewalDaysDifferent
        let getData = this.checkTypeList.filter(x => x.CheckTypeId == CheckTypeId);
        if (getData.length > 0) {
            this.SourceFieldName = getData[0].SourceFieldName;
            this.TargetFieldName = getData[0].TargetFieldName;
            this.RenewalDaysDifferent = getData[0].RenewalDaysDifferent;
        }

    }
    DynamicOnValChange(InsValChange: ValChangeDTO) {
        if(!this.IsEditRecord)
        {
            if (InsValChange.newValue != null && InsValChange.currnet.FieldCnfg.FieldName == this.SourceFieldName && this.RenewalDaysDifferent && this.TargetFieldName) {
                let setRenewDate = InsValChange.all.filter(x => x.FieldCnfg.FieldName == this.TargetFieldName);
                if (setRenewDate.length > 0) {

                    if (this.RenewalDaysDifferent != 0 && this.RenewalDaysDifferent != null) {
                        let currtdateYear = new Date(this.pComponent.GetDateSaveFormat(InsValChange.newValue));
                        let data: Date = new Date(currtdateYear.setDate(currtdateYear.getDate() + parseInt(this.RenewalDaysDifferent)));
                        setRenewDate[0].FieldValue = data.toISOString().split('T')[0];
                        setRenewDate[0].FieldValue = this.pComponent.GetDateEditFormat(setRenewDate[0].FieldValue);
                    }
                }
            }
        }
        if (InsValChange.currnet.FieldCnfg.FieldName == "SubscriptionIdNumber") {
            InsValChange.currnet.IsVisible = false;
        }

        if (InsValChange.currnet.FieldCnfg.FieldName == "IsSubscibeToUpdateService") {
            let SubscriptionIdNumber = InsValChange.all.filter(item => item.FieldCnfg.FieldName == "SubscriptionIdNumber");
            if (SubscriptionIdNumber.length > 0 && InsValChange.currnet.FieldValue == "1")
                SubscriptionIdNumber[0].IsVisible = true;
            else if (SubscriptionIdNumber.length > 0 && InsValChange.newValue == 2)
                SubscriptionIdNumber[0].IsVisible = false;
        }

    }

    MemberChange() {
        // alert("");
        this.CheckTypeSelectValues = [];
    }

    IsMemberActive=true;
    BindDynamicControls() {
        this.loading = true;
        this.dynamicformcontrol = [];
        if (this.objStatutoryCheckDTO.CheckTypeId != null && this.objStatutoryCheckDTO.MemberId != null) {
            this.apiService.post("StatutoryCheck", "GetDynamicControls", this.objStatutoryCheckDTO).then(data => {
                //  this.staCheckServices.getDynamicControl(this.objStatutoryCheckDTO).then(data => {
                this.dynamicformcontrol = data.AgencyFieldMapping;
                let temp = this.dynamicformcontrol.filter(x => (x.FieldCnfg.FieldDataTypeCnfg.Name == "bit" || x.FieldCnfg.FieldDataTypeCnfg.Name == "radio") && x.FieldCnfg.FieldName != "IsActive");
                temp.forEach(itemTemp => {
                    itemTemp.FieldValue = false;
                });

                this.LoadAlreadyStoreDate(data.LstCompliance);
            });

            ///Check IsMemberActive
           let checkActive=this.MemberList.filter(x=>x.MemberId==this.objStatutoryCheckDTO.MemberId);
           if(checkActive.length>0 &&  checkActive[0].IsMemberActive==false)
           {
            this.IsMemberActive=false;
           }
           else
           {
               this.IsMemberActive=true;
           }
        }
    }

    DocOk = true;
    statutorycheckSubmit(form, dynamicFormValue, dynamicFormBuilder, UploadDocIds, IsUpload, uploadFormBuilder, AddtionalEmailIds, EmailIds) {

        if (IsUpload) {
            this.submittedUpload = true;
            if (uploadFormBuilder.valid) {
                this.DocOk = true;
            }
            else
                this.DocOk = false;
        }

        if (!dynamicFormBuilder.valid) {
            this.tab1Active = "active";
            this.tab2Active = "";
            this.pComponent.GetErrorFocus(dynamicFormBuilder);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.tab1Active = "";
            this.tab2Active = "active";
            this.pComponent.GetErrorFocus(uploadFormBuilder);
        }
        else {
            this.tab1Active = "active";
            this.tab2Active = "";
        }

        this.submitted = true;
        this.IsMandatory = false;
        if (this.CheckTypeSelectValues.length > 0)
            this.IsMandatory = true;

        //  validation
        this.errorVisible = false;
        var sendDate = dynamicFormValue.filter(data => data.FieldCnfgId == 513);
        var receivedDate = dynamicFormValue.filter(data => data.FieldCnfgId == 514);
        if (sendDate.length > 0 && receivedDate.length > 0 && sendDate[0].FieldValue != null && receivedDate[0].FieldValue != null) {
            var sDate = new Date(sendDate[0].FieldValue);
            var rDate = new Date(receivedDate[0].FieldValue);

            if (sDate > rDate) {
                this.errorVisible = true;
            }
            else
                this.errorVisible = false;
        }

        //  console.log(this.objComplianceDTO);

        if (this.DocOk && form.valid && dynamicFormBuilder.valid && this.CheckTypeSelectValues.length > 0 && this.IsMandatory && !this.errorVisible) {

            this.IsLoading = true;
            this.objComplianceDTO.NotificationEmailIds = EmailIds;
            this.objComplianceDTO.NotificationAddtionalEmailIds = AddtionalEmailIds;
            this.objComplianceDTO.ComplianceCheckId = this.CheckTypeSelectValues[0];
            this.objComplianceDTO.DynamicValue = dynamicFormValue;
            this.objComplianceDTO.UserProfileId = this.objStatutoryCheckDTO.MemberId;
            let type = "save";
            if (this.ComplianceStatusId != null)
                type = "update";

            //  this.staCheckServices.post(this.objComplianceDTO, type).then(data => this.Respone(data, type, IsUpload));
            this.apiService.save("StatutoryCheck", this.objComplianceDTO, type).then(data => this.Respone(data, type, IsUpload));
        }
    }
    private Respone(data, type, IsUpload) {
      console.log(data);
        this.IsLoading = false;
        this.IsEditRecord = false;


        if (data.IsError == true) {
            this.pComponent.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {

            if (type == "save") {
                this.pComponent.alertSuccess(Common.GetSaveSuccessfullMsg);
                if (IsUpload) {

                    if (this.objComplianceDTO.IsContentCopytoSC && this.objComplianceDTO.IsDocumentCopytoSC) {
                        //  console.log(this.objComplianceDTO.IsDocumentCopytoSC);
                        this.uploadCtrl.fnUploadAllForMultiUser(data.OtherSequenceNumber);
                    }
                    else
                        this.uploadCtrl.fnUploadAll(data.SequenceNumber);


                }
                this.objUserAuditDetailDTO.ActionId =1;
                this.objUserAuditDetailDTO.RecordNo = data.SequenceNumber;
                this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
                this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
                this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
                this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
                Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);

            }
            else if (type == "update") {
                this.pComponent.alertSuccess(Common.GetUpdateSuccessfullMsg);
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.SequenceNumber);
                    ///   this.uploadCtrl.fnClearQueue();
                }
                this.objUserAuditDetailDTO.ActionId =2;
                this.objUserAuditDetailDTO.RecordNo = this.SequenceNumber;
                this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
                this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
                this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
                this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
                Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
            }
            else if (type == "delete") {
                this.pComponent.alertSuccess(Common.GetDeleteSuccessfullMsg);
                this.BindDynamicControls();
                this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.SequenceNumber;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
            }

            if (type != "delete") {
                this.ClickAddNewRecord();
                this.ComplianceStatusId = null;
                this.BindDynamicControls();
                this.fnTab1Active();
                this.submitted = false;
                this.submittedUpload = false;
            }

        }
        this.objComplianceDTO.IsContentCopytoSC = false;
        this.objComplianceDTO.IsDocumentCopytoSC = false;
    }
    resetSubmit() {
        this.objStatutoryCheckDTO = new StatutoryCheckDTO();

        this.checkTypeList = [];
        this.dynamicformcontrol = [];

    }


    //---Dynamic Grid
    LoadAlreadyStoreDate(data) {
        //  console.log(data);
        this.globalObjComplaintInfoList = [];
        if (data != null) {
            data.forEach(item => {
                this.objComplaintInfoList = [];
                item.forEach(subItem => {
                    let add: ComplaintInfo = new ComplaintInfo();
                    add.FieldCnfgId = subItem.FieldCnfgId;
                    add.FieldName = subItem.FieldName;
                    add.FieldValue = subItem.FieldValue;
                    add.FieldDataTypeName = subItem.FieldDataTypeName;
                    add.FieldValueText = subItem.FieldValueText;
                    add.UniqueID = subItem.UniqueID;
                    add.SequenceNo = subItem.SequenceNo;
                    add.DisplayName = subItem.DisplayName;
                    add.ComplianceCheckId = subItem.ComplianceCheckId;
                    add.UserProfileId = subItem.UserProfileId;
                    add.SequenceNumber = subItem.SequenceNumber;
                    add.IsDocumentExist = subItem.IsDocumentExist;
                    this.objComplaintInfoList.push(add);
                });
                this.globalObjComplaintInfoList.push(this.objComplaintInfoList);
            });

            this.dynamicHeader = this.globalObjComplaintInfoList[this.globalObjComplaintInfoList.length - 1];
            //   console.log(this.globalObjComplaintInfoList);
        }
        this.loading = false;
    }
    DeleteComplaintInfoList(index) {

        let temp = this.globalObjComplaintInfoList[index];
        //  this.staCheckServices.post(temp[0].SequenceNo, 'delete').then(data => this.Respone(data, 'delete', false));
        this.apiService.delete("StatutoryCheck", temp[0].SequenceNo).then(data => this.Respone(data, 'delete', false));
    }
    EditComplaintInfoList(index) {
        this.IsEditRecord = true;
        this.ComplianceStatusId = index;
        let tempObj = this.globalObjComplaintInfoList[index];
        // console.log("edit");
        // console.log(tempObj);
        tempObj.forEach(itemTemp => {
            // console.log(itemTemp);
            if (itemTemp.FieldName == "IsSubscibeToUpdateService") {
                let SubscriptionIdNumber = this.dynamicformcontrol.filter(item => item.FieldCnfg.FieldName == "SubscriptionIdNumber");
                if (SubscriptionIdNumber.length > 0 && itemTemp.FieldValue == "1")
                    SubscriptionIdNumber[0].IsVisible = true;
                else if (SubscriptionIdNumber.length > 0)
                    SubscriptionIdNumber[0].IsVisible = false;
            }
            //this.dynamicformcontrol.filter(item => item.FieldCnfg.FieldCnfgId == itemTemp.FieldCnfgId)[0].UniqueID = itemTemp.UniqueID;
            //if (itemTemp.FieldDataTypeName == "bit" || itemTemp.FieldDataTypeName == "radio") {
            //    if (itemTemp.FieldValue == "1")
            //        this.dynamicformcontrol.filter(item => item.FieldCnfg.FieldCnfgId == itemTemp.FieldCnfgId)[0].FieldValue = true;
            //    else
            //        this.dynamicformcontrol.filter(item => item.FieldCnfg.FieldCnfgId == itemTemp.FieldCnfgId)[0].FieldValue = false;
            //}
            //else
            //    this.dynamicformcontrol.filter(item => item.FieldCnfg.FieldCnfgId == itemTemp.FieldCnfgId)[0].FieldValue = itemTemp.FieldValue;

            let val = this.dynamicformcontrol.filter(item => item.FieldCnfg.FieldCnfgId == itemTemp.FieldCnfgId);
            if (val.length > 0) {
                switch (val[0].FieldCnfg.FieldDataTypeCnfg.Name) {
                    case "bit":
                        {
                            if (itemTemp.FieldValue == "1")
                                val[0].FieldValue = true;
                            else
                                val[0].FieldValue = false;
                            break;
                        }
                    case "radio":
                        {
                            if (itemTemp.FieldValue == "1")
                                val[0].FieldValue = true;
                            else
                                val[0].FieldValue = false;
                            break;
                        }
                    case "date":
                        {
                            val[0].FieldValue = this.pComponent.GetDateEditFormat(itemTemp.FieldValue);
                            break;
                        }
                    case "datetime":
                        {
                            val[0].FieldValue = this.pComponent.GetDateTimeEditFormat(itemTemp.FieldValue);
                            break;
                        }
                    default: {
                        val[0].FieldValue = itemTemp.FieldValue;
                    }
                }
            }
        });
        this.objComplianceDTO.SequenceNo = tempObj[0].SequenceNo;
        //Doc
        this.tblPrimaryKey = tempObj[0].SequenceNo;
        this.SequenceNumber = tempObj[0].SequenceNo;
        this.AddNewBtnVisible = true;
        this.AddNew = false;
        this.uploadCtrl.fnSetPrimaryKeyId(this.tblPrimaryKey);
        this.uploadCtrl.fnClearQueue();
        this.uploadCtrl.fnSetUserTypeId(this.userTypeCnfgId);
    }


    ViewComplaintInfoList(index) {

        this.EditComplaintInfoList(index);
        setTimeout(function () {
            var $input = $('#btnSubmit,input[type="text"],input[type="checkbox"],input[type="date"],input[type="datetime-local"],input[type="time"],input[type="radio"],input[type="number"],input[type="file"],button,Checkboxlist,select,select option,textarea');
            $input.attr("disabled", true);
        }.bind(this), 0);
        setTimeout(function () {
            var $input = $('#btnSubmit,input[type="text"],input[type="checkbox"],input[type="date"],input[type="datetime"],input[type="datetime-local"],input[type="time"],input[type="radio"],input[type="number"],input[type="file"],button,Checkboxlist,select,select option,textarea');
            $input.attr("disabled", true);
            var $input = $('ViewButton,#btnReset');
            $input.removeAttr("disabled");
        }.bind(this), 0);
        this.objUserAuditDetailDTO.ActionId =4;
        this.objUserAuditDetailDTO.RecordNo = this.SequenceNumber;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }

    ViewFalse() {

        setTimeout(function () {
            var $input = $('#btnSubmit,input[type="text"],input[type="checkbox"],input[type="date"],input[type="datetime-local"],input[type="time"],input[type="radio"],input[type="number"],input[type="file"],button,Checkboxlist,select,select option,textarea');
            $input.removeAttr("disabled");
        }.bind(this), 0);
    }

    //End
    ///tab
    tab1Active = "active";
    tab2Active = "";
    fnTab1Active() {
        this.tab1Active = "active";
        this.tab2Active = "";
    }
    fnTab2Active() {
        this.tab1Active = "";
        this.tab2Active = "active";

    }
}

export class ComplaintInfo {
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
    SequenceNumber: number;
    IsDocumentExist: boolean;
}



