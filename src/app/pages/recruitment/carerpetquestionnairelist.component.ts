import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { SaveDraftInfoDTO } from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';
import { CarerPetQuestionnaireDTO } from './DTO/carerpetquestionnairedto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component
    ({
        selector: 'carerpetquestionnairelist',
        templateUrl: './carerpetquestionnairelist.component.template.html',
    })

export class CarerPetQuestionnaireListComponent {
    public searchText: string = "";
    controllerName = "CarerPetQuestionnaire";
    lstCarerPetQuestionnaire = [];
    carerPetQuestionnaireList=[];
    objCarerPetQuestionnaireDTO: CarerPetQuestionnaireDTO = new CarerPetQuestionnaireDTO();
    objQeryVal;
    returnVal;
    CarerParentId: number;
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    FormCnfgId;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'Inspection Date',prop:'PetQuestionnaireDate',sortable:true,width:'200',date:'Y'},
        {name:'Next Inspection Date',prop:'NextInspectionDate',sortable:true,width:'150',date:'Y'},
        {name:'Name Of Pet',prop:'NameOfPet',sortable:true,width:'200'},
        {name:'Status',prop:'SaveAsDraftStatus',sortable:true,width:'150'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
        {name:'View',prop:'View',sortable:false,width:'60'},
        {name:'Delete',prop:'Delete',sortable:false,width:'60'}
       ];
    constructor(private route: ActivatedRoute,
        private _router: Router, private module: PagesComponent, private apiService: APICallService) {

        this.route.params.subscribe(data => this.objQeryVal = data);
        if (this.objQeryVal.mid == 3 && (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0")) {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 14]);
        }
        if (this.objQeryVal.mid == 13 && (Common.GetSession("CarerParentId") == null || Common.GetSession("CarerParentId") == "0")) {
            this._router.navigate(['/pages/recruitment/applicantlist', 13, 14]);
        }

        if (this.objQeryVal.mid == 3) {
            this.FormCnfgId = 47;
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
        }
        else if (this.objQeryVal.mid == 13) {
            this.FormCnfgId = 27;
            this.CarerParentId = parseInt(Common.GetSession("CarerParentId"));
        }

        this.bindCarerPetQuestionnaire();
        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }

    private bindCarerPetQuestionnaire() {
        if (this.CarerParentId) {
            this.objCarerPetQuestionnaireDTO.CarerParentId = this.CarerParentId;
            this.objCarerPetQuestionnaireDTO.FormCnfgId = 27;
            //this.cdlServics.getPetQuestionnaireList(this.objCarerPetQuestionnaireDTO).then(data => {
            //    this.lstTemp = data;
            //    this.fnLoadSaveDraft();
            //});
            // this.apiService.post(this.controllerName, "GetAllByCarerParentId", this.objCarerPetQuestionnaireDTO).then(data => {
            //     this.lstTemp = data;
            //     this.fnLoadSaveDraft();
            // });
            this.apiService.post(this.controllerName, "GetListByCarerParentId", this.objCarerPetQuestionnaireDTO).then(data => {
                this.carerPetQuestionnaireList =data;
                console.log(data);
            });
        }
    }
    lstTemp = [];
    fnLoadSaveDraft() {
        this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = 27;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;
        this.objSaveDraftInfoDTO.TypeId = this.CarerParentId;
        let lstSaveDraft = [];
        this.apiService.post("SaveAsDraftInfo", "getall", this.objSaveDraftInfoDTO).then(data => {
            let jsonData = [];
            data.forEach(item => {
                jsonData = JSON.parse(item.JsonList);
                jsonData.forEach(T => {
                    lstSaveDraft.push(T);
                });

            });

            //this.sdService.getList(this.objSaveDraftInfoDTO).then(data => {
            //    let jsonData = [];
            //    data.forEach(item => {
            //        jsonData = JSON.parse(item.JsonList);
            //        jsonData.forEach(T => {
            //            lstSaveDraft.push(T);
            //        });

            //    });
            this.lstCarerPetQuestionnaire = this.lstTemp.concat(lstSaveDraft);

        });
    }
    fnAddData() {
        if (this.objQeryVal.mid == 13)
            this._router.navigate(['/pages/recruitment/carerpetquestionnairedata/0/13']);
        else
            this._router.navigate(['/pages/fostercarer/carerpetquestionnairedata/0/3']);
    }

    editCarerPetQuestionnaire(CarerPetQuestionnaireId, hasDraft) {
        if (hasDraft)
            Common.SetSession("SaveAsDraft", "Y");
        else
            Common.SetSession("SaveAsDraft", "N");
        if (this.objQeryVal.mid == 13)
            this._router.navigate(['/pages/recruitment/carerpetquestionnairedata', CarerPetQuestionnaireId, this.objQeryVal.mid]);
        else
            this._router.navigate(['/pages/fostercarer/carerpetquestionnairedata', CarerPetQuestionnaireId, this.objQeryVal.mid]);
    }

    deleteCarerPetQuestionnaire(SequenceNo, hasDraft) {
    //    console.log(SequenceNo);
        this.objCarerPetQuestionnaireDTO.SequenceNo = SequenceNo;
        //this.objCarerPetQuestionnaireDTO.UniqueID = UniqueID;
        if (!hasDraft) {
            //this.cdlServics.post(this.objCarerPetQuestionnaireDTO, "delete").then(data => this.Respone(data));
           this.apiService.delete(this.controllerName, this.objCarerPetQuestionnaireDTO).then(data => this.Respone(data));
        }
        else {
            this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = 27;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;
        this.objSaveDraftInfoDTO.TypeId = this.CarerParentId;
            this.objSaveDraftInfoDTO.SequenceNo = SequenceNo;
            //this.sdService.delete(this.objSaveDraftInfoDTO).then(data => {
            //    this.Respone(data);
            //});

            this.apiService.delete("SaveAsDraftInfo", this.objSaveDraftInfoDTO).then(data => {
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
            this.bindCarerPetQuestionnaire();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objCarerPetQuestionnaireDTO.SequenceNo;
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
            this.editCarerPetQuestionnaire($event.SequenceNo,false);
        else if($event.SaveAsDraftStatus=='Saved as Draft')
            this.editCarerPetQuestionnaire($event.SequenceNo,true);
    }
    onDelete($event){
        if($event.SaveAsDraftStatus=='Submitted')
            this.deleteCarerPetQuestionnaire($event.SequenceNo,false);
        else if($event.SaveAsDraftStatus=='Saved as Draft')
            this.deleteCarerPetQuestionnaire($event.SequenceNo,true);
    }
}
