import { Component} from '@angular/core'
import { Router } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { SafeguardingDTO } from './DTO/safeguardingdto'
import { PagesComponent } from '../pages.component'
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component
    ({
    selector: 'safe-safeguardingdaylogjournallist',
    templateUrl: './safe-safeguardingdaylogjournallist.component.template.html',
    })

export class ChildSafeguardingDayLogJournalListComponent {
    controllerName = "ChildSafeguardingDayLogJournal";
    gridList = [];
    ChildID: number;
    objSafeguardingDTO: SafeguardingDTO = new SafeguardingDTO();
    returnVal;
    searchText:string="";
    loading: boolean = false;
    columns =[
      {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
      {name:'Date',prop:'Date',sortable:true,width:'300',date:'Y'},
      {name:'Edit',prop:'Edit',sortable:false,width:'100'},
      {name:'View',prop:'View',sortable:false,width:'100'},
      {name:'Delete',prop:'Delete',sortable:false,width:'100'}
     ];
     objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
     FormCnfgId=376;
    constructor(private apiService: APICallService, private _router: Router, private modal: PagesComponent)
    {
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindGrid();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/safeguardingdaylogjournallist/42");
            this._router.navigate(['/pages/referral/childprofilelist/1/19']);
        }

        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }

    private bindGrid() {
      this.loading = true;
      this.apiService.get(this.controllerName, "GetListByChildId", this.ChildID).then(data =>
        {
          this.loading = false;
          this.gridList = data;
        });
    }

    fnAddData() {
        this._router.navigate(['/pages/child/safeguardingdaylogjournaldata/0/42']);
    }

    edit(id) {
        this._router.navigate(['/pages/child/safeguardingdaylogjournaldata', id,42]);
    }

    delete(SequenceNo) {
        this.objSafeguardingDTO.SequenceNo = SequenceNo;
        this.apiService.delete(this.controllerName, this.objSafeguardingDTO).then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindGrid();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objSafeguardingDTO.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
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
