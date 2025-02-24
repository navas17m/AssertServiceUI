import { Component} from '@angular/core';

import { Router } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { ChildEducationAbsenceInfo } from './DTO/childeducationabsenceinfo'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component
    ({
    selector: 'childeducationabsenceinfolist',
    templateUrl: './childeducationabsenceinfolist.component.template.html',    
    })

export class ChildEducationAbsenceInfoListComponent {
    public searchText: string = "";
    loading:boolean=false;
    childEducationAbsenceInfoList=[];
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'Date of Absent',prop:'AbsentDate',sortable:true,width:'100',date:'Y'},
        {name:'Date of Return',prop:'DateofReturn',sortable:true,width:'100',date:'Y'},
        {name:'Absence Reason',prop:'AbsenceReason',sortable:true,width:'300'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
        {name:'View',prop:'View',sortable:false,width:'60'},
        {name:'Delete',prop:'Delete',sortable:false,width:'60'}
       ];
    lstChildEducationAbsenceInfo = [];
    ChildID: number;
    objChildEducationAbsenceInfo: ChildEducationAbsenceInfo = new ChildEducationAbsenceInfo();
    returnVal; controllerName = "ChildEducationAbsenceInfo"; 
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
     FormCnfgId=103;
    constructor(private apiService: APICallService, private _router: Router, private modal: PagesComponent)
    {
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindChildEducationAbsenceInfo();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/childeducationabsenceinfolist/18");
            this._router.navigate(['/pages/referral/childprofilelist/1/18']);
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

    private bindChildEducationAbsenceInfo() {
        this.loading=true;
        this.apiService.get(this.controllerName,"GetList",this.ChildID).then(data => 
            {
                this.childEducationAbsenceInfoList = data;
                this.loading = false;
            });
    }

    fnAddData() {
        this._router.navigate(['/pages/child/childeducationabsenceinfo/0/16']);
    }

    editChildEducationAbsenceInfo(ChildEducationAbsenceInfoId) { 
        this._router.navigate(['/pages/child/childeducationabsenceinfo', ChildEducationAbsenceInfoId,16 ]);
    }

    deleteChildEducationAbsenceInfo(SequenceNo) {            
        this.objChildEducationAbsenceInfo.SequenceNo = SequenceNo;
        this.apiService.delete(this.controllerName, this.objChildEducationAbsenceInfo).then(data => this.Respone(data)); 
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);           
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);           
            this.bindChildEducationAbsenceInfo();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objChildEducationAbsenceInfo.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
    onEdit($event){
        this.editChildEducationAbsenceInfo($event.SequenceNo);
    }
    onDelete($event){
        this.deleteChildEducationAbsenceInfo($event.SequenceNo);
    }
}