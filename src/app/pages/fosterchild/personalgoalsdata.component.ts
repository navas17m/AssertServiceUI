import { APICallService } from '../services/apicallservice.service';
import { Component, Pipe, ViewChild} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Common}  from  '../common'
import { PagesComponent } from '../pages.component'
import { ChildPersonalGoalComboDTO, ChildPersonalGoalDTO, PersonalGoalStatusDTO} from './DTO/personalgoalsdto';
import { ValChangeDTO} from '../dynamic/ValChangeDTO';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component({
    selector: 'personalgoalsdata',
    templateUrl: './personalgoalsdata.component.template.html',
//     styles: [`[required]  {
//         border-left: 5px solid blue;
//     }

//    .ng-valid[required], .ng-valid.required  {
//             border-left: 5px solid #42A948; /* green */
// }
//    label + .ng-invalid:not(form)  {
//         border-left: 5px solid #a94442; /* red */
// }`],
})

export class ChildPersonalGoalsDataComponent {
    controllerName = "ChildPersonalGoal";
    objPersonalGoalStatuList: PersonalGoalStatusDTO[] = [];
    globalObjAtteStatusList = [];
    ngxList =[];
    insChildPersonalGoalComboDTO: ChildPersonalGoalComboDTO = new ChildPersonalGoalComboDTO();
    submitted = false;
    submittedStatus = false;
    coursedatesubmitted = false;
    dynamicformcontroldata = [];
    dynamicformcontroldataSub = [];
    dynamicformcontroldataOrginal = [];
    dynamicformcontrolgrid;
    _Form: FormGroup;
    isVisibleMandatoryMsg;
    SequenceNo;
    objQeryVal;
    AttendedDateValid = false;
    ChildID: number;
    subColumns=[{prop:'FromDate', name:'From Date'},
                {prop:'ToDate', name:'To Date'},
                {prop:'GoalAchievedDays', name:'Goal Achieve Days'}
            ];
    AgencyProfileId: number;
    lstcarerIdsSelectValues = [];
    isLoading: boolean = false;
    deletbtnAccess = false;
    footerMessage={
      'emptyMessage': `<div align=center><strong>No records found.</strong></div>`,
      'totalMessage': ' - Records'
    };
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=216;
    constructor(private _formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private _router: Router, private module: PagesComponent,
        private apiService: APICallService) {
        this._Form = _formBuilder.group({
        });
        this.route.params.subscribe(data => this.objQeryVal = data);
        this.ChildID = parseInt(Common.GetSession("ChildId"));

        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.insChildPersonalGoalComboDTO.AgencyProfileId = this.AgencyProfileId;
        this.insChildPersonalGoalComboDTO.ChildId = this.ChildID;
        this.insChildPersonalGoalComboDTO.ControlLoadFormat = ["Default", "Sub", "Comments"];
        this.SequenceNo = this.objQeryVal.id;

        if (this.SequenceNo != 0 && this.SequenceNo != null) {
            this.insChildPersonalGoalComboDTO.SequenceNo = this.SequenceNo;
        } else {
            this.insChildPersonalGoalComboDTO.SequenceNo = 0;
        }

        this.apiService.post(this.controllerName, "GetDynamicControls", this.insChildPersonalGoalComboDTO).then(data => {
            this.ResponseTrainingProfileDataDyanmic(data);
        });
        this.deletbtnAccess = this.module.GetDeletAccessPermission(216);

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

    private ResponseTrainingProfileDataDyanmic(data) {
        if (data != null) {
            this.dynamicformcontroldataOrginal = data.LstDinamiControl;
            this.dynamicformcontroldata = data.LstDinamiControl;
            this.dynamicformcontroldataSub = this.dynamicformcontroldata.filter(item => item.ControlLoadFormat == 'Sub');
            this.LoadAlreadyStoreDate(data.lstChildPersonalGoalSubInfoDTO);
        }
    }

    IsOk = true;
    clicksubmitdata(_Form, dynamicValA, dynamicFormA, dynamicValC, dynamicFormC) {
        this.submitted = true;
        this.IsOk = true;

        //check Date and days count
        //let AttendedDatecount = this.objPersonalGoalListInsert.filter(x => x.StatusId != 3);
        //if (AttendedDatecount.length > 0) {
        //    this.AttendedDateValid = false;
        //}
        //else
        //    this.AttendedDateValid = true;

        if (!dynamicFormA.valid || !dynamicFormC.valid) {
            this.module.GetErrorFocus(dynamicFormA);
        }
        //&& AttendedDatecount.length > 0
        if (this.IsOk && _Form.valid && dynamicFormA.valid && dynamicFormC.valid) {
            this.isLoading = true;

            dynamicValC.forEach(item => {
                dynamicValA.push(item);
            });
            let type = "save";
            if (this.SequenceNo > 0)
                type = "update";

            this.insChildPersonalGoalComboDTO.lstChildPersonalGoalSubInfoDTO = this.globalObjAtteStatusList;
            this.insChildPersonalGoalComboDTO.DynamicValue = dynamicValA;
            this.insChildPersonalGoalComboDTO.ChildId = this.ChildID;
            this.apiService.save(this.controllerName, this.insChildPersonalGoalComboDTO, type).then(data => this.Respone(data, type));
        }
    }

    private Respone(data, type) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (type == "save") {
                this.objUserAuditDetailDTO.ActionId =1;
                this.objUserAuditDetailDTO.RecordNo = data.SequenceNumber;
                this.module.alertSuccess(Common.GetSaveSuccessfullMsg);
            }
            else {
                this.objUserAuditDetailDTO.ActionId =2;
                this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
                this.module.alertSuccess(Common.GetUpdateSuccessfullMsg);
            }

            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
            this._router.navigate(['/pages/child/personalgoalslist/4']);
        }
    }

    DynamicOnValChange(InsValChange: ValChangeDTO, dynamicValA) {
        if (InsValChange.currnet.FieldCnfg.FieldName == "FromDate") {

            let valMonthWeek = null;
            let insMothWeek = dynamicValA.filter(x => x.FieldName == "WeekorMonth");
            if (insMothWeek.length > 0)
                valMonthWeek = insMothWeek[0].FieldValueText;

            let valFromDate = InsValChange.all.find(x => x.FieldCnfg.FieldName == "FromDate").FieldValue;
            let valToDate = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "ToDate");

            if (valFromDate != null && valMonthWeek != null) {
                let days = 7;
                if (valMonthWeek == "Month")
                    days = 30;
                else if (valMonthWeek == "Quarter")
                    days = 90;

                let date = new Date(this.module.GetDateSaveFormat(valFromDate));
                date.setDate(date.getDate() + days);
                if (valToDate.length > 0) {
                    //let dt = new Date(date);
                    valToDate[0].FieldValue = this.module.GetDateEditFormat(moment(date).format("YYYY-MM-DD"));

                }
            }
        }

        if (InsValChange.currnet.FieldCnfg.FieldName == "GoalAchievedDays") {

            let valMonthWeek = null;
            let insMothWeek = dynamicValA.filter(x => x.FieldName == "WeekorMonth");
            if (insMothWeek.length > 0)
                valMonthWeek = insMothWeek[0].FieldValueText;

            let valGoalAchievedDays = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "GoalAchievedDays");
            if (valMonthWeek != null && valMonthWeek == "Week" && valGoalAchievedDays.length > 0 && valGoalAchievedDays[0].FieldValue != null) {
                if (parseInt(valGoalAchievedDays[0].FieldValue) > 7) {
                    valGoalAchievedDays[0].FieldValue = null;
                    this.module.alertInfo("Goal Achieved Days should not be greater than 7 days");
                }
            }
            else if (valMonthWeek != null && valMonthWeek == "Month" && valGoalAchievedDays.length > 0 && valGoalAchievedDays[0].FieldValue != null) {
                if (parseInt(valGoalAchievedDays[0].FieldValue) > 30) {
                    valGoalAchievedDays[0].FieldValue = null;
                    this.module.alertInfo("Goal Achieved Days should not be greater than 30 days");
                }
            }
            else if (valMonthWeek != null && valMonthWeek == "Quarter" && valGoalAchievedDays.length > 0 && valGoalAchievedDays[0].FieldValue != null) {
                if (parseInt(valGoalAchievedDays[0].FieldValue) > 90) {
                    valGoalAchievedDays[0].FieldValue = null;
                    this.module.alertInfo("Goal Achieved Days should not be greater than 90 days");
                }
            }
        }
    }


    //---Dynamic Grid
    objPersonalGoalListInsert = [];
    LoadAlreadyStoreDate(data) {

        if (data != null) {
            data.forEach(item => {
                this.objPersonalGoalStatuList = [];
                item.forEach(subItem => {
                    let add: PersonalGoalStatusDTO = new PersonalGoalStatusDTO();
                    add.FieldCnfgId = subItem.FieldCnfgId;
                    add.FieldName = subItem.FieldName;
                    add.FieldValue = subItem.FieldValue;
                    add.FieldDataTypeName = subItem.FieldDataTypeName;
                    add.FieldValueText = subItem.FieldValueText;
                    add.UniqueID = subItem.UniqueID;
                    add.SequenceNo = subItem.SequenceNo;
                    add.StatusId = 4;
                    this.objPersonalGoalStatuList.push(add);
                    this.objPersonalGoalListInsert.push(add);
                });
                this.globalObjAtteStatusList.push(this.objPersonalGoalStatuList);
            });
        }
        this.convertToGridData(this.globalObjAtteStatusList);

    }
    convertToGridData(objInput){
        this.ngxList = [];
        objInput.forEach(item =>{
            let temp:any= {};
            item.forEach(subitem => {
            temp.StatusId = subitem.StatusId;
            if(subitem.FieldName==="FromDate")
                temp.FromDate = moment(subitem.FieldValue).format("DD/MM/YYYY");
            else if (subitem.FieldName ==="ToDate")
                temp.ToDate = moment(subitem.FieldValue).format("DD/MM/YYYY");
            else if (subitem.FieldName ==="GoalAchievedDays")
                temp.GoalAchievedDays=subitem.FieldValue;

            });
            this.ngxList.push(temp);
        });
        this.ngxList = [...this.ngxList];
    }
    AddAttendedDetails(dynamicVal, dynamicForm) {
        this.objPersonalGoalStatuList = [];

        if (dynamicForm.valid) {
            dynamicVal.forEach(item => {
                let add: PersonalGoalStatusDTO = new PersonalGoalStatusDTO();
                add.FieldCnfgId = item.FieldCnfgId;
                add.FieldName = item.FieldName;
                add.FieldValue = item.FieldValue;
                add.FieldDataTypeName = item.FieldDataTypeName;
                add.FieldValueText = item.FieldValueText;
                add.StatusId = 1;
                add.UniqueID = 0;
                this.objPersonalGoalStatuList.push(add);
                this.objPersonalGoalListInsert.push(add);
                this.AttendedDateValid = false;

            })
            //  console.log(this.objPersonalGoalStatuList);
            this.globalObjAtteStatusList.push(this.objPersonalGoalStatuList);
            this.submittedStatus = false;
            this.convertToGridData(this.globalObjAtteStatusList);
            this.dynamicformcontroldataSub.forEach(itemTemp => {
                this.dynamicformcontroldataSub.filter(item => item.FieldValue = null);

            });
        }
        else
            this.submittedStatus = true;
    }

    EditAttendedStatusList(index) {
        this.AttendedStatusId = index;
        this.isEdit = true;
        let tempObj = this.globalObjAtteStatusList[index];
        tempObj.forEach(itemTemp => {
            let val = this.dynamicformcontroldataSub.filter(item => item.FieldCnfg.FieldCnfgId == itemTemp.FieldCnfgId);
            if (val.length > 0) {
                switch (val[0].FieldCnfg.FieldDataTypeCnfg.Name) {
                    case "date":
                        {
                            val[0].FieldValue = this.module.GetDateEditFormat(itemTemp.FieldValue);
                            break;
                        }
                    case "datetime":
                        {
                            val[0].FieldValue = this.module.GetDateTimeEditFormat(itemTemp.FieldValue);
                            break;
                        }
                    default: {
                        val[0].FieldValue = itemTemp.FieldValue;
                    }
                }
            }
        });
    }

    DeleteAttendedStatusList(index) {
        let temp = this.globalObjAtteStatusList[index];
        temp.forEach(item => {
            item.StatusId = 3;
        });
        this.ngxList[index].StatusId =3;
        this.ngxList=[...this.ngxList];
    }

    UpdateAttendedDetails(dynamicVal, dynamicForm) {

        if (dynamicForm.valid) {
            this.isEdit = false;
            let temp = this.globalObjAtteStatusList[this.AttendedStatusId];
            temp.forEach(item => {
                item.FieldValue = dynamicVal.filter(subItem => subItem.FieldCnfgId == item.FieldCnfgId)[0].FieldValue;
                item.FieldValueText = dynamicVal.filter(subItem => subItem.FieldCnfgId == item.FieldCnfgId)[0].FieldValueText;
                item.StatusId = 2;
            });
            this.convertToGridData(this.globalObjAtteStatusList);
            this.dynamicformcontroldataSub.forEach(itemTemp => {
                this.dynamicformcontroldataSub.filter(item => item.FieldValue = null);

            });
            this.submittedStatus = false;

        }
        else
            this.submittedStatus = true;
        this.AttendedStatusId = null;
    }

    CancelEdit() {
        this.isEdit = false;
        this.AttendedStatusId = null;
        this.dynamicformcontroldataSub.forEach(itemTemp => {
            this.dynamicformcontroldataSub.filter(item => item.FieldValue = null);

        });
    }

    isEdit = false;
    AttendedStatusId;

    //---End
}
