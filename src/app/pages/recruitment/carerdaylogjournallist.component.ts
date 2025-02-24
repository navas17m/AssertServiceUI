import { Component, OnInit,ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { ConfigTableNames } from '../configtablenames';
import { PagesComponent } from '../pages.component';
import { SaveDraftInfoDTO } from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';
import { ConfigTableNamesDTO } from '../superadmin/DTO/configtablenames';
import { CarerDayLogJournal } from './DTO/carerdaylogjournal';
import { PreviewNextValueService } from '../common/previewnextvalueservice.component';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component
    ({
        selector: 'carerdaylogjournallist',
        templateUrl: './carerdaylogjournallist.component.template.html',
    })

export class CarerDayLogJournalListComponent implements OnInit{
    public searchText: string = "";
    @ViewChild('tblCarerDaylog') tblCarerDaylog;
    lstCarerDaylogJournal = [];
    carerDayLogJournalList = [];
    objQeryVal;
    objCarerDayLogJournal: CarerDayLogJournal = new CarerDayLogJournal();
    returnVal;
    CarerParentId: number;
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    FormCnfgId;
    loading = false;
    controllerName = "CarerDayLogJournal";
    isDefaultSortOrderVal: string;
    objConfigTableNamesDTO: ConfigTableNamesDTO = new ConfigTableNamesDTO();
	OccurrenceDate:Date=null; insdisabled:boolean =false;noOfSaveAsDraftRecord: number;lstType = [];
	year=[];month=[];loadingSearch = false;loadingClear = false;
    insActivePage:number;
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'Date of Occurrence/Time',prop:'OccurenceDate',sortable:true,width:'200',datetime:'Y'},
        {name:'Type',prop:'EntryType',sortable:true,width:'150'},
        {name:'Subject',prop:'Subject',sortable:true,width:'200'},
        {name:'Status',prop:'SaveAsDraftStatus',sortable:true,width:'100'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
        {name:'View',prop:'View',sortable:false,width:'60'},
        {name:'Delete',prop:'Delete',sortable:false,width:'60'}
       ];
    totalMessage =  {
        'emptyMessage': `
        <div align=center><strong>No records found.</strong></div>`,
        'totalMessage': ' - Total Entries'
      };
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    constructor(private activatedroute: ActivatedRoute,
        private _router: Router, private module: PagesComponent, private apiService: APICallService,
        private insPreviewNextValueService:PreviewNextValueService) {
       this.insActivePage=1;
        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        if (this.objQeryVal.mid == 3 && (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0")) {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 4]);
        }
        else if (this.objQeryVal.mid == 13 && (Common.GetSession("CarerParentId") == null || Common.GetSession("CarerParentId") == "0")) {
            this._router.navigate(['/pages/recruitment/applicantlist', 13, 4]);
        }
        else if (this.objQeryVal.mid == 3) {
            this.FormCnfgId = 50;
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            this.bindCarerDayLog();
        }
        else if (this.objQeryVal.mid == 13) {
            this.FormCnfgId = 30;
            this.CarerParentId = parseInt(Common.GetSession("CarerParentId"));
            this.bindCarerDayLog();
        }
		this.year=Common.GetYear();this.month=Common.GetMonth();
		this.objConfigTableNamesDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objConfigTableNamesDTO.Name = ConfigTableNames.DaylogEntryType;
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.lstType = data; });

        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }

    private bindCarerDayLog() {
        if (this.CarerParentId != null) {
            this.objCarerDayLogJournal.CarerParentId = this.CarerParentId;
            this.objCarerDayLogJournal.FormCnfgId = 30;
            //this.cdlServics.getDayLogJournalList(this.objCarerDayLogJournal).then(data => {
            //    this.lstTemp = data;
            //    this.fnLoadSaveDraft();
            //});
            this.loading = true;
            // this.apiService.post(this.controllerName, "GetAllByCarerParentId", this.objCarerDayLogJournal).then(data => {
            //     this.lstTemp = data;
            //     this.fnLoadSaveDraft();
			// 	this.loadingSearch = false;
			// 	this.loadingClear = false;
            // });
            this.apiService.post(this.controllerName, "GetListByCarerParentId", this.objCarerDayLogJournal).then(data => {
                //this.lstTemp = data;
                //this.fnLoadSaveDraft();
                this.carerDayLogJournalList=data;
				this.loadingSearch = false;
				this.loadingClear = false;
                this.loading=false;
                this.insPreviewNextValueService.SetListValuesNew(data);
            });
        }
    }

    fnAddData() {

        if (this.objQeryVal.mid == 13)
            this._router.navigate(['/pages/recruitment/carerdaylogjournaldata/0/13/1']);
        else
            this._router.navigate(['/pages/fostercarer/carerdaylogjournaldata/0/3/1']);
    }
    lstTemp = [];
    fnLoadSaveDraft() {
        this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = 30;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;
        this.objSaveDraftInfoDTO.TypeId = this.CarerParentId;
        let lstSaveDraft = [];

        this.apiService.post("SaveAsDraftInfo", "getall", this.objSaveDraftInfoDTO).then(data => {
		this.noOfSaveAsDraftRecord=data.length;
            // this.sdService.getList(this.objSaveDraftInfoDTO).then(data => {
            let jsonData = [];
            data.forEach(item => {
                jsonData = JSON.parse(item.JsonList);
                jsonData.forEach(T => {
                    lstSaveDraft.push(T);
                });

            });
            this.loading = false;

            this.lstCarerDaylogJournal = this.lstTemp.concat(lstSaveDraft);
            this.isDefaultSortOrderVal = "desc";
            if(this.objQeryVal.apage!=undefined)
            this.insActivePage= parseInt(this.objQeryVal.apage);


        });
    }

    fnGetSortedValue(value)
    {
        this.insPreviewNextValueService.SetListValues(value);
    }

    public onPageChange() {
        let tem = document.querySelector('.pagination .page-item.active a');
        this.insActivePage=parseInt(tem.innerHTML);
    }

    editCarerDayLog(CarerDayLogId, hasDraft) {
        if (hasDraft)
            Common.SetSession("SaveAsDraft", "Y");
        else
            Common.SetSession("SaveAsDraft", "N");
        if (this.objQeryVal.mid == 13)
            this._router.navigate(['/pages/recruitment/carerdaylogjournaldata', CarerDayLogId, this.objQeryVal.mid,this.insActivePage]);
        else
            this._router.navigate(['/pages/fostercarer/carerdaylogjournaldata', CarerDayLogId, this.objQeryVal.mid,this.insActivePage]);
    }

    deleteCarerDayLog(SequenceNo, hasDraft) {

        this.objCarerDayLogJournal.SequenceNo = SequenceNo;
        //this.objCarerDayLogJournal.UniqueID = UniqueID;
        if (!hasDraft) {
            this.apiService.delete(this.controllerName, this.objCarerDayLogJournal).then(data => this.Respone(data));
            //this.cdlServics.post(this.objCarerDayLogJournal, "delete").then(data => this.Respone(data));
        }
        else {
            this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
            this.objSaveDraftInfoDTO.FormCnfgId = 30;
            this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;
            this.objSaveDraftInfoDTO.TypeId = this.CarerParentId;
            this.objSaveDraftInfoDTO.SequenceNo = SequenceNo;
            //this.sdService.delete(this.objSaveDraftInfoDTO).then(data => {
            //    this.Respone(data);
            //});

            this.apiService.delete("SaveAsDraftInfo", this.objSaveDraftInfoDTO).then(data => this.Respone(data));
        }

    }

	ngOnInit() {

    }
	fnEnable()
	{
		this.insdisabled=true;
	}
  private Respone(data) {
        console.log(data);
	      this.loading=false;
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.module.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindCarerDayLog();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objCarerDayLogJournal.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);

        }
    }
    onEdit($event){

        if($event.SaveAsDraftStatus=='Submitted')
            this.editCarerDayLog($event.SequenceNo,false);
        else if($event.SaveAsDraftStatus=='Saved as Draft')
            this.editCarerDayLog($event.SequenceNo,true);
    }
    onDelete($event){
        if($event.SaveAsDraftStatus=='Submitted')
            this.deleteCarerDayLog($event.SequenceNo,false);
        else if($event.SaveAsDraftStatus=='Saved as Draft')
            this.deleteCarerDayLog($event.SequenceNo,true);
    }
}
