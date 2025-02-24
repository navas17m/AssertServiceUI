import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component} from '@angular/core';
import { Common } from '../common'
import { ParentChildDailyWeeklyRecordingDTO } from './DTO/parentchilddailyweeklyrecordingdto';
import { PagesComponent } from '../pages.component';
import { SaveDraftInfoDTO} from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';

@Component
    ({
    selector: 'ParentChildDailyWeeklyRecordingList',
    templateUrl: './parentchilddailyweeklyrecordinglist.component.template.html',
    })

export class ParentChildDailyWeeklyRecordingList {
    public searchText: string = "";
    recordingList = []; loading = false;
    recordingLst = [];
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'Date',prop:'FromDate',sortable:true,width:'200'},
        {name:'SSW has Read Report',prop:'SSWhasReadReport',sortable:true,width:'300'},
        {name:'Status',prop:'SaveAsDraftStatus',sortable:true,width:'100'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
        {name:'View',prop:'View',sortable:false,width:'60'},
        {name:'Delete',prop:'Delete',sortable:false,width:'60'},
        ];
    objParentChildDailyWeeklyRecordingDTO: ParentChildDailyWeeklyRecordingDTO = new ParentChildDailyWeeklyRecordingDTO();
    returnVal;
    carerParentId; objQeryVal;
    ChildID: number;
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    controllerName = "ParentChildDailyWeeklyRecording"; 
    constructor(private apiService: APICallService, private modal: PagesComponent,
        private _router: Router, private activatedroute: ActivatedRoute) {
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindRiskAssessment();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/parentchilddailyweeklylist/4");
            this._router.navigate(['/pages/referral/childprofilelist/1/16']);
        }
    }
    lstTemp = [];
    fnLoadSaveDraft() {
        this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = 323;
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
            this.recordingList = this.lstTemp.concat(lstSaveDraft);

        });
    }
    private bindRiskAssessment() {
        this.loading = true;
        // this.apiService.get(this.controllerName,"GetAll",this.ChildID).then(data => {
        //     this.lstTemp = data;
        //     this.fnLoadSaveDraft();
        // });
        this.apiService.get(this.controllerName,"GetList",this.ChildID).then(data => {
            this.recordingLst=data;
        });
    }

    fnAddData() {
        this._router.navigate(['/pages/child/parentchilddailyweeklydata/0/4']);
    }

    edit(id,hasDraft) {
        if (hasDraft)
            Common.SetSession("SaveAsDraft", "Y");
        else
            Common.SetSession("SaveAsDraft", "N");

        this._router.navigate(['/pages/child/parentchilddailyweeklydata/' + id  + "/" + "4"]);
    }
    
    delete(SequenceNo, hasDraft) {
        this.objParentChildDailyWeeklyRecordingDTO.SequenceNo = SequenceNo;
        //this.objParentChildDailyWeeklyRecordingDTO.UniqueID = UniqueID;
        if (!hasDraft)
            this.apiService.delete(this.controllerName, this.objParentChildDailyWeeklyRecordingDTO).then(data => this.Respone(data));
        else {
            this.objSaveDraftInfoDTO.SequenceNo = SequenceNo;
            this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
            this.objSaveDraftInfoDTO.FormCnfgId = 323;
            this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
            this.objSaveDraftInfoDTO.TypeId = this.ChildID;
            this.apiService.post("SaveAsDraftInfo", "Delete", this.objSaveDraftInfoDTO).then(data => {
                this.Respone(data);
            });
        }
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindRiskAssessment();
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