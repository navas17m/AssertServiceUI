import { Component} from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { FosterCarerDiaryRecording } from './DTO/fostercarerdiaryrecording'
import { PagesComponent } from '../pages.component';
import { SaveDraftInfoDTO} from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';
import { PreviewNextValueService } from '../common/previewnextvalueservice.component'
import { AgencyKeyNameValueCnfgDTO } from '../superadmin/DTO/agencykeynamecnfgdto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component
    ({
    selector: 'FosterCarerDiaryRecordinglist',
    templateUrl: './FosterCarerDiaryRecordinglist.component.template.html',
    })

export class FosterCarerDiaryRecordingListComponent {
    objAgencyKeyNameValueCnfgDTO: AgencyKeyNameValueCnfgDTO = new AgencyKeyNameValueCnfgDTO();
    public searchText: string = "";
    loading = false;
    columns =[];
       
    lstFosterCarerDiaryRecording = [];
    fosterCarerDiaryRecordingList = [] ;
    ChildID: number;objQeryVal;
    objFosterCarerDiaryRecording: FosterCarerDiaryRecording = new FosterCarerDiaryRecording();
    returnVal;
    IsLocked = "No";
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    controllerName = "FosterCarerDiaryRecording";
    isDefaultSortOrderVal: string;
    insActivePage:number;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
     FormCnfgId=84;
    constructor(private activatedroute: ActivatedRoute,private apiService: APICallService, private _router: Router, private modal: PagesComponent,
        private insPreviewNextValueService:PreviewNextValueService
        )
    {
        this.showGridColumns();
        this.insActivePage=1;
        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindFosterCarerDiaryRecording();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/fostercarerdiaryrecordinglist/4");
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
        this.objAgencyKeyNameValueCnfgDTO.AgencyKeyNameCnfgId = 29;
        this.apiService.post("AgencyKeyNameCnfg", "GetById", this.objAgencyKeyNameValueCnfgDTO).then(data => {
            if(data)
            {              
                this.objAgencyKeyNameValueCnfgDTO = data;     
                if(this.objAgencyKeyNameValueCnfgDTO.Value!=null && this.objAgencyKeyNameValueCnfgDTO.Value=="1")
                {                   
                    this.columns=[
                        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
                        {name:'Date of Occurrence/Time',prop:'OccurenceDate',sortable:true,width:'200',datetime:'Y'},
                        {name:'Type',prop:'EntryType',sortable:true,width:'150'},
                        {name:'Subject',prop:'SubjectName',sortable:true,width:'150'},
                        {name:'Status',prop:'SaveAsDraftStatus',sortable:true,width:'150'},
                        {name:'Locked', prop:'IsLocked', sortable:true,width:'60'},
                        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
                        {name:'View',prop:'View',sortable:false,width:'60'},
                        {name:'Delete',prop:'Delete',sortable:false,width:'60'},
                        {name:'Signature', prop:'SignatureStatus',sortable:false,width:'60'}]
                }
                else
                {                    
                    this.columns=[
                        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
                        {name:'Date of Occurrence/Time',prop:'OccurenceDate',sortable:true,width:'200',datetime:'Y'},
                        {name:'Type',prop:'EntryType',sortable:true,width:'150'},
                        {name:'Subject',prop:'SubjectName',sortable:true,width:'150'},
                        {name:'Status',prop:'SaveAsDraftStatus',sortable:true,width:'150'},
                        {name:'Locked', prop:'IsLocked', sortable:true,width:'60'},
                        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
                        {name:'View',prop:'View',sortable:false,width:'60'},
                        {name:'Delete',prop:'Delete',sortable:false,width:'60'},
                        {name:'Signature', prop:'SignatureStatus',sortable:false,width:'60'}]
                }
            }
        });

    }
    public onPageChange() {
        let tem = document.querySelector('.pagination .page-item.active a');
        this.insActivePage=parseInt(tem.innerHTML);
    }

    fnGetSortedValue(value)
    {
        this.insPreviewNextValueService.SetListValues(value);
    }

    lstTemp = [];
    fnLoadSaveDraft() {
        this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = 84;
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
            this.lstFosterCarerDiaryRecording = this.lstTemp.concat(lstSaveDraft);
            this.isDefaultSortOrderVal = "desc";
            if(this.objQeryVal.apage!=undefined)
            this.insActivePage= parseInt(this.objQeryVal.apage);
        });
    }
    private bindFosterCarerDiaryRecording() {
        this.loading = true;
        let id = this.ChildID;
        this.objFosterCarerDiaryRecording.ChildId = id;
        // this.apiService.post(this.controllerName,"GetAllByChildId", this.objFosterCarerDiaryRecording).then(data => {
        //     this.lstTemp = data;
        //     this.fnLoadSaveDraft();
        // });
        this.apiService.post(this.controllerName,"GetListByChildId", this.objFosterCarerDiaryRecording).then(data => {
            this.fosterCarerDiaryRecordingList =data;
            this.insPreviewNextValueService.SetListValuesNew(data);
            this.loading=false;
        });
    }

    fnAddData() {
        this._router.navigate(['/pages/child/fostercarerdiaryrecordingdata/0/4/1']);
    }

    editFosterCarerDiaryRecording(FosterCarerDiaryRecordingId, hasDraft) {
        if (hasDraft)
            Common.SetSession("SaveAsDraft", "Y");
        else
            Common.SetSession("SaveAsDraft", "N");

        this._router.navigate(['/pages/child/fostercarerdiaryrecordingdata', FosterCarerDiaryRecordingId,4,this.insActivePage]);
    }

    deleteFosterCarerDiaryRecording(SequenceNo, hasDraft) {
        this.objFosterCarerDiaryRecording.SequenceNo = SequenceNo;
        //this.objFosterCarerDiaryRecording.UniqueID = UniqueID;
        if (!hasDraft)
            this.apiService.delete(this.controllerName, this.objFosterCarerDiaryRecording).then(data => this.Respone(data));
        else {
            this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
            this.objSaveDraftInfoDTO.FormCnfgId = 84;
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
            this.bindFosterCarerDiaryRecording();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objFosterCarerDiaryRecording.SequenceNo;
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
            this.editFosterCarerDiaryRecording($event.SequenceNo,false);
        else if($event.SaveAsDraftStatus=='Saved as Draft')
            this.editFosterCarerDiaryRecording($event.SequenceNo,true);
    }
    onDelete($event){
        if($event.SaveAsDraftStatus=='Submitted')
            this.deleteFosterCarerDiaryRecording($event.SequenceNo,false);
        else if($event.SaveAsDraftStatus=='Saved as Draft')
            this.deleteFosterCarerDiaryRecording($event.SequenceNo,true);
    }

    onSignClick($event){
        this._router.navigate(['/pages/child/fcdiaryrecordingfcsignature', $event.SequenceNo,this.ChildID ]);
    }
}
