import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component} from '@angular/core';
import { Common } from '../common'
import { Base } from '../services/base.service'
import { ChildRiskAssessmentDTO } from './DTO/childriskassessmentdto';
import { PagesComponent } from '../pages.component';
import { SaveDraftInfoDTO} from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';

@Component
    ({
    selector: 'RiskAssessmentInitialList',
    templateUrl: './riskassessmentinitiallist.component.template.html',
    })

export class RiskAssessmentInitialList {
    public searchText: string = "";
    riskAssessmentList = []; loading = false;
    riskAssessmentInitialList = [];
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'Carer Name',prop:'CarerName',sortable:true,width:'350'},
        {name:'Progress Start Date',prop:'ProgressStartDate',sortable:true,width:'100'},
        {name:'Status',prop:'SaveAsDraftStatus',sortable:true,width:'80'},
        {name:'Edit',prop:'Edit',sortable:false,width:'50'},
        {name:'View',prop:'View',sortable:false,width:'50'},
        {name:'Delete',prop:'Delete',sortable:false,width:'50'},
        ];
    objRiskAssessmentDTO: ChildRiskAssessmentDTO = new ChildRiskAssessmentDTO();
    returnVal;
    carerParentId; objQeryVal;
    ChildID: number;
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    controllerName = "ChildRiskAssessmentInitial"; 
    constructor(private apiService: APICallService, private modal: PagesComponent,
        private _router: Router, private activatedroute: ActivatedRoute) {
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindRiskAssessment();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/riskassessmentinitiallist/4");
            this._router.navigate(['/pages/referral/childprofilelist/1/16']);
        }
    }
    lstTemp = [];
    fnLoadSaveDraft() {
        this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = 320;
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
            this.riskAssessmentList = this.lstTemp.concat(lstSaveDraft);

        });
    }
    private bindRiskAssessment() {
        this.loading = true;
        // this.apiService.get(this.controllerName,"GetAll",this.ChildID).then(data => {
        //     this.lstTemp = data;
        //     this.fnLoadSaveDraft();
        // });
        this.apiService.get(this.controllerName,"GetList",this.ChildID).then(data => {
            //this.lstTemp = data;
            //this.fnLoadSaveDraft();
            this.riskAssessmentInitialList = data;
            this.loading = false;
        });
    }

    fnAddData() {
        this._router.navigate(['/pages/child/riskassessmentinitialdata/0/0/4']);
    }

    edit(id, CId,hasDraft) {
        if (hasDraft)
            Common.SetSession("SaveAsDraft", "Y");
        else
            Common.SetSession("SaveAsDraft", "N");

        this._router.navigate(['/pages/child/riskassessmentinitialdata/' + id + "/" + CId + "/" + "4"]);
    }
    
    delete(SequenceNo, hasDraft) {
        this.objRiskAssessmentDTO.SequenceNo = SequenceNo;
        //this.objRiskAssessmentDTO.UniqueID = UniqueID;
        if (!hasDraft)
            this.apiService.delete(this.controllerName, this.objRiskAssessmentDTO).then(data => this.Respone(data));
        else {
            this.objSaveDraftInfoDTO.SequenceNo = SequenceNo;
            this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = 320;
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
            this.edit($event.SequenceNo,$event.CarerParentId,false);
        else if($event.SaveAsDraftStatus=='Saved as Draft')
            this.edit($event.SequenceNo,$event.CarerParentId,true);
    }
    onDelete($event){
        if($event.SaveAsDraftStatus=='Submitted')
            this.delete($event.SequenceNo,false);
        else if($event.SaveAsDraftStatus=='Saved as Draft')
            this.delete($event.SequenceNo,true);
    }
}