import { Component} from '@angular/core';
import { ChildCLADocumentationDynamicDTO } from './DTO/childcladocumentationdynamicldto'
import { Router } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component
    ({
    selector: 'ChildCLADocumentationList',
    templateUrl: './childcladocumentationdynamiclist.component.template.html',
    })

export class ChildCLADocumentationDynamicListComponent {
    public searchText:string ='';
    lstChildCLADocu = [];
    childCLADocuList = [];
    columns =[
        {name:'Date of Documentation',prop:'DateofDocumentation',sortable:true,width:'400',date:'Y'},
        {name:'Edit',prop:'Edit',sortable:false,width:'80'},
        {name:'View',prop:'View',sortable:false,width:'80'},
        {name:'Delete',prop:'Delete',sortable:false,width:'80'}
       ];
    ChildID: number;
    objChildCLADocumentationDynamicDTO: ChildCLADocumentationDynamicDTO = new ChildCLADocumentationDynamicDTO();
    returnVal; controllerName = "ChildCLADocumentationDynamic";
    loading = false;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
     FormCnfgId=219;
    constructor(private apiService: APICallService, private _router: Router,
        private modal: PagesComponent) {
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindChildCSEList();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/cladocumentationdynamiclist/4");
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

    private bindChildCSEList() {
        this.loading=true;
        // this.apiService.get(this.controllerName, "GetAll", this.ChildID).then(data =>
        //      {
        //         this.loading = false;
        //           this.lstChildCLADocu = data ;
        //     });
            this.apiService.get(this.controllerName, "GetList", this.ChildID).then(data =>
                {
                   this.loading = false;
                     this.childCLADocuList = data ;
               });
    }

    fnAddData() {
        this._router.navigate(['/pages/child/cladocumentationdynamicdata/0/4']);
    }

    edit(id) {
        this._router.navigate(['/pages/child/cladocumentationdynamicdata', id,4]);
    }

    delete(SequenceNo) {
        this.objChildCLADocumentationDynamicDTO.SequenceNo = SequenceNo;
        //this.objChildCLADocumentationDynamicDTO.UniqueID = UniqueID;
        this.apiService.delete(this.controllerName, this.objChildCLADocumentationDynamicDTO).then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindChildCSEList();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objChildCLADocumentationDynamicDTO.SequenceNo;
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