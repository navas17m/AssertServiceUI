import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { ConfigTableNames } from '../configtablenames';
import { PagesComponent } from '../pages.component';
import { SaveDraftInfoDTO } from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';
import { ConfigTableNamesDTO } from '../superadmin/DTO/configtablenames';
import { ChildDayLogJournal } from './DTO/childdaylogjournal';
import { PreviewNextValueService } from '../common/previewnextvalueservice.component'
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component
    ({
        selector: 'childdaylogjournallist',
        templateUrl: './childdaylogjournallist.component.template.html',
    })

export class ChildDayLogJournalListComponent implements OnInit{
    public searchText: string = "";
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'Date of Occurrence/Time',prop:'OccurenceDate',sortable:true,width:'200',datetime:'Y'},
        {name:'Type',prop:'EntryType',sortable:true,width:'150'},
        {name:'Subject',prop:'Subject',sortable:true,width:'200'},
        {name:'Status',prop:'SaveAsDraftStatus',sortable:true,width:'150'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
        {name:'View',prop:'View',sortable:false,width:'60'},
        {name:'Delete',prop:'Delete',sortable:false,width:'60'}
       ];
    loading = false;noOfSaveAsDraftRecord: number;
    lstChildDayLogJournal = [];lstType = [];
    data = [];
    objChildDayLogJournal: ChildDayLogJournal = new ChildDayLogJournal();
	 objConfigTableNamesDTO: ConfigTableNamesDTO = new ConfigTableNamesDTO();
    returnVal; 
    objQeryVal;OccurrenceDate:Date=null;
    ChildId: number;
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    controllerName = "ChildDayLogJournal";
    isDefaultSortOrderVal: string; insdisabled:boolean =false;
	year=[];month=[];loadingSearch = false;loadingClear = false;
    insActivePage:number;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId = 74;
    constructor(private activatedroute: ActivatedRoute, private _router: Router, private _location: Location,
        private model: PagesComponent, private apiService: APICallService,
        private insPreviewNextValueService:PreviewNextValueService) {
            this.insActivePage=1;
        this.activatedroute.params.subscribe(data => {
            this.objQeryVal = data;
            this.fnCheckChildSelection();
        });
		this.year=Common.GetYear();this.month=Common.GetMonth();
		this.objConfigTableNamesDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objConfigTableNamesDTO.Name = ConfigTableNames.DaylogEntryType;
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.lstType = data; });

        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildId;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }


    public onPageChange() {
        let tem = document.querySelector('.pagination .page-item.active a');
        this.insActivePage=parseInt(tem.innerHTML);
    }

    fnGetSortedValue(value)
    {
        this.insPreviewNextValueService.SetListValues(value);
    }

    fnCheckChildSelection() {
        if (this.objQeryVal.mid == 16) {
            if (Common.GetSession("ReferralChildId") != null && Common.GetSession("ReferralChildId") != "null") {
                this.FormCnfgId = 74;
                this.ChildId = parseInt(Common.GetSession("ReferralChildId"));
                this.bindChildDayLogJournal();
            }
            else {
                Common.SetSession("UrlReferral", "pages/referral/childdayloglist/16");
                this._router.navigate(['/pages/referral/childprofilelist/0/16']);
            }
        }
        else {
            if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != "null") {
                this.FormCnfgId = 81;
                this.ChildId = parseInt(Common.GetSession("ChildId"));
                this.bindChildDayLogJournal();
            }
            else {

                Common.SetSession("UrlReferral", "pages/child/childdaylogjournal/4");
                this._router.navigate(['/pages/child/childprofilelist/1/4']);
            }
        }
    }

    editChildDayLogJournal(ChildDayLogJournalId, hasDraft) {
        if (hasDraft)
            Common.SetSession("SaveAsDraft", "Y");
        else
            Common.SetSession("SaveAsDraft", "N");

        this._router.navigate(['/pages/referral/childdaylogdata', ChildDayLogJournalId, this.objQeryVal.mid,this.insActivePage]);
    }

    lstTemp = [];
    fnLoadSaveDraft() {
        this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = 74;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
        this.objSaveDraftInfoDTO.TypeId = this.ChildId;
        let lstSaveDraft = [];
        this.apiService.post("SaveAsDraftInfo", "getall", this.objSaveDraftInfoDTO).then(data => {
			this.noOfSaveAsDraftRecord=data.length;
            let jsonData = [];
            data.forEach(item => {
                jsonData = JSON.parse(item.JsonList);
                jsonData.forEach(T => {
                    lstSaveDraft.push(T);
                });

            });
            this.loading = false;
            this.lstChildDayLogJournal = this.lstTemp.concat(lstSaveDraft);
            this.isDefaultSortOrderVal = "desc";
            if(this.objQeryVal.apage!=undefined)
              this.insActivePage=parseInt(this.objQeryVal.apage);
        });
        //this.sdService.getList(this.objSaveDraftInfoDTO).then(data =>
        //{
        //    let jsonData = [];
        //    data.forEach(item => {
        //        jsonData = JSON.parse(item.JsonList);
        //        jsonData.forEach(T => {
        //            lstSaveDraft.push(T);
        //        });

        //    });
        //    this.lstChildDayLogJournal = this.lstTemp.concat(lstSaveDraft);

        //});
    }


	ngOnInit() {

    }
	fnEnable()
	{
		this.insdisabled=true;
	}
    private bindChildDayLogJournal() {
        this.loading = true;
        let id = this.ChildId;
        this.objChildDayLogJournal.ChildId = id;
        this.apiService.post(this.controllerName, "GetListByChildId", this.objChildDayLogJournal).then(data => {
         this.lstChildDayLogJournal = data;
         this.loading = false;

        // console.log(data)
         //
         this.insPreviewNextValueService.SetListValuesNew(data);
         //this.lstTemp = data;
         //this.fnLoadSaveDraft();
		 //this.loadingSearch = false;
				//this.loadingClear = false;
        });
        //this.cdlServics.getChildDayLogJournalList(this.objChildDayLogJournal).subscribe(data => {
        //    this.lstTemp = data;
        //    this.fnLoadSaveDraft();
        //});
    }

    deleteChildDayLogJournal(SequenceNo,hasDraft) {
        this.objChildDayLogJournal.SequenceNo = SequenceNo;
        //this.objChildDayLogJournal.UniqueID = UniqueID;
        if (!hasDraft) {
            this.apiService.delete(this.controllerName, this.objChildDayLogJournal).then(data => this.Respone(data));
            //this.cdlServics.post(this.objChildDayLogJournal, "delete").then(data => this.Respone(data));
        }
        else {
            this.objSaveDraftInfoDTO.SequenceNo = SequenceNo;
            this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
            this.objSaveDraftInfoDTO.FormCnfgId = 74;
            this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
            this.objSaveDraftInfoDTO.TypeId = this.ChildId;
            this.apiService.post("SaveAsDraftInfo", "Delete", this.objSaveDraftInfoDTO).then(data => {
                this.Respone(data);
            });
            //this.sdService.delete(this.objSaveDraftInfoDTO).then(data => {
            //    this.Respone(data);
            //});
        }
    }
    private Respone(data) {
	this.loading=false;
        if (data.IsError == true) {
            this.model.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            this.model.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindChildDayLogJournal();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objChildDayLogJournal.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildId;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
    fnAddData() {
        if (this.objQeryVal.mid == 16)
            this._router.navigate(['/pages/referral/childdaylogdata/0/16/1']);
        else
            this._router.navigate(['/pages/child/childdaylogdata/0/4/1']);
    }
    onEdit($event){
        if($event.SaveAsDraftStatus=='Submitted')
            this.editChildDayLogJournal($event.SequenceNo,false);
        else if($event.SaveAsDraftStatus=='Saved as Draft')
            this.editChildDayLogJournal($event.SequenceNo,true);
    }
    onDelete($event){
        if($event.SaveAsDraftStatus=='Submitted')
            this.deleteChildDayLogJournal($event.SequenceNo,false);
        else if($event.SaveAsDraftStatus=='Saved as Draft')
            this.deleteChildDayLogJournal($event.SequenceNo,true);
    }
}
