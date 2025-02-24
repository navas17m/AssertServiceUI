import { Component} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { Common } from '../common'
import { Base } from '../services/base.service'
import { ChildDetailsDTO } from '../fostercarer/DTO/childdetailsdto'
import { ChildSupervisoryHomeVisitDTO } from '../fostercarer/DTO/childsupervisoryhomevisitdto'
import { APICallService } from '../services/apicallservice.service';
import { SaveDraftInfoDTO} from '../savedraft/DTO/savedraftinfodto';
import { PagesComponent } from '../pages.component';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component
    ({
        selector: 'supervisoryhomevisitlist',
        templateUrl: './childsupervisoryhomevisitlist.component.template.html',
    })

export class SupervisoryHomeVisitListComponent {
    public searchText: string = "";
    lstChildSupervisoryHomeVisit = []; loading = false;
    ChildSupervisoryHomeVisitList = [];
    objChildDetailsDTO: ChildDetailsDTO = new ChildDetailsDTO();
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    objChildSupervisoryHomeVisitDTO: ChildSupervisoryHomeVisitDTO = new ChildSupervisoryHomeVisitDTO();
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'Date of Visit',prop:'DateOfVisitChild',sortable:true,width:'200',datetime:'Y'},
        {name:'Status',prop:'SaveAsDraftStatus',sortable:true,width:'100'},
        {name:'Locked',prop:'IsLocked',sortable:true,width:'100'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
        {name:'View',prop:'View',sortable:false,width:'60'},
        {name:'Delete',prop:'Delete',sortable:false,width:'60'},
        {name:'Signature', prop:'SignatureStatus',sortable:false,width:'60'}];
    submitted = false;
    _Form: FormGroup;
    returnVal;
    lstChild;
    objQeryVal;
    CarerSHVSequenceNo;
    childID;
    controllerName = "ChildSupervisoryHomeVisit";
    isDefaultSortOrderVal: string;insActivePage:number;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
     FormCnfgId=100;
    constructor(private apiService: APICallService, private _formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private _router: Router, private pComponent: PagesComponent) {
            this.insActivePage=1;
        this.route.params.subscribe(data => this.objQeryVal = data);
        this.CarerSHVSequenceNo = this.objQeryVal.Id;

        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.childID = parseInt(Common.GetSession("ChildId"));
            this.bindChildSupervisoryHomeVisit();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/supervisoryhomevisitlist/4");
            this._router.navigate(['/pages/referral/childprofilelist/1/4']);
        }

        // this.bindChildSupervisoryHomeVisit();
        this._Form = _formBuilder.group({
            searchText: [],
        });

        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.childID;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }

    private bindChildSupervisoryHomeVisit() {
        if (this.childID) {
            this.loading = true;
            this.apiService.get(this.controllerName, "GetChildSHVByChildId", this.childID).then(data => {
                this.loading = false;
                this.ChildSupervisoryHomeVisitList = data;
                //this.lstTemp = data;
                //this.fnLoadSaveDraft();
            });
            // this.apiService.get(this.controllerName, "GetChildSHVListByChildId", this.childID).then(data => {
            //     //this.loading = false;
            //    // this.lstChildSupervisoryHomeVisit = data;
            //     this.lstTemp = data;
            //     this.fnLoadSaveDraft();
            // });
        }
    }

    lstTemp = [];
    fnLoadSaveDraft() {
        this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = 100;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
        this.objSaveDraftInfoDTO.TypeId = this.childID;
        let lstSaveDraft = [];
        this.apiService.post("SaveAsDraftInfo", "getall", this.objSaveDraftInfoDTO).then(data => {
            let jsonData = [];
            data.forEach(item => {
                jsonData = JSON.parse(item.JsonList);
                jsonData.forEach(T => {
                    lstSaveDraft.push(T);
                });

            });
            this.loading = false;
            this.lstChildSupervisoryHomeVisit = this.lstTemp.concat(lstSaveDraft);
            this.isDefaultSortOrderVal = "desc";
            if(this.objQeryVal.apage!=undefined)
            this.insActivePage= parseInt(this.objQeryVal.apage);
        });
    }

    public onPageChange() {
        let tem = document.querySelector('.pagination .page-item.active a');
        this.insActivePage=parseInt(tem.innerHTML);
    }

    fnAddData() {
        Common.SetSession("SaveAsDrafts", "N");
        this._router.navigate(['/pages/child/supervisoryhomevisitdata/0/4/1']);
    }


    editChildSupervisoryHomeVisit(childSHVSequenceNo, hasDraft) {
        if (hasDraft)
            Common.SetSession("SaveAsDrafts", "Y");
        else
            Common.SetSession("SaveAsDrafts", "N");
        this._router.navigate(['/pages/child/supervisoryhomevisitdata', childSHVSequenceNo, 4,this.insActivePage]);
    }

    delete(SequenceNo, hasDraft) {
        this.objChildSupervisoryHomeVisitDTO.SequenceNo = SequenceNo;
        //this.objChildSupervisoryHomeVisitDTO.UniqueID = UniqueID;
        if (!hasDraft) {
            this.apiService.delete(this.controllerName, this.objChildSupervisoryHomeVisitDTO).then(data => this.Respone(data));
            //this.cdlServics.post(this.objChildDayLogJournal, "delete").then(data => this.Respone(data));
        }
        else {
            this.objSaveDraftInfoDTO.SequenceNo = SequenceNo;
            this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
            this.objSaveDraftInfoDTO.FormCnfgId = 100;
            this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
            this.objSaveDraftInfoDTO.TypeId = this.childID;
            this.apiService.post("SaveAsDraftInfo", "Delete", this.objSaveDraftInfoDTO).then(data => {
                this.Respone(data);
            });
            //this.sdService.delete(this.objSaveDraftInfoDTO).then(data => {
            //    this.Respone(data);
            //});
        }
    }
    private Respone(data) {
        if (data.IsError == true) {
            this.pComponent.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            this.pComponent.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindChildSupervisoryHomeVisit();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objChildSupervisoryHomeVisitDTO.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.childID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
    onEdit($event){
        if($event.SaveAsDraftStatus=='Submitted')
            this.editChildSupervisoryHomeVisit($event.SequenceNo,false);
        else if($event.SaveAsDraftStatus=='Saved as Draft')
            this.editChildSupervisoryHomeVisit($event.SequenceNo,true);
    }
    onDelete($event){
        if($event.SaveAsDraftStatus=='Submitted')
            this.delete($event.SequenceNo,false);
        else if($event.SaveAsDraftStatus=='Saved as Draft')
            this.delete($event.SequenceNo,true);
    }
    onSignClick($event){
        this._router.navigate(['/pages/child/childShvfcsignature', this.childID, $event.SequenceNo]);
    }
}