import { Component} from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router'
import { Common } from '../common'
import { ChildMatchingChecklistDTO } from './DTO/childmatchingchecklistdto'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { SaveDraftInfoDTO} from '../savedraft/DTO/savedraftinfodto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component
    ({
        selector: 'ChildMatchingChecklist',
        templateUrl: './childmatchingchecklist.component.template.html',

    })

export class ChildMatchingChecklistComponent {
    public searchText: string = "";
    lstMatchingChecklist = [];
    matchingChecklist = [];
    ChildID;
    objChildMatchingChecklistDTO: ChildMatchingChecklistDTO = new ChildMatchingChecklistDTO();
    returnVal; controllerName = "ChildMatchingChecklist";
    objQeryVal;
    formcnfId;
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
     FormCnfgId=227;
    columns =[];
    
        constructor(private apiService: APICallService,private route: ActivatedRoute, private _router: Router, private modal: PagesComponent) {
        // if (Common.GetSession("ReferralChildId") != null && Common.GetSession("ReferralChildId") != "null") {

        //     this.ChildID = parseInt(Common.GetSession("ReferralChildId"));;
        //     this.bindChildMatchingChecklist();
        // }
        // else {
        //     Common.SetSession("UrlReferral", "pages/child/childmatchingchecklist/16");
        //     this._router.navigate(['/pages/referral/childprofilelist/0/16']);
        // }
        if(parseInt(Common.GetSession("AgencyProfileId"))!=1)
        {
        this.columns =[
            {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
            {name:'Checklist Date',prop:'ChecklistDate',sortable:true,width:'120',date:'Y'},
            {name:'Ethnicity Culture',prop:'EthnicityCulture',sortable:true,width:'120'},
            {name:'Language',prop:'Language',sortable:true,width:'120'},
            {name:'Religion',prop:'Religion',sortable:true,width:'100'},
            {name:'Name of Duty Worker',prop:'NameofDutyWorker',sortable:true,width:'140'},
            {name:'Status',prop:'SaveAsDraftStatus',sortable:true,width:'100'},
            {name:'Edit',prop:'Edit',sortable:false,width:'60'},
            {name:'View',prop:'View',sortable:false,width:'60'},
            {name:'Delete',prop:'Delete',sortable:false,width:'60'},
            ];
        }
        else
        {
            this.columns =[
                {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
                {name:'Checklist Date',prop:'ChecklistDate',sortable:true,width:'120',date:'Y'},
                {name:'Identity',prop:'EthnicityCulture',sortable:true,width:'120'},
                {name:'Language',prop:'Language',sortable:true,width:'120'},
                {name:'Name of Duty Worker',prop:'NameofDutyWorker',sortable:true,width:'140'},
                {name:'Status',prop:'SaveAsDraftStatus',sortable:true,width:'100'},
                {name:'Edit',prop:'Edit',sortable:false,width:'60'},
                {name:'View',prop:'View',sortable:false,width:'60'},
                {name:'Delete',prop:'Delete',sortable:false,width:'60'},
                ];

        }
        this.route.params.subscribe(data => this.objQeryVal = data);
        this.fnCheckChildSelection();
        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }

    fnCheckChildSelection() {
        if (this.objQeryVal.mid == 16) {
            this.formcnfId=227;
            if (Common.GetSession("ReferralChildId") != null && Common.GetSession("ReferralChildId") != "null") {

                this.ChildID = parseInt(Common.GetSession("ReferralChildId"));
                this.bindChildMatchingChecklist();

            }
            else {
                Common.SetSession("UrlReferral", "pages/referral/childmatchingchecklist/16");
                this._router.navigate(['/pages/referral/childprofilelist/0/16']);
            }
        }
        else if (this.objQeryVal.mid == 4) {
            this.formcnfId=316;
            if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != "null") {

                this.ChildID = parseInt(Common.GetSession("ChildId"));
                this.bindChildMatchingChecklist();
            }
            else {

                Common.SetSession("UrlReferral", "pages/child/childmatchingchecklist/4");
                this._router.navigate(['/pages/child/childprofilelist/1/4']);
            }
        }
    }
    loading = false;
    lstTemp = [];
    fnLoadSaveDraft() {
        this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = 227;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
        this.objSaveDraftInfoDTO.TypeId = this.ChildID;
        let lstSaveDraft = [];
        this.apiService.post("SaveAsDraftInfo","getall",this.objSaveDraftInfoDTO).then(data => {
            let jsonData = [];
            data.forEach(item => {
                jsonData = JSON.parse(item.JsonList);
                jsonData.forEach(T => {
                    lstSaveDraft.push(T);
                });

            });
            this.loading = false;
            this.lstMatchingChecklist = this.lstTemp.concat(lstSaveDraft);

        });
    }

    private bindChildMatchingChecklist() {
        this.loading = true;
        this.apiService.get(this.controllerName, "GetAllByChildId", this.ChildID).then(data => {
           // this.lstMatchingChecklist = data
            this.lstTemp = data;
            this.fnLoadSaveDraft();
        });

        this.apiService.get(this.controllerName, "GetListByChildId", this.ChildID).then(data => {
           this.matchingChecklist = data
           //this.lstTemp = data;
           //this.fnLoadSaveDraft();
           this.loading=false;
       });
    }

    fnAddData() {

        if (this.objQeryVal.mid == 16)
           this._router.navigate(['/pages/referral/childmatchingchecklistdata/0/',this.objQeryVal.mid]);
        else
          this._router.navigate(['/pages/child/childmatchingchecklistdata/0/',this.objQeryVal.mid]);
    }

    edit(chingchecklistId,hasDraft) {
     //console.log(chingchecklistId);
        if (hasDraft)
         Common.SetSession("SaveAsDraft", "Y");
        else
         Common.SetSession("SaveAsDraft", "N");

        if (this.objQeryVal.mid == 16)
          this._router.navigate(['/pages/referral/childmatchingchecklistdata', chingchecklistId,this.objQeryVal.mid]);
        else
          this._router.navigate(['/pages/child/childmatchingchecklistdata', chingchecklistId,this.objQeryVal.mid]);
    }

    delete(SequenceNo,hasDraft) {
        this.objChildMatchingChecklistDTO.SequenceNo = SequenceNo;
        //this.objChildMatchingChecklistDTO.UniqueID = UniqueID;
        this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = 227;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
        this.objSaveDraftInfoDTO.TypeId = this.ChildID;
        if (!hasDraft)
        this.apiService.delete(this.controllerName, this.objChildMatchingChecklistDTO).then(data => this.Respone(data));
        else {
            this.objSaveDraftInfoDTO.SequenceNo = SequenceNo;
            this.apiService.post("SaveAsDraftInfo", "Delete", this.objSaveDraftInfoDTO).then(data => {
                this.Respone(data);
            });
        }
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindChildMatchingChecklist();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objChildMatchingChecklistDTO.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
    onEdit($event){
      if($event.SaveAsDraftStatus=='Submitted')
          this.edit($event.SequenceNo,false);
      else if($event.SaveAsDraftStatus=='Saved as Draft')
          this.edit($event.SequenceNo,true);
    }
    onDelete($event){
      if($event.SaveAsDraftStatus=='Submitted')
          this.delete($event.SequenceNo,false);
      else if($event.SaveAsDraftStatus=='Saved as Draft')
          this.delete($event.SequenceNo,true);
    }
}
