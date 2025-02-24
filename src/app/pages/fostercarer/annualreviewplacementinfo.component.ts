
import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TrainingAttendedStatusDTO } from '../recruitment/DTO/trainingattendedstatus';

@Component({
    selector: 'AnnualReviewPlacementInfo',
    templateUrl: './annualreviewplacementinfo.component.template.html',
    providers: [],
    styles: [`[required]  {
        border-left: 5px solid blue;
    }

    .ng-valid[required], .ng-valid.required  {
            border-left: 5px solid #42A948; /* green */
}
    label + .ng-invalid:not(form)  {
        border-left: 5px solid #a94442; /* red */
}`]
})

export class AnnualReviewPlacementInfoComponent {
    globalObjAtteStatusList = [];
    objAttendedStatusList: TrainingAttendedStatusDTO[] = [];
    submittedStatus = false;
    dynamicformcontroldataGrid;
    AttendedDateValid:boolean;
    _Form:FormGroup;
    @Input()
    set PlacementInfo(pInfo: any[]) {
        if (pInfo != null) {
            this.dynamicformcontroldataGrid = pInfo;
        }
    }
    get PlacementInfo(): any[] {

        return;//this.objAnnualReviewApprovalRecomRefList;
    }

    @Input()
    set PlacementInfoGrid(pInfo) {
        if (pInfo != null) {
            this.LoadAlreadyStoreDate(pInfo);
        }
    }

    //---Dynamic Grid
    objAttendedStatusListInsert = [];
    LoadAlreadyStoreDate(data) {
        if (data != null) {
            data.forEach(item => {
                this.objAttendedStatusList = [];
                item.forEach(subItem => {
                    let add: TrainingAttendedStatusDTO = new TrainingAttendedStatusDTO();
                    add.FieldCnfgId = subItem.FieldCnfgId;
                    add.FieldName = subItem.FieldName;
                    add.FieldValue = subItem.FieldValue;
                    add.FieldDataTypeName = subItem.FieldDataTypeName;
                    add.FieldValueText = subItem.FieldValueText;
                    add.UniqueID = subItem.UniqueID;
                    add.SequenceNo = subItem.SequenceNo;
                    add.StatusId = 4;
                    this.objAttendedStatusList.push(add);
                    this.objAttendedStatusListInsert.push(add);
                });
                this.globalObjAtteStatusList.push(this.objAttendedStatusList);
            });
        }
    }

    AddAttendedDetails(dynamicVal, dynamicForm) {
        this.objAttendedStatusList = [];
        this.submittedStatus = true;
        if (dynamicForm.valid) {
            dynamicVal.forEach(item => {
                let add: TrainingAttendedStatusDTO = new TrainingAttendedStatusDTO();
                add.FieldCnfgId = item.FieldCnfgId;
                add.FieldName = item.FieldName;
                add.FieldValue = item.FieldValue;
                add.FieldDataTypeName = item.FieldDataTypeName;
                add.FieldValueText = item.FieldValueText;
                add.StatusId = 1;
                add.UniqueID = 0;
                this.objAttendedStatusList.push(add);
                this.objAttendedStatusListInsert.push(add);
            })
            this.globalObjAtteStatusList.push(this.objAttendedStatusList);
            this.submittedStatus = false;
        }
    }

    EditAttendedStatusList(index) {
        this.AttendedStatusId = index;
        this.isEdit = true;
        let tempObj = this.globalObjAtteStatusList[index];
        tempObj.forEach(itemTemp => {
            this.dynamicformcontroldataGrid.filter(item => item.FieldCnfg.FieldCnfgId == itemTemp.FieldCnfgId)[0].FieldValue = itemTemp.FieldValue;
        });
    }

    DeleteAttendedStatusList(index) {
        let temp = this.globalObjAtteStatusList[index];
        temp.forEach(item => {
            item.StatusId = 3;
        });

    }

    UpdateAttendedDetails(dynamicVal, dynamicForm) {
        this.submittedStatus = true;
        if (dynamicForm.valid) {
            this.isEdit = false;
            let temp = this.globalObjAtteStatusList[this.AttendedStatusId];
            temp.forEach(item => {
                item.FieldValue = dynamicVal.filter(subItem => subItem.FieldCnfgId == item.FieldCnfgId)[0].FieldValue;
                item.FieldValueText = dynamicVal.filter(subItem => subItem.FieldCnfgId == item.FieldCnfgId)[0].FieldValueText;
                item.StatusId = 2;
            });
        }
        this.AttendedStatusId = null;
    }

    CancelEdit() {
        this.isEdit = false;
        this.AttendedStatusId = null;
    }
    isEdit = false;
    AttendedStatusId;

    //---End
}
