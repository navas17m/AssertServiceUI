import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { SaveDraftInfoDTO } from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';
//import { ChildSupervisoryHomeVisitService } from '../services/childsupervisoryhomevisit.service'
import { ChildDetailsDTO } from './DTO/childdetailsdto';
import { ChildSupervisoryHomeVisitDTO } from './DTO/childsupervisoryhomevisitdto';

@Component
    ({
        selector: 'childsupervisoryhomevisitlist',
        templateUrl: './childsupervisoryhomevisitlist.component.template.html',

    })

export class ChildSupervisoryHomeVisitListComponent {
    public searchText: string = "";
    isDefaultSortOrderVal: string;
    controllerName = "ChildSupervisoryHomeVisit";
    lstChildSupervisoryHomeVisit = [];
    objChildDetailsDTO: ChildDetailsDTO = new ChildDetailsDTO();
    objChildSupervisoryHomeVisitDTO: ChildSupervisoryHomeVisitDTO = new ChildSupervisoryHomeVisitDTO();
    submitted = false;
    _Form: FormGroup;
    returnVal;
    lstChild; FormCnfgId = 59;
    FormCnfgIdOG = 100;
    objQeryVal; objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    CarerSHVSequenceNo;
    loading = false;insActivePage:number;
    columns =[
      {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
      {name:'Child Name (Code)',prop:'ChildName',sortable:true,width:'120'},
      {name:'Date of Visit',prop:'DateOfVisitChild',sortable:true,width:'120',datetime:'Y'},
      {name:'Status',prop:'SaveAsDraftStatus',sortable:true,width:'100'},
      {name:'Locked',prop:'IsLocked',sortable:true,width:'100'},
      {name:'Edit',prop:'Edit',sortable:false,width:'60'},
      {name:'View',prop:'View',sortable:false,width:'60'},
      {name:'Delete',prop:'Delete',sortable:false,width:'60'},
      {name:'Signature', prop:'IsFCSignatureSigned',sortable:false,width:'60'}];
    constructor(private _formBuilder: FormBuilder, private route: ActivatedRoute,
        private _router: Router, private module: PagesComponent, private apiService: APICallService) {
            this.insActivePage=1;
        this.route.params.subscribe(data => this.objQeryVal = data);
        this.CarerSHVSequenceNo = this.objQeryVal.Id;
        this._Form = _formBuilder.group({
            searchText: [],
        });
        this.bindChildSupervisoryHomeVisit();

    }

    public onPageChange() {
        let tem = document.querySelector('.pagination .page-item.active a');
        this.insActivePage=parseInt(tem.innerHTML);
    }

    fnAddData() {
        Common.SetSession("SaveAsDraft", "N");
        this._router.navigate(['/pages/fostercarer/childsupervisoryhomevisitdata', 0, this.CarerSHVSequenceNo, 0, 4,1]);
    }

    btnBackCarerSHVList() {
        this._router.navigate(['/pages/fostercarer/carersupervisoryhomevisitlist']);
    }
    lstTemp = [];
    fnLoadSaveDraft() {
        this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = 100;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
        this.objSaveDraftInfoDTO.TypeId = this.CarerSHVSequenceNo;
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
    private bindChildSupervisoryHomeVisit() {
        this.loading = true;
        // this.apiService.get(this.controllerName, "GetChildSHVListForCarerSHVId", this.CarerSHVSequenceNo).then(data => {
        //     this.lstTemp = data;
        //     this.fnLoadSaveDraft();
        // });
        this.apiService.get(this.controllerName, "GetChildSHVsForCarerSHVId", this.CarerSHVSequenceNo).then(data => {
            this.childSupervisoryHomeVisits = data;
            this.loading = false;
      });
    }
    childSupervisoryHomeVisits=[];
    editChildSupervisoryHomeVisit(childSHVSequenceNo, childId, hasDraft) {

        if (hasDraft)
            Common.SetSession("SaveAsDraft", "Y");
        else
            Common.SetSession("SaveAsDraft", "N");

        this._router.navigate(['/pages/fostercarer/childsupervisoryhomevisitdata', childId, this.objQeryVal.Id, childSHVSequenceNo, 4,this.insActivePage]);
    }

    deleteChildSupervisoryHomeVisit(SequenceNo, hasDraft) {
        ///   alert(SequenceNo);
        //   alert(UniqueID);
        this.objChildSupervisoryHomeVisitDTO.SequenceNo = SequenceNo;
        //this.objChildSupervisoryHomeVisitDTO.UniqueID = UniqueID;
        //  this.cdlServics.post(this.objChildSupervisoryHomeVisitDTO, "delete").then(data => this.Respone(data));
        if (!hasDraft) {
            this.apiService.delete(this.controllerName, this.objChildSupervisoryHomeVisitDTO).then(data => this.Respone(data));
        }
        else {
            this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
            this.objSaveDraftInfoDTO.FormCnfgId = 100;
            this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
            this.objSaveDraftInfoDTO.TypeId = this.CarerSHVSequenceNo;
            this.objSaveDraftInfoDTO.SequenceNo = SequenceNo;
            this.apiService.post("SaveAsDraftInfo", "Delete", this.objSaveDraftInfoDTO).then(data => {
                this.Respone(data);
            });
        }
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.module.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindChildSupervisoryHomeVisit();
        }
    }
    onEdit($event){
      if($event.SaveAsDraftStatus=='Submitted')
          this.editChildSupervisoryHomeVisit($event.SequenceNo,$event.ChildId,false);
      else if($event.SaveAsDraftStatus=='Saved as Draft')
          this.editChildSupervisoryHomeVisit($event.SequenceNo,$event.ChildId,true);
    }
    onDelete($event){
      if($event.SaveAsDraftStatus=='Submitted')
          this.deleteChildSupervisoryHomeVisit($event.SequenceNo,false);
      else if($event.SaveAsDraftStatus=='Saved as Draft')
          this.deleteChildSupervisoryHomeVisit($event.SequenceNo,true);
    }
    onSignClick($event){
      this._router.navigate(['/pages/fostercarer/childShvfcsignature',$event.ChildId,this.objQeryVal.Id,$event.SequenceNo]);
    }
}
