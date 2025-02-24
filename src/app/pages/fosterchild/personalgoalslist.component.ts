/// <reference path="DTO/personalgoalsdto.ts" />
import { Component} from '@angular/core';
import { Router } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { ChildPersonalGoalComboDTO} from './DTO/personalgoalsdto';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component
    ({
        selector: 'personalgoalslist',
        templateUrl: './personalgoalslist.component.template.html',
    })

export class ChildPersonalGoalsListComponent {
    limitPerPage:number = 10;
    limitPerPagePPDP:number = 10;
    footerMessage={
        'emptyMessage':'',
        'totalMessage': ' - Records'
      };
    public searchText: string = "";
    public loading:boolean = false;
    columns =[
        {name:'Goal Name',prop:'Goal',sortable:true,width:'300'},
        {name:'Week or Month',prop:'WeekorMonthName',sortable:true,width:'300'},
        {name:'Date',prop:'goalDate',sortable:true,width:'300'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
        {name:'View',prop:'View',sortable:false,width:'60'},
        {name:'Delete',prop:'Delete',sortable:false,width:'60'}
       ];
    lstPersonalGoals = [];
    ChildID: number;
    objChildPersonalGoalComboDTO: ChildPersonalGoalComboDTO = new ChildPersonalGoalComboDTO();
    controllerName = "ChildPersonalGoal";
    AgencyProfileId; userProfileId;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
     FormCnfgId=216;
    constructor(private apiService: APICallService, private _router: Router
        , private modal: PagesComponent) {

        this.AgencyProfileId = Common.GetSession("AgencyProfileId");
        this.userProfileId = Common.GetSession("UserProfileId");
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') { 
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindPersonalGoal();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/personalgoalslist/4");
            this._router.navigate(['/pages/referral/childprofilelist/1/16']);
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
    fnAdd() {
        this._router.navigate(['/pages/child/personalgoalsdata', 0]);
    }
    edit(personalgoalsId) {
        this._router.navigate(['/pages/child/personalgoalsdata', personalgoalsId]);
    }

    private bindPersonalGoal() {
        this.loading=true;
        this.apiService.get(this.controllerName, "GetListByChildId", this.ChildID).then(data => {
            this.lstPersonalGoals = data;
            this.loading=false;
        });

    }

    delete(SequenceNo) {
        this.objChildPersonalGoalComboDTO.SequenceNo = SequenceNo;
        //this.objChildPersonalGoalComboDTO.UniqueID = UniqueID;
        this.apiService.delete(this.controllerName, this.objChildPersonalGoalComboDTO).then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindPersonalGoal();
        }
        this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objChildPersonalGoalComboDTO.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }
    onEdit(SequenceNo){
        this.edit(SequenceNo);
    }
    onDelete(SequenceNo){
        this.delete(SequenceNo);
    }

    setPageSize(pageSize:string)
    {
      this.limitPerPage = parseInt(pageSize);
    }
    setPageSizePPDP(pageSize:string)
    {
      this.limitPerPagePPDP = parseInt(pageSize);
    }
}