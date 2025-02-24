
import { Component} from '@angular/core';
import { Router } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { ChildCarePlanDTO } from './DTO/childcareplandto'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component
    ({
    selector: 'childcareplanlist',
    templateUrl: './childcareplanlist.component.template.html',
    })

export class ChildCarePlanListComponent {
    public searchText: string = "";
    lstChildCarePlan = [];
    childCarePlanList = [];
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'Date of Care Plan',prop:'DateofCarePlan',sortable:true,width:'300',date:'Y'},
        {name:'Edit',prop:'Edit',sortable:false,width:'100'},
        {name:'View',prop:'View',sortable:false,width:'100'},
        {name:'Delete',prop:'Delete',sortable:false,width:'100'}
       ];
    ChildID: number;
    objChildCarePlanDTO: ChildCarePlanDTO = new ChildCarePlanDTO();
    returnVal; controllerName = "ChildCarePlan";
    loading = false;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
     FormCnfgId=251;
    constructor(private apiService: APICallService, private _router: Router, private modal: PagesComponent) {
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindCarePlan();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/careplanlist/4");
            this._router.navigate(['/pages/referral/childprofilelist/1/4']);
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

    private bindCarePlan() {
        this.loading = true;
        // this.apiService.get(this.controllerName, "GetAllByChildId", this.ChildID).then(data => {
        //     this.loading = false;
        //     this.lstChildCarePlan = data;
        // });
        this.apiService.get(this.controllerName, "GetListByChildId", this.ChildID).then(data => {
            this.loading = false;
            this.childCarePlanList = data;
        });
    }

    fnAddData() {
        this._router.navigate(['/pages/child/careplandata/0/4']);
    }

    edit(ChildCarePlanId) {
        this._router.navigate(['/pages/child/careplandata', ChildCarePlanId, 4]);
    }

    delete(SequenceNo) {
        this.objChildCarePlanDTO.SequenceNo = SequenceNo;
        //this.objChildCarePlanDTO.UniqueID = UniqueID;
        this.apiService.delete(this.controllerName, this.objChildCarePlanDTO).then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindCarePlan();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objChildCarePlanDTO.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
    onEdit($event){
        this.edit($event.SequenceNo);
    }
    onDelete($event){
        this.delete($event.SequenceNo);
    }
}