import { Component, Pipe, ViewChild } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms'
import {Common}  from  '../common'
import { SafeguardingDTO} from './DTO/safeguardingdto'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../../pages/services/apicallservice.service';
import {RiskFactorDTO} from './DTO/safeguardingdto'
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component({
        selector: 'safe-riskfactorsdata',
        templateUrl: './safe-riskfactorsdata.component.template.html',
})

export class RiskFactorsDataComponent {
    objRiskFactorDTO:RiskFactorDTO=new RiskFactorDTO();
    controllerName = "ChildRiskFactors";
    objSafeguardingDTO: SafeguardingDTO = new SafeguardingDTO();
    submitted = false; submittedUpload = false;
    dynamicformcontrol = [];
    _Form: FormGroup;
    isVisibleMandatortMsg;
    SequenceNo;
    objQeryVal;
    formId;
    tblPrimaryKey;
    @ViewChild('uploads') uploadCtrl;
    TypeId;
    ChildID: number;
    AgencyProfileId: number;
    insChildDetails;
    insChildDetailsTemp;
    ChildCode;
    mainTabActive = "active";
    DocumentActive;
    isLoading: boolean = false;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=381;
    constructor(private _formBuilder: FormBuilder,
        private allAPIservice: APICallService,
        private route: ActivatedRoute, private _router: Router, private modal: PagesComponent) {
        this.route.params.subscribe(data => this.objQeryVal = data);
        if (Common.GetSession("ChildId") != null)
            this.ChildID = parseInt(Common.GetSession("ChildId"));
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objRiskFactorDTO.AgencyProfileId = this.AgencyProfileId;
        this.objRiskFactorDTO.ChildId = this.ChildID;
        this.SequenceNo = this.objQeryVal.id;
        if (this.SequenceNo != 0 && this.SequenceNo != null) {
            this.tblPrimaryKey = this.SequenceNo;
            this.objRiskFactorDTO.ChildRiskFactorsId = this.SequenceNo;
        } else {
            this.objRiskFactorDTO.ChildRiskFactorsId = 0;
        }

        if (Common.GetSession("SelectedChildProfile") != null) {
            this.insChildDetailsTemp = JSON.parse(Common.GetSession("SelectedChildProfile"));

            this.ChildCode = this.insChildDetailsTemp.ChildCode;
        }

        if(this.objRiskFactorDTO.ChildRiskFactorsId!=0)
        {
            this.allAPIservice.get(this.controllerName,"GetById",this.objRiskFactorDTO.ChildRiskFactorsId).then(data => {
                this.objRiskFactorDTO = data;
                this.objRiskFactorDTO.DateofAssessment=this.modal.GetDateEditFormat(this.objRiskFactorDTO.DateofAssessment);
            });
        }

        this._Form = _formBuilder.group({
            DateofAssessment:['',Validators.required],
            ChildRiskFactorsId:[],
            DeviantSexualInterests:[],
            SexualInterests:[],
            AttitudesSupportive:[],
            Unwillingness:[],
            EverSexuallyAssaulted2:[],
            EverSexuallyAssaultedSame:[],
            PriorAdultSanctions:[],
            Threats:[],
            SexuallyAssaultedChild:[],
            SexuallyAssaultedStranger:[],
            Indiscriminate:[],
            MaleOffenderOnly:[],
            DiverseSexual:[],
            AntisocialInterpersonal:[],
            LackofIntimate:[],
            NegativePeerAssociations:[],
            InterpersonalAggression:[],
            RecentEscalation:[],
            PoorSelf:[],
            HighStressFamily:[],
            ProblematicParentOffender:[],
            ParentNotSupporting:[],
            EnvironmentSupporting:[],
            NoDevelopment:[],
            IncompleteSexual:[],
            OtherFactor:[],
            OverallRiskRating:[],
        });
        //Doc
        this.formId = 381;
        this.TypeId = this.ChildID;
        this.tblPrimaryKey = this.SequenceNo;

        if (Common.GetSession("ViweDisable") == '1') {
            this.objUserAuditDetailDTO.ActionId = 4;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }

    fnMainTab() {
        this.mainTabActive = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetailTab() {
        this.mainTabActive = "";
        this.DocumentActive = "active";
    }

    clicksubmit(UploadDocIds, IsUpload, uploadFormBuilder) {
        this.submitted = true;
        if (this._Form.valid) {
            this.isLoading = true;
            let type = "save";
            if (this.SequenceNo > 0)
                type = "update";
            this.objRiskFactorDTO.DateofAssessment=this.modal.GetDateSaveFormat(this.objRiskFactorDTO.DateofAssessment);
            this.objRiskFactorDTO.ChildId = this.ChildID;
            this.allAPIservice.save(this.controllerName,this.objRiskFactorDTO,type ).then(data =>
                this.Respone(data, type, IsUpload)
            );
        }
    }

    private Respone(data, type, IsUpload) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (type == "save") {
                this.objUserAuditDetailDTO.ActionId =1;
                this.objUserAuditDetailDTO.RecordNo = data.SequenceNumber;
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(data.SequenceNumber);
                }
                this.modal.alertSuccess(Common.GetSaveSuccessfullMsg);
            }
            else {
                this.objUserAuditDetailDTO.ActionId =2;
                this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.tblPrimaryKey);
                }
                this.modal.alertSuccess(Common.GetUpdateSuccessfullMsg);
            }

            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.formId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
            this._router.navigate(['/pages/child/riskfactorslist/43']);
        }
    }
}
