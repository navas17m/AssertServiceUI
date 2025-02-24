import { Component, Pipe, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Common }  from  '../common'
import { ChildEducationGradeInfo } from './DTO/childeducationgradeinfo'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { ValChangeDTO} from '../dynamic/ValChangeDTO'
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component({
    selector: 'childeducationgradeinfo',
    templateUrl: './childeducationgradeinfo.component.template.html',
})

export class ChildEducationGradeInfoComponent {
    controllerName = "ChildEducationGradeInfo";
    objChildEducationGradeInfo: ChildEducationGradeInfo = new ChildEducationGradeInfo();
    submitted = false; submittedUpload = false;
    dynamicformcontrol = [];
    dynamicformcontrolDefa1 = [];
    dynamicformcontrolDefa2 = [];
    dynamicformcontrolSubInfo = [];
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
    deletbtnAccess = false;
    GradeTabActive = "active";
    DocumentActive;
    isLoading: boolean = false;
    ngxList = [];
    subColumns=[{prop:'Subject', name:'Subject'},
                {prop:'Teacher', name:'Teacher'},
                {prop:'Target', name:'Target'},
                {prop:'CurrentLevel', name:'Current Level'}
            ];
    footerMessage={
      'emptyMessage': `<div align=center><strong>No records found.</strong></div>`,
      'totalMessage': ' - Records'
    };
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
     FormCnfgId=107;
    constructor(private _formBuilder: FormBuilder,
        private route: ActivatedRoute, private _router: Router,
        private modal: PagesComponent, private apiService: APICallService) {
        if (Common.GetSession("ChildId") != null)
            this.ChildID = parseInt(Common.GetSession("ChildId"));
        this.route.params.subscribe(data => this.objQeryVal = data);
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objChildEducationGradeInfo.AgencyProfileId = this.AgencyProfileId;
        this.objChildEducationGradeInfo.ChildId = this.ChildID;
        this.SequenceNo = this.objQeryVal.Id;
        if (this.SequenceNo != 0 && this.SequenceNo != null) {
            this.objChildEducationGradeInfo.SequenceNo = this.SequenceNo;
            this.tblPrimaryKey = this.SequenceNo;
        } else {
            this.objChildEducationGradeInfo.SequenceNo = 0;
        }
        this.objChildEducationGradeInfo.ControlLoadFormat = ["Main", "Default1", "Default2", "SubInfo"];
        this.apiService.post(this.controllerName, "GetDynamicControls", this.objChildEducationGradeInfo).then(data => {
            this.dynamicformcontrol = data.listDynamicControls.filter(item => item.ControlLoadFormat == 'Main');
            this.dynamicformcontrolDefa1 = data.listDynamicControls.filter(item => item.ControlLoadFormat == 'Default1');
            this.dynamicformcontrolDefa2 = data.listDynamicControls.filter(item => item.ControlLoadFormat == 'Default2');
            this.dynamicformcontrolSubInfo = data.listDynamicControls.filter(item => item.ControlLoadFormat == 'SubInfo');

            this.LoadAlreadyStoreDate(data.listChildEducationGradeSubInfo);
        });

        this._Form = _formBuilder.group({});
        //Doc
        this.TypeId = this.ChildID;
        this.formId = 107;
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

    fnGradeTab() {
        this.GradeTabActive = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetailTab() {
        this.GradeTabActive = "";
        this.DocumentActive = "active";
    }

    isDocValid = true;
    isValid = true;
    clicksubmit(mainFormBuilder, dynamicFormMain, dynamicformbuilderMain,
        dynamicFormDefa1, dynamicformbuilderDefa1,
        dynamicFormDefa2, dynamicformbuilderDefa2,
        UploadDocIds, IsUpload, uploadFormBuilder) {
        this.submitted = true;
        this.submittedUpload = true;
        this.isDocValid = true;
        this.isValid = true;

        if (!mainFormBuilder.valid) {
            this.GradeTabActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(mainFormBuilder);
        } else if (!dynamicformbuilderMain.valid) {
            this.GradeTabActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(dynamicformbuilderMain);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.isDocValid = false;
            this.GradeTabActive = "";
            this.DocumentActive = "active";
            this.modal.GetErrorFocus(uploadFormBuilder);
        }
        else {
            this.GradeTabActive = "active";
            this.DocumentActive = "";
        }

        if (this.hiddenSubInfo == false) {
            if (!dynamicformbuilderDefa2.valid) {
                this.isValid = false;
                this.modal.GetErrorFocus(dynamicformbuilderDefa2);
            }
            this.objChildEducationGradeInfo.listChildEducationGradeSubInfo = this.globalObjGradeSubInfoList;
        } else {
            if (!dynamicformbuilderDefa1.valid) {
                this.isValid = false;
                this.modal.GetErrorFocus(dynamicformbuilderDefa1);
            }
            this.objChildEducationGradeInfo.listChildEducationGradeSubInfo = [];
        }

        if (mainFormBuilder.valid && this.isDocValid && this.isValid) {

            dynamicFormDefa1.forEach(item => {
                dynamicFormMain.push(item);
            });

            dynamicFormDefa2.forEach(item => {
                dynamicFormMain.push(item);
            });

            this.isLoading = true;
            let type = "save";
            if (this.SequenceNo > 0)
                type = "update";
            this.objChildEducationGradeInfo.DynamicValue = dynamicFormMain;
            this.objChildEducationGradeInfo.ChildId = this.ChildID;
            this.apiService.save(this.controllerName, this.objChildEducationGradeInfo, type).then(data => this.Respone(data, type, IsUpload));
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
            this._router.navigate(['/pages/child/childeducationgradeinfolist/18']);
        }
    }

    hiddenSubInfo = false;
    DynamicOnValChange(InsValChange: ValChangeDTO) {

        // let val1 = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "SchoolYearId");
        if (InsValChange.currnet.FieldCnfg.FieldName == "SchoolYearId") {
            let val = InsValChange.currnet.ConfigTableValues.filter(x => x.CofigTableValuesId == InsValChange.newValue);
            if (val.length > 0) {
                if (val[0].Value == "Year 11" || val[0].Value == "Year 12" || val[0].Value == "Year 13") {
                    this.hiddenSubInfo = true;

                }
                else
                    this.hiddenSubInfo = false;
            }
        }
    }
    convertToGridData(objInput){
        this.ngxList = [];
        objInput.forEach(item =>{
            let temp:any= {};
            item.forEach(subitem => {
            temp.StatusId = subitem.StatusId;
            if(subitem.FieldName == "Subject ")
                temp.Subject = subitem.FieldValue;
            else if (subitem.FieldName ==="Teacher")
                temp.Teacher = subitem.FieldValue;
            else if (subitem.FieldName ==="Target")
                temp.Target=subitem.FieldValue;
            else if (subitem.FieldName ==="CurrentLevel")
                temp.CurrentLevel=subitem.FieldValue;
            });
            this.ngxList.push(temp);
        });
        this.ngxList = [...this.ngxList];
    }
    //---Dynamic Grid
    globalObjGradeSubInfoList = [];
    objChildEduGradeSubInfoListInsert = [];
    objChildEduGradeSubInfoList: ChildEducationGradeSubInfoDTO[] = [];
    submittedSubInfo = false;
    LoadAlreadyStoreDate(data) {

        if (data != null) {
            data.forEach(item => {
                this.objChildEduGradeSubInfoList = [];
                item.forEach(subItem => {
                    let add: ChildEducationGradeSubInfoDTO = new ChildEducationGradeSubInfoDTO();
                    add.FieldCnfgId = subItem.FieldCnfgId;
                    add.FieldName = subItem.FieldName;
                    add.FieldValue = subItem.FieldValue;
                    add.FieldDataTypeName = subItem.FieldDataTypeName;
                    add.FieldValueText = subItem.FieldValueText;
                    add.UniqueID = subItem.UniqueID;
                    add.SequenceNo = subItem.SequenceNo;
                    add.StatusId = 4;
                    this.objChildEduGradeSubInfoList.push(add);
                    this.objChildEduGradeSubInfoListInsert.push(add);
                });
                this.globalObjGradeSubInfoList.push(this.objChildEduGradeSubInfoList);
            });
        }
        this.convertToGridData(this.globalObjGradeSubInfoList);

    }

    Add(dynamicVal, dynamicForm) {
        this.objChildEduGradeSubInfoList = [];

        if (dynamicForm.valid) {
            dynamicVal.forEach(item => {
                let add: ChildEducationGradeSubInfoDTO = new ChildEducationGradeSubInfoDTO();
                add.FieldCnfgId = item.FieldCnfgId;
                add.FieldName = item.FieldName;
                add.FieldValue = item.FieldValue;
                add.FieldDataTypeName = item.FieldDataTypeName;
                add.FieldValueText = item.FieldValueText;
                add.StatusId = 1;
                add.UniqueID = 0;
                this.objChildEduGradeSubInfoList.push(add);
                this.objChildEduGradeSubInfoListInsert.push(add);
            })
            this.globalObjGradeSubInfoList.push(this.objChildEduGradeSubInfoList);
            this.convertToGridData(this.globalObjGradeSubInfoList);
            this.submittedSubInfo = false;

            this.dynamicformcontrolSubInfo.forEach(itemTemp => {
                this.dynamicformcontrolSubInfo.filter(item => item.FieldValue = null);

            });
        }
        else
            this.submittedSubInfo = true;
    }

    Edit(index) {
        this.GradeSubInfoId = index;
        this.isEdit = true;
        let tempObj = this.globalObjGradeSubInfoList[index];
        tempObj.forEach(itemTemp => {
            this.dynamicformcontrolSubInfo.filter(item => item.FieldCnfg.FieldCnfgId == itemTemp.FieldCnfgId)[0].FieldValue = itemTemp.FieldValue;
        });
        //  this.dynamicformcontroldata = this.dynamicformcontroldataOrginal;
    }

    Delete(index) {
        let temp = this.globalObjGradeSubInfoList[index];
        temp.forEach(item => {
            item.StatusId = 3;
        });
        this.ngxList[index].StatusId =3;
        this.ngxList=[...this.ngxList];
    }

    Update(dynamicVal, dynamicForm) {

        if (dynamicForm.valid) {
            this.isEdit = false;
            let temp = this.globalObjGradeSubInfoList[this.GradeSubInfoId];
            temp.forEach(item => {
                item.FieldValue = dynamicVal.filter(subItem => subItem.FieldCnfgId == item.FieldCnfgId)[0].FieldValue;
                item.FieldValueText = dynamicVal.filter(subItem => subItem.FieldCnfgId == item.FieldCnfgId)[0].FieldValueText;
                item.StatusId = 2;
            });
            this.convertToGridData(this.globalObjGradeSubInfoList);
            this.dynamicformcontrolSubInfo.forEach(itemTemp => {
                this.dynamicformcontrolSubInfo.filter(item => item.FieldValue = null);
            });
            this.submittedSubInfo = false;
        }
        else
            this.submittedSubInfo = true;
        this.GradeSubInfoId = null;
    }

    Cancel() {
        this.isEdit = false;
        this.GradeSubInfoId = null;
        this.dynamicformcontrolSubInfo.forEach(itemTemp => {
            this.dynamicformcontrolSubInfo.filter(item => item.FieldValue = null);

        });
    }

    isEdit = false;
    GradeSubInfoId;

    //---End
}


export class ChildEducationGradeSubInfoDTO {
    FieldCnfgId: number;
    FieldName: string;
    FieldValue: string;
    SequenceNo: number;
    FieldDataTypeName: string;
    FieldValueText: string;
    StatusId: number;
    UniqueID: number;
    GradeSubInfoId: string;
    DisplayName: string;
    ChildId: number;
}

