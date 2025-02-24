import { APICallService } from '../services/apicallservice.service';
import { Component, Pipe, ViewChild} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Common}  from  '../common'
import { PagesComponent } from '../pages.component'
import { ChildPossessionsSavingDTO, ChildPossessionsSavingDetailsDTO } from './DTO/childpossessionssavingdto'
import { ValChangeDTO} from '../dynamic/ValChangeDTO';

@Component({
    selector: 'ChildPossessionsSavingData',
    templateUrl: './childpossessionssavingdata.component.template.html',
})

export class ChildPossessionsSavingDataComponent {
    controllerName = "ChildPossessionsSaving";
    objChildPossessionsSaving: ChildPossessionsSavingDTO = new ChildPossessionsSavingDTO();
    objChildPossessionsSavingDetailsList: ChildPossessionsSavingDetailsDTO[] = [];
    globalObjPossessionsSavingDetailsList = [];
    submitted = false;
    submittedDetails = false;
    dynamicformcontroldata = [];
    dynamicformcontroldataGrid = [];
    dynamicformcontroldataOrginal = [];
    dynamicformcontrolgrid;
    _Form: FormGroup;
    SequenceNo;
    objQeryVal;
    isLoading: boolean = false;
    ChildID;
    CarerName;
    CarerParentId;
    deletbtnAccess = false;
    constructor(private _formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private _router: Router, private module: PagesComponent, private apiService: APICallService
    ) {
        this.CarerName = Common.GetSession("CarerName");
        if (this.CarerName == "null") {
            this.CarerName = "Not Placed";
            this.CarerParentId = 0;
        }
        else this.CarerParentId = parseInt(Common.GetSession("CarerId"));
        this.route.params.subscribe(data => this.objQeryVal = data);
        if (Common.GetSession("ChildId") != null)
            this.ChildID = parseInt(Common.GetSession("ChildId"));
        this.SequenceNo = this.objQeryVal.id;
        this.objChildPossessionsSaving.ChildId = this.ChildID;
        this.objChildPossessionsSaving.ControlLoadFormat = ["Default", "List"];
        this.objChildPossessionsSaving.SequenceNo = this.SequenceNo;
        this.apiService.post(this.controllerName, "GetDynamicControls", this.objChildPossessionsSaving).then(data => {
            this.ResponseDyanmic(data);
        });
        this._Form = _formBuilder.group({
        });
        this.deletbtnAccess = this.module.GetDeletAccessPermission(252);
    }

    private ResponseDyanmic(data) {
        if (data != null) {
            this.dynamicformcontroldataOrginal = data.DynamicFormControls;
            this.dynamicformcontroldata = data.DynamicFormControls;
            this.dynamicformcontroldataGrid = this.dynamicformcontroldata.filter(item => item.ControlLoadFormat == 'List');
            this.LoadAlreadyStoreDate(data.LstChildPossessionsSavingDetails);
        }
    }

    clicksubmitdata(_Form, dynamicValA, dynamicFormA) {
        this.submitted = true;

        if (!dynamicFormA.valid) {
            this.module.GetErrorFocus(dynamicFormA);
        }

        if (dynamicFormA.valid) {
            this.isLoading = true;
            let type = "save";
            if (this.SequenceNo > 0)
                type = "update";
            let val1 = dynamicValA.filter(x => x.FieldName == "CarerParentId");
            if (val1.length > 0 && (val1[0].FieldValue == null || val1[0].FieldValue == ''))
                val1[0].FieldValue = this.CarerParentId;

            this.objChildPossessionsSaving.LstChildPossessionsSavingDetails = this.globalObjPossessionsSavingDetailsList;
            this.objChildPossessionsSaving.DynamicValue = dynamicValA;
            this.objChildPossessionsSaving.ChildId = this.ChildID;
            this.apiService.save(this.controllerName, this.objChildPossessionsSaving, type).then(data => this.Respone(data, type));
        }
    }

