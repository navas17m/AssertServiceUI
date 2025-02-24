import { Location } from '@angular/common';
import { Component, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { LocalAuthority } from '../systemadmin/DTO/localauthority';
import { LocalAuthoritySWHistoryDTO } from './DTO/localauthorityswhistorydto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component({
    selector: 'LocalAuthoritySWHistory',
    templateUrl: './localauthorityswhistory.component.template.html',
})

export class LocalAuthoritySWHistoryComponent {
    objSWHistoryDTO: LocalAuthoritySWHistoryDTO = new LocalAuthoritySWHistoryDTO();
    submitted = false;
    _Form: FormGroup;
    objQeryVal;
    invoicelist = [];
    SWHistoryOld = [];
    IsVisibleAddtoSiblingsRecord = false;
    LocalAuthoritySWInfo = [];
    objLocalAuthority: LocalAuthority = new LocalAuthority;
    IsVisible = false;
    IsCurrentSWId;
    objVisitDateHistoryList;
    @ViewChild('btnInfoModel') infoModal: ElementRef;
    AgencyProfileId: number; ChildId: number;
    isLoading: boolean = false; controllerName = "LocalAuthoritySWHistory";
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=89;
    constructor(private apiService: APICallService, private _formBuilder: FormBuilder, private location: Location,
        private route: ActivatedRoute, private _router: Router, private modal: PagesComponent, private renderer: Renderer2) {

        this.route.params.subscribe(data => this.objQeryVal = data);
        this._Form = _formBuilder.group({
            LocalAuthoritySWInfoId: ['0', Validators.required],
            ChangedDate: [''],//Validators.required
            AddtoParentChildRecord: [],
            AddtoSiblingsRecord: []
        });

        this.ChildId = this.objQeryVal.cid
        this.objSWHistoryDTO.ChangedDate = null;
        this.objSWHistoryDTO.ChildId = this.ChildId;
        this.objSWHistoryDTO.LocalAuthoritySWHistoryId = this.objQeryVal.id;

        if (this.objQeryVal.id != 0)
            this.fnLoadCurrentData();
        else
            this.apiService.post(this.controllerName,"GetSWInfoList", this.objSWHistoryDTO).then(data => this.LocalAuthoritySWInfo = data);

            if(Common.GetSession("ViweDisable")=='1'){
                this.objUserAuditDetailDTO.ActionId = 4;
                this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
                this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
                this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
                this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildId;
                this.objUserAuditDetailDTO.RecordNo = 0;
                Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
                }    
    }

    fnLoadCurrentData() {
        this.apiService.post(this.controllerName,"GetAllByChildIdndSWId", this.objSWHistoryDTO).then(data => {
        //    console.log(data);
            this.SWHistoryOld = data.SWHistoryOld;
            // console.log(data);
            this.LocalAuthoritySWInfo = data.LocalAuthoritySWInfo;
            if (data.SWHistory != null) {
                this.objSWHistoryDTO = data.SWHistory;
                this.setChangeDate();
                this.fnChangeLA(this.objSWHistoryDTO.LocalAuthoritySWInfoId, 0);
                this.IsVisible = true;
                this.IsCurrentSWId = this.objSWHistoryDTO.LocalAuthoritySWInfoId;
            }
        });
    }

    //View
    alertInfo() {
        let event = new MouseEvent('click', { bubbles: true });
        this.infoModal.nativeElement.dispatchEvent(event);
    }

    fnView(id) {
        let temp = this.SWHistoryOld.filter(x => x.LocalAuthoritySWHistoryId == id);
        this.objVisitDateHistoryList = temp[0].SWVisitDateHistory;
        this.alertInfo();
    }
    //End

    dateString;
    setChangeDate() {
        this.objSWHistoryDTO.ChangedDate = this.modal.GetDateEditFormat(this.objSWHistoryDTO.ChangedDate);
    }

    fnChangeLA(val, isChange) {
        if (isChange == 1 && val == this.IsCurrentSWId) {
            this.objSWHistoryDTO.ChildId = this.ChildId;
            this.fnLoadCurrentData();
            this.IsVisibleAddtoSiblingsRecord = false;
        }
        //else if (isChange == 1) {
        //    //clear 
        //    // this.SWHistoryOld = [];
        //    this.IsVisibleAddtoSiblingsRecord = true;
        //    this.objSWHistoryDTO = new LocalAuthoritySWHistoryDTO();
        //    this.objSWHistoryDTO.LocalAuthoritySWInfoId = val;
        //    this.objSWHistoryDTO.SWVisitDateHistory = null;
        //    this.objSWHistoryDTO.ChildId = this.ChildId;
        //}

        if (val != "" && val != null) {
            let temp = this.LocalAuthoritySWInfo.filter(x => x.LocalAuthoritySWInfoId == val);
            this.objLocalAuthority = temp[0];
            this.IsVisible = true;
        }
    }

    clicksubmit(mainFormBuilder, datelistHistory) {
        this.submitted = true;
        if (mainFormBuilder.valid) {
            this.isLoading = true;
            this.objSWHistoryDTO.ChildId = this.ChildId;
            this.objSWHistoryDTO.SWVisitDateHistory = datelistHistory;
            this.objSWHistoryDTO.ChangedDate = this.modal.GetDateSaveFormat(this.objSWHistoryDTO.ChangedDate);
            let type = "save";
            if (this.objQeryVal.id != 0)
                type = "update"
            this.apiService.save(this.controllerName, this.objSWHistoryDTO, type).then(data => this.Respone(data, type));
        }
    }

    private Respone(data, type) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            if (type == "save")
            {
                this.modal.alertSuccess(Common.GetSaveSuccessfullMsg);
                this.objUserAuditDetailDTO.ActionId =1;
                this.objUserAuditDetailDTO.RecordNo = data.SequenceNumber;
            }                
            else
            {
                this.modal.alertSuccess(Common.GetUpdateSuccessfullMsg);
                this.objUserAuditDetailDTO.ActionId =2;
                this.objUserAuditDetailDTO.RecordNo = 0;
            }
                
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildId;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
            this._router.navigate(['/pages/referral/lasocialworkerhistorylist/' + this.objQeryVal.mid]);
        }
    }
}

