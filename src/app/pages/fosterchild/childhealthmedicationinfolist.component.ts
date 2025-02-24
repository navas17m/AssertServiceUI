import { Component} from '@angular/core';
import { Router } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { ChildHealthMedicationInfo } from './DTO/childhealthmedicationinfo'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component
    ({
    selector: 'childhealthmedicationinfolist',
    templateUrl: './childhealthmedicationinfolist.component.template.html',
    })

export class ChildHealthMedicationInfoListComponent {
    public searchText: string = "";
    lstChildHealthMedicationInfo = [];
    childHealthMedicationInfoList = [];
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'Prescription Issue Date',prop:'PrescriptionIssueDate',sortable:true,width:'180',datetime:'Y'},
        {name:'Non-prescribed Medication Issue Date',prop:'NonPrescribedMedicationIssueDate',sortable:true,width:'220',datetime:'Y'},
        {name:'Name of Medication',prop:'NameoftheMedication',sortable:false,width:'200'},
        {name:'Edit',prop:'Edit',sortable:false,width:'100'},
        {name:'View',prop:'View',sortable:false,width:'100'},
        {name:'Delete',prop:'Delete',sortable:false,width:'100'}
       ];
    ChildID: number;
    objChildHealthMedicationInfo: ChildHealthMedicationInfo = new ChildHealthMedicationInfo();
    returnVal; controllerName = "ChildHealthMedicationInfo";
    isDefaultSortOrderVal: string;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
     FormCnfgId=117;
    constructor(private apiService: APICallService, private _router: Router, private modal: PagesComponent)
    {
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));;
            this.bindChildHealthMedicationInfo();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/childhealthmedicationinfolist/19");
            this._router.navigate(['/pages/referral/childprofilelist/1/19']);
        }
        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }

    private bindChildHealthMedicationInfo() {
         this.apiService.get(this.controllerName,"GetListByChildId",this.ChildID).then(data =>{
             this.childHealthMedicationInfoList = data;
         });        
    }

    fnAddData() {
        this._router.navigate(['/pages/child/childhealthmedicationinfo/0/19']);
    }

    editChildHealthMedicationInfo(ChildHealthMedicationInfoId) {
        this._router.navigate(['/pages/child/childhealthmedicationinfo', ChildHealthMedicationInfoId,19 ]);
    }

    deleteChildHealthMedicationInfo(SequenceNo) {
        this.objChildHealthMedicationInfo.SequenceNo = SequenceNo;
        //this.objChildHealthMedicationInfo.UniqueID = UniqueID;
        this.apiService.delete(this.controllerName, this.objChildHealthMedicationInfo).then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindChildHealthMedicationInfo();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objChildHealthMedicationInfo.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
    onEdit($event){
        this.editChildHealthMedicationInfo($event.SequenceNo);
    }
    onDelete($event){
        this.deleteChildHealthMedicationInfo($event.SequenceNo);
    }
}