    DynamicOnValChange(InsValChange: ValChangeDTO) {
        if (InsValChange.currnet.FieldCnfg.FieldName == "CarerParentId") {
            InsValChange.currnet.IsVisible = false;
        }
    }
    private Respone(data, type) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (type == "save") {
                this.module.alertSuccess(Common.GetSaveSuccessfullMsg);
            }
            else {
                this.module.alertSuccess(Common.GetUpdateSuccessfullMsg);
            }
            this._router.navigate(['/pages/child/possessionssavinglist/4']);
        }
    }


    //---Dynamic Grid
    objChildPossessionsSavingDetailsListInsert = [];
    LoadAlreadyStoreDate(data) {
        if (data != null) {
            data.forEach(item => {
                this.objChildPossessionsSavingDetailsList = [];
                item.forEach(subItem => {
                    let add: ChildPossessionsSavingDetailsDTO = new ChildPossessionsSavingDetailsDTO();
                    add.FieldCnfgId = subItem.FieldCnfgId;
                    add.FieldName = subItem.FieldName;
                    add.FieldValue = subItem.FieldValue;
                    add.FieldDataTypeName = subItem.FieldDataTypeName;
                    add.FieldValueText = subItem.FieldValueText;
                    add.UniqueID = subItem.UniqueID;
                    add.SequenceNo = subItem.SequenceNo;
                    add.StatusId = 4;
                    this.objChildPossessionsSavingDetailsList.push(add);
                    this.objChildPossessionsSavingDetailsListInsert.push(add);
                });
                this.globalObjPossessionsSavingDetailsList.push(this.objChildPossessionsSavingDetailsList);
            });
        }
        //console.log(this.globalObjPossessionsSavingDetailsList);
    }

    AddDetails(dynamicVal, dynamicForm) {
        this.objChildPossessionsSavingDetailsList = [];

        if (dynamicForm.valid) {
            dynamicVal.forEach(item => {
                let add: ChildPossessionsSavingDetailsDTO = new ChildPossessionsSavingDetailsDTO();
                add.FieldCnfgId = item.FieldCnfgId;
                add.FieldName = item.FieldName;
                add.FieldValue = item.FieldValue;
                add.FieldDataTypeName = item.FieldDataTypeName;
                add.FieldValueText = item.FieldValueText;
                add.StatusId = 1;
                add.UniqueID = 0;
                this.objChildPossessionsSavingDetailsList.push(add);
                this.objChildPossessionsSavingDetailsListInsert.push(add);
            })
            this.globalObjPossessionsSavingDetailsList.push(this.objChildPossessionsSavingDetailsList);
            this.submittedDetails = false;

            this.dynamicformcontroldataGrid.forEach(itemTemp => {
                this.dynamicformcontroldataGrid.filter(item => item.FieldValue = null);
            });
        }
        else
            this.submittedDetails = true;
    }

    EditDetails(index) {
        this.DetailsId = index;
        this.isEdit = true;
        let tempObj = this.globalObjPossessionsSavingDetailsList[index];
        tempObj.forEach(itemTemp => {
            this.dynamicformcontroldataGrid.filter(item => item.FieldCnfg.FieldCnfgId == itemTemp.FieldCnfgId)[0].FieldValue = itemTemp.FieldValue;
        });
    }

    DeleteDetails(index) {
        let temp = this.globalObjPossessionsSavingDetailsList[index];
        temp.forEach(item => {
            item.StatusId = 3;
        });
    }

    UpdateDetails(dynamicVal, dynamicForm) {

        if (dynamicForm.valid) {
            this.isEdit = false;
            let temp = this.globalObjPossessionsSavingDetailsList[this.DetailsId];
            temp.forEach(item => {
                item.FieldValue = dynamicVal.filter(subItem => subItem.FieldCnfgId == item.FieldCnfgId)[0].FieldValue;
                item.FieldValueText = dynamicVal.filter(subItem => subItem.FieldCnfgId == item.FieldCnfgId)[0].FieldValueText;
                item.StatusId = 2;
            });

            this.dynamicformcontroldataGrid.forEach(itemTemp => {
                this.dynamicformcontroldataGrid.filter(item => item.FieldValue = null);

            });
            this.submittedDetails = false;
        }
        else
            this.submittedDetails = true;
        this.DetailsId = null;
    }

    CancelEdit() {
        this.isEdit = false;
        this.DetailsId = null;
        this.dynamicformcontroldataGrid.forEach(itemTemp => {
            this.dynamicformcontroldataGrid.filter(item => item.FieldValue = null);
        });
    }

    isEdit = false;
    DetailsId;

    //---End
}
