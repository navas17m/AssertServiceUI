﻿import { Component } from '@angular/core';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { AgencySignatureMappingDTO } from './DTO/agencysignaturemappingdto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component({
    selector: 'agencysignaturecnfg',
    templateUrl: './agencysignaturecnfg.component.template.html',
})

export class AgencySignatureCnfgComponent {   
    myOptions: IMultiSelectOption[];
    mySettings: IMultiSelectSettings = {
        pullRight: false,
        enableSearch: false,
        checkedStyle: 'checkboxes',
        buttonClasses: 'btn btn-default',
        selectionLimit: 0,
        closeOnSelect: false,
        showCheckAll: true,
        showUncheckAll: true,
        dynamicTitleMaxItems: 0,        
        maxHeight: '300px',
    };

    myTexts: IMultiSelectTexts = {
        checkAll: 'Check all',
        uncheckAll: 'Uncheck all',
        checked: 'checked',
        checkedPlural: 'checked',
        searchPlaceholder: 'Search...',
        defaultTitle: 'Select',
    };
   
   // @ViewChild('ddFormNotification') ddFormNotification;  
    lstAgencySignatureMapping; arraySignatureIds = []; arrAgencySignatureMapping = [];
    isLoading: boolean = false;
    controllerName = "AgencySignatureCnfg";
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=218;
    constructor(private apiService: APICallService, private pComponent: PagesComponent) { 

        this.apiService.get(this.controllerName, "GetAllAgencySignatureCnfg", parseInt(Common.GetSession("AgencyProfileId"))).then(data => {
            data.forEach(item => {
                this.arraySignatureIds.push({ id: item.AgencySignatureCnfgId, name: item.Signature });
            });
            this.apiService.get(this.controllerName, "GetAll", parseInt(Common.GetSession("AgencyProfileId"))).then(data => { this.lstAgencySignatureMapping = data });
        });   

        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 0;
        this.objUserAuditDetailDTO.ChildCarerEmpId = 0;
        this.objUserAuditDetailDTO.RecordNo = parseInt(Common.GetSession("AgencyProfileId"));
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }  

    fnSaveChanges()
    {
        this.isLoading = true;
        for (let item of this.lstAgencySignatureMapping) {
            var _insFN = new AgencySignatureMappingDTO();
            _insFN.AgencySignatureMappingId = item.AgencySignatureMappingId;
            _insFN.arrSignatureIds = item.arrSignatureIds;
            _insFN.ActiveFlag = item.ActiveFlag;
            this.arrAgencySignatureMapping.push(_insFN);
        }
        this.apiService.post(this.controllerName, "Update", this.arrAgencySignatureMapping).then(data => this.Respone(data)); 
        //this.formNotService.Update(this.arrFormNotification).then(data => this.Respone(data)); 
    }

    checkNuncheckAll = false;
    fncheckNuncheckAll(value, checked) {
        this.checkNuncheckAll = !this.checkNuncheckAll;
        if (checked) {
            for (let insAFM of this.lstAgencySignatureMapping) {                
                insAFM.ActiveFlag = true;
            }
        }
        else {
            for (let insAFM of this.lstAgencySignatureMapping) {              
                insAFM.ActiveFlag = false;
            }
        }
    }

    private Respone(data) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.pComponent.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            this.objUserAuditDetailDTO.ActionId =2;
            this.objUserAuditDetailDTO.RecordNo = parseInt(Common.GetSession("AgencyProfileId"));
            this.pComponent.alertSuccess(Common.GetUpdateSuccessfullMsg);
            this.arrAgencySignatureMapping = [];
        }

        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 0;
        this.objUserAuditDetailDTO.ChildCarerEmpId = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }   
}