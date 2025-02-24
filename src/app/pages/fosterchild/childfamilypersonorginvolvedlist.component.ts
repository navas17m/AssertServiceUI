import { Component} from '@angular/core';
//import { ChildFamilyPersonOrgInvolvedService } from '../services/childfamilypersonorginvolved.service'
import { Router } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { ChildFamilyPersonOrgInvolved } from './DTO/childfamilypersonorginvolved'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component
    ({
        selector: 'childfamilypersonorginvolvedlist',
        templateUrl: './childfamilypersonorginvolvedlist.component.template.html',
    })

export class ChildFamilyPersonOrgInvolvedListComponent {
    public searchText: string = "";
    public loading:boolean = false;
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'Contact Name',prop:'Name',sortable:true,width:'200'},
        {name:'Contact Type',prop:'ContactType',sortable:true,width:'200'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
        {name:'View',prop:'View',sortable:false,width:'60'},
        {name:'Delete',prop:'Delete',sortable:false,width:'60'}
       ];
    lstChildFamilyPersonOrgInvolved = [];
    ChildID: number;
    objChildFamilyPersonOrgInvolved: ChildFamilyPersonOrgInvolved = new ChildFamilyPersonOrgInvolved();
    returnVal; controllerName = "ChildFamilyPersonOrgInvolved";
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=88;
    constructor(private apiService: APICallService, private _router: Router, private modal: PagesComponent) {
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindChildFamilyPersonOrgInvolved();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/childfamilypersonorginvolvedlist/4");
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

    private bindChildFamilyPersonOrgInvolved() {
        this.loading = true;
        this.apiService.get(this.controllerName, "GetListByChildId", this.ChildID).then(data => 
            {
                this.lstChildFamilyPersonOrgInvolved = data;
                this.loading=false;
            });
        //  this.CFPOIService.getChildFamilyPersonOrgInvolvedList(this.ChildID).subscribe(data => this.lstChildFamilyPersonOrgInvolved = data);
    }

    fnAddData() {
        this._router.navigate(['/pages/child/childfamilypersonorginvolved/0/4']);
    }

    editChildFamilyPersonOrgInvolved(ChildFamilyPersonOrgInvolvedId) {
        this._router.navigate(['/pages/child/childfamilypersonorginvolved', ChildFamilyPersonOrgInvolvedId, 4]);
    }

    deleteChildFamilyPersonOrgInvolved(SequenceNo) {
        this.objChildFamilyPersonOrgInvolved.SequenceNo = SequenceNo;
        //this.objChildFamilyPersonOrgInvolved.UniqueID = UniqueID;
        //this.CFPOIService.post(this.objChildFamilyPersonOrgInvolved, "delete").then(data => this.Respone(data));
        this.apiService.delete(this.controllerName, this.objChildFamilyPersonOrgInvolved).then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindChildFamilyPersonOrgInvolved();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objChildFamilyPersonOrgInvolved.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
    onEdit($event){
        this.editChildFamilyPersonOrgInvolved($event.SequenceNo)
    }
    onDelete($event){
        this.deleteChildFamilyPersonOrgInvolved($event.SequenceNo)
    }
}