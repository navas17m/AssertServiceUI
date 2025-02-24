import { Component} from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { ChildOOHReport } from './DTO/childoohreport'
import { PagesComponent } from '../pages.component';
import { SaveDraftInfoDTO} from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';
import { AgencyKeyNameValueCnfgDTO} from '../superadmin/DTO/agencykeynamecnfgdto'
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component
    ({
        selector: 'ecmchildprogressreportlist',
        templateUrl: './ecmchildprogressreportlist.component.template.html',
    })

export class EcmChildProgressReportListComponent {
    public searchText: string = "";
    isDefaultSortOrderVal: string;
    loading = false;
    objQeryVal;
    objAgencyKeyNameValueCnfgDTO: AgencyKeyNameValueCnfgDTO = new AgencyKeyNameValueCnfgDTO();
    insUserTypeId: number;
    insUserProfileId: number;
    lstecmChildReport = [];
    ECMChildReportList = [];
    ChildID: number;
    columns =[ ];
    objChildOOHReport: ChildOOHReport = new ChildOOHReport();
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    returnVal; controllerName = "EcmChildProgressReport";insActivePage:number;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
     FormCnfgId=83;
    constructor(private apiService: APICallService, private _router: Router, private modal: PagesComponent,private activatedroute: ActivatedRoute) {
        this.insActivePage=1;
        this.showGridColumns();
        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.insUserTypeId = parseInt(Common.GetSession("UserTypeId"));
            this.insUserProfileId = parseInt(Common.GetSession("UserProfileId"));

            //Get New Review Agency Config Value
            this.objAgencyKeyNameValueCnfgDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
            this.objAgencyKeyNameValueCnfgDTO.AgencyKeyNameCnfgId = 4;

            this.apiService.post("AgencyKeyNameCnfg", "GetById", this.objAgencyKeyNameValueCnfgDTO).then(data => {
                this.objAgencyKeyNameValueCnfgDTO = data;
            });

            this.bindChildReport();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/ecmchildprogressreportlist/4");
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
    private showGridColumns()
    {
        this.objAgencyKeyNameValueCnfgDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objAgencyKeyNameValueCnfgDTO.AgencyKeyNameCnfgId = 33;
        this.apiService.post("AgencyKeyNameCnfg", "GetById", this.objAgencyKeyNameValueCnfgDTO).then(data => {
            if(data)
            {              
                this.objAgencyKeyNameValueCnfgDTO = data;     
                if(this.objAgencyKeyNameValueCnfgDTO.Value!=null && this.objAgencyKeyNameValueCnfgDTO.Value=="1")
                {                   
                    this.columns=[
                        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
                        {name:'Date Report Completed',prop:'ReportCompletedDate',sortable:true,width:'200',date:'Y'},
                        {name:'SSW Checked Report',prop:'HasSSWReadAndChecked',sortable:true,width:'150'},
                        {name:'Status',prop:'SaveAsDraftStatus',sortable:true,width:'100'},
                        {name:'Locked',prop:'IsLocked',sortable:true,width:'60'},
                        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
                        {name:'View',prop:'View',sortable:false,width:'60'},
                        {name:'Delete',prop:'Delete',sortable:false,width:'60'},
                        {name:'Signature', prop:'SignatureStatus',sortable:false,width:'60'}]
                       // {name:'Signature', prop:'IsFCSignatureSigned',sortable:false,width:'60'}];
                }
                else
                {                    
                    this.columns=[
                        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
                        {name:'Date Report Completed',prop:'ReportCompletedDate',sortable:true,width:'200',date:'Y'},
                        {name:'SSW Checked Report',prop:'HasSSWReadAndChecked',sortable:true,width:'150'},
                        {name:'Status',prop:'SaveAsDraftStatus',sortable:true,width:'100'},
                        {name:'Locked',prop:'IsLocked',sortable:true,width:'60'},
                        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
                        {name:'View',prop:'View',sortable:false,width:'60'},
                        {name:'Delete',prop:'Delete',sortable:false,width:'60'},
                    ];
                }
            }
        });

    }
    public onPageChange() {
        let tem = document.querySelector('.pagination .page-item.active a');
        this.insActivePage=parseInt(tem.innerHTML);
    }

    private bindChildReport() {
        this.loading = true;
        // this.apiService.get(this.controllerName, "GetAllByChildId", this.ChildID).then(data => {
        //     //this.lstecmChildReport = data;
        //     this.lstTemp = data;
        //     this.fnLoadSaveDraft();
        // });
        this.apiService.get(this.controllerName, "GetListByChildId", this.ChildID).then(data => {
            this.ECMChildReportList = data;
            this.loading = false;
            //this.lstTemp = data;
            //this.fnLoadSaveDraft();
            if (this.insUserTypeId == 4 && this.objAgencyKeyNameValueCnfgDTO != null && this.objAgencyKeyNameValueCnfgDTO.Value != "1") {
                let forCarer = this.ECMChildReportList.filter(x => x.CreatedUserId == this.insUserProfileId)
                if(forCarer.length > 0)
                    this.ECMChildReportList= forCarer;
                else
                    this.ECMChildReportList = [];
            }
            if(this.objQeryVal.apage!=undefined)
            this.insActivePage= parseInt(this.objQeryVal.apage);
        });
    }
    lstTemp = [];
    lstNewTemp = [];
    fnLoadSaveDraft() {
        this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = 83;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
        this.objSaveDraftInfoDTO.TypeId = this.ChildID;
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
            this.lstecmChildReport = this.lstTemp.concat(lstSaveDraft);

            //for Foster Carer
            if (this.insUserTypeId == 4 && this.objAgencyKeyNameValueCnfgDTO != null && this.objAgencyKeyNameValueCnfgDTO.Value != "1") {

                let seqNo = this.lstecmChildReport.filter(x => x.FieldName == "CreatedUserId" && x.FieldValue == this.insUserProfileId);
                if (seqNo.length > 0) {
                    seqNo.forEach(data => {
                        let temp = this.lstecmChildReport.filter(x => x.SequenceNo == data.SequenceNo);
                        if (temp.length > 0) {
                            if (this.lstNewTemp.length == 0) {
                                this.lstNewTemp = temp;
                            }
                            else {
                                temp.forEach(T => {
                                    this.lstNewTemp.push(T);
                                });
                            }
                        }
                    });
                    this.lstecmChildReport = this.lstNewTemp;
                }
                else
                    this.lstecmChildReport = [];
            }
            this.isDefaultSortOrderVal = "desc";
            if(this.objQeryVal.apage!=undefined)
            this.insActivePage= parseInt(this.objQeryVal.apage);

        });


    }
    fnAddData() {
        this._router.navigate(['/pages/child/ecmchildprogressreport/0/4/1']);
    }

    editReport(ChildReportId, hasDraft) {
        if (hasDraft)
            Common.SetSession("SaveAsDraft", "Y");
        else
            Common.SetSession("SaveAsDraft", "N");
        this._router.navigate(['/pages/child/ecmchildprogressreport', ChildReportId, 4,this.insActivePage]);
    }

    deleteChildReport(SequenceNo, hasDraft) {
        this.objChildOOHReport.SequenceNo = SequenceNo;
        //this.objChildOOHReport.UniqueID = UniqueID;
        if (!hasDraft)
            this.apiService.delete(this.controllerName, this.objChildOOHReport).then(data => this.Respone(data));
        else {
            this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
            this.objSaveDraftInfoDTO.FormCnfgId = 83;
            this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
            this.objSaveDraftInfoDTO.TypeId = this.ChildID;
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
            this.bindChildReport();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objChildOOHReport.SequenceNo;
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
            this.editReport($event.SequenceNo,false);
        else if($event.SaveAsDraftStatus=='Saved as Draft')
            this.editReport($event.SequenceNo,true);
    }
    onDelete($event){
        if($event.SaveAsDraftStatus=='Submitted')
            this.deleteChildReport($event.SequenceNo,false);
        else if($event.SaveAsDraftStatus=='Saved as Draft')
            this.deleteChildReport($event.SequenceNo,true);
    }
    onSignClick($event){
        this._router.navigate(['/pages/child/ecmchildprogressreportfcsignature', $event.SequenceNo]);
    }

}
