import { Component} from '@angular/core';
import { Router } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { ChildPathwayplanInfo } from './DTO/childpathwayplaninfo'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component
    ({
    selector: 'childpathwayplanlist',
    templateUrl: './childpathwayplanlist.component.template.html',
    })

export class ChildPathwayplanListComponent {
    public loading:boolean = false;
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'Pathway Plan Date',prop:'PathwayPlanDate',sortable:true,width:'300',date:'Y'},
        {name:'Transition Plan Date',prop:'DateofTransitionPlan',sortable:true,width:'300',date:'Y'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
        {name:'View',prop:'View',sortable:false,width:'60'},
        {name:'Delete',prop:'Delete',sortable:false,width:'60'}
       ];
    lstChildPathwayplan = [];
    ChildID: number;
    objChildPathwayplan: ChildPathwayplanInfo = new ChildPathwayplanInfo();
    returnVal;
    IsShowList: boolean = false;
    childAge: number; controllerName = "ChildPathwayplanInfo"; 
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
     FormCnfgId=96;
    constructor(private apiService: APICallService, private _router: Router, private modal: PagesComponent)
    {
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindChildPathwayplan();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/childpathwayplanlist/4");
            this._router.navigate(['/pages/referral/childprofilelist/1/4']);
        }

        this.childAge = parseInt(Common.GetSession("ChildAge"));        
        if (this.childAge != null) {            
            if (this.childAge >= 16)
                this.IsShowList = true;
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

    private bindChildPathwayplan() {
        this.loading = true;
        this.apiService.get(this.controllerName,"GetListByChildId",this.ChildID).then(data => 
            {
                this.lstChildPathwayplan = data;
                this.loading=false;
            });
    }

    fnAddData() {
        this._router.navigate(['/pages/child/childpathwayplan/0/4']);
    }

    editChildPathwayplan(ChildPathwayplanInfoId) { 
        this._router.navigate(['/pages/child/childpathwayplan', ChildPathwayplanInfoId, 4]);
    }    

    deleteChildPathwayplan(SequenceNo) {                 
        this.objChildPathwayplan.SequenceNo = SequenceNo;
        //this.objChildPathwayplan.UniqueID = UniqueID;
        this.apiService.delete(this.controllerName, this.objChildPathwayplan).then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);           
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);           
            this.bindChildPathwayplan();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objChildPathwayplan.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
    onEdit($event){
        this.editChildPathwayplan($event.SequenceNo);
    }
    onDelete($event){
        this.deleteChildPathwayplan($event.SequenceNo);
    }
}