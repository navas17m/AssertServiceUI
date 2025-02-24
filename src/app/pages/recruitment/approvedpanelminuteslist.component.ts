import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component
    ({
        selector: 'ApprovedPanelMinutesList',
        templateUrl: './approvedpanelminuteslist.component.template.html',
    })

export class ApprovedPanelMinutesListComponent {
    public searchText: string = "";
    controllerName = "ApprovedPanelMinutes";
    apmList = [];
    objQeryVal;
    CarerParentId: number;
    FormCnfgId;
    _Form: FormGroup;
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'User Name',prop:'UpdatedUserName',sortable:true,width:'100'},
        {name:'Date of Entry',prop:'UpdatedDate',sortable:true,width:'120',date:'Y'},
        {name:'Date of Panel',prop:'DateOfPanel',sortable:true,width:'120',date:'Y'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
        {name:'View',prop:'View',sortable:false,width:'60'},
        {name:'Delete',prop:'Delete',sortable:false,width:'60'}
        ];
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    constructor(private _router: Router, private _formBuilder: FormBuilder,
        private activatedroute: ActivatedRoute, private module: PagesComponent,
        private apiService: APICallService) {


        this._Form = _formBuilder.group({
            searchText:[],
        });


        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        if (this.objQeryVal.mid == 3 && (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0")) {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 31]);
        }
        else if (this.objQeryVal.mid == 13 && (Common.GetSession("CarerParentId") == null || Common.GetSession("CarerParentId") == "0")) {
            this._router.navigate(['/pages/recruitment/applicantlist', 13, 28]);
        }
        else if (this.objQeryVal.mid == 3) {
            this.FormCnfgId = 204;
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
        }
        else if (this.objQeryVal.mid == 13) {
            this.FormCnfgId = 205;
            this.CarerParentId = parseInt(Common.GetSession("CarerParentId"));
        }

        this.bindAPM();
        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }
    private bindAPM() {
        if (this.CarerParentId != null && this.CarerParentId != 0) {
            this.apiService.get(this.controllerName, "GetByCarerParentId", this.CarerParentId).then(data => {
                this.apmList = data.map(item => ({...item, SequenceNo:item.ApprovedPanelMinutesId}));
                //console.log(this.apmList);
            });
        }
    }

    fnAddData() {
        if (this.objQeryVal.mid == 13)
            this._router.navigate(['/pages/recruitment/apmdata/0/13']);
        else
            this._router.navigate(['/pages/fostercarer/fcapmdata/0/3']);
    }

    edit(id) {
        if (this.objQeryVal.mid == 13)
            this._router.navigate(['/pages/recruitment/apmdata', id, this.objQeryVal.mid]);
        else
            this._router.navigate(['/pages/fostercarer/fcapmdata', id, this.objQeryVal.mid]);
    }

    delete(apmId) {
        this.apiService.delete(this.controllerName, apmId).then(data => this.Respone(data,apmId));
    }

    private Respone(data,Id) {
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.module.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindAPM();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = Id;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
    onEdit(item){
        this.edit(item.ApprovedPanelMinutesId);
    }
    onDelete(item){
        this.delete(item.ApprovedPanelMinutesId);
    }
}
