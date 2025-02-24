import {PagesComponent} from '../pages.component'
import { Component, Input, OnInit, Injectable, Directive, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
//import {Http, Response, Headers, RequestOptions, Jsonp} from '@angular/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Common} from '../common';
import {PhysicianChildMappingDTO} from './DTO/physicianchildmappingdto'
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
import { FieldConfig } from '../superadmin/DTO/fieldconfig';

@Component({
    selector: 'physicianchildmapping',
    templateUrl: './physicianinfochildmapping.component.template.html',
})

export class PhysicianChildMappingComponent {
    public returnVal:any[];
    _Form: FormGroup;
    arrayPhysicianList = [];
    objPhysicianChildMappingDTO: PhysicianChildMappingDTO = new PhysicianChildMappingDTO();
    lstChildList = [];
    lstChildListOG = [];
    submitted = false;
    AssignedPhysicianList = [];
    physicianIds:string="";
    columns =[
        {name:'Physician Name',prop:'PhysicianName',sortable:true,width:'200'},
        {name:'Type',prop:'PhysicianType',sortable:true,width:'150'},
        {name:'Telephone',prop:'ContactInfo.HomePhone',sortable:false,width:'150'},
        {name:'Details',prop:'Button',label:'Details',class:'btn btn-warning',width:'100'},
        {name:'Un-assign',prop:'Button',label:'Un-assign',class:'btn btn-danger',width:'100'}
       ];
    isLoading: boolean = false;
    controllerName = "PhysicianInfo";
    lstChildStatus;
    lstAreaOffice;
    ChildStatusId;
    AreaOfficeProfileId;
    ChildId;
    FormCnfgId = 119;
    //Details
    @ViewChild('btnViewGPDetails') btnViewGPDetails: ElementRef;
    @ViewChild('btnUnAssign') btnUnAssign: ElementRef;
    @ViewChild('btnAddNewGP') btnAddNewGP: ElementRef;
    insGPDetails;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    
    constructor(private apiService: APICallService, private renderer: Renderer2,
        private _formBuilder: FormBuilder, private pComponent: PagesComponent, private _router: Router) {

        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildId = parseInt(Common.GetSession("ChildId"));
            this.objPhysicianChildMappingDTO.ChildId = this.ChildId;
            this.ChildChange(this.ChildId);
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/physicianchildmap/19");
            this._router.navigate(['/pages/referral/childprofilelist/1/16']);
        }

        this._Form = _formBuilder.group({
            ChildId: ['0', Validators.required],
            // ChildStatusId: ['0'],
            // AreaOfficeProfileId: ['0'],
        });
        //   this.apiService.get("AreaOfficeProfile", "getall").then(data => { this.lstAreaOffice = data });
        this.BindChild();

        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildId;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }

    fnViewGPDetails(PhysicianInfoId) {
        this.insGPDetails = "";
        let details = this.AssignedPhysicianList.filter(x => x.PhysicianInfoId == PhysicianInfoId);
        if (details.length > 0)
            this.insGPDetails = details[0];
        let event = new MouseEvent('click', { bubbles: true });
        this.btnViewGPDetails.nativeElement.dispatchEvent(event);
    }


    //fnLoadChild() {

    //    this.submitted = false;
    //    this.AssignedPhysicianList = [];
    //    this.objPhysicianChildMappingDTO.ChildId = null;
    //    if (this.ChildStatusId && this.AreaOfficeProfileId)
    //        this.lstChildList = this.lstChildListOG.filter(x => x.ChildStatusId == this.ChildStatusId && x.AreaOfficeProfile.AreaOfficeProfileId == this.AreaOfficeProfileId);
    //    else if (this.ChildStatusId)
    //        this.lstChildList = this.lstChildListOG.filter(x => x.ChildStatusId == this.ChildStatusId);
    //    else if (this.AreaOfficeProfileId)
    //        this.lstChildList = this.lstChildListOG.filter(x => x.AreaOfficeProfile.AreaOfficeProfileId == this.AreaOfficeProfileId);
    //    else if (!this.ChildStatusId && !this.AreaOfficeProfileId)
    //        this.lstChildList = this.lstChildListOG;



    //}
    BindChild() {
        this.apiService.get(this.controllerName, "GetAllChildProfile").then(data => {
            this.lstChildList = data;
            this.lstChildListOG = data;
        })
    }

    ChildChange(childID) {
        this.apiService.get(this.controllerName, "GetPhysicianMapBycId", childID).then(data => {
            this.childchageResponse(data.LstPhysician);
            this.AssignedPhysicianList = data.LstPhysicianMapped;
        })
    }

    childchageResponse(data) {
        this.arrayPhysicianList = [];
        this.physicianIds="";
        if (data != null) {
            data.forEach(item => {
                this.arrayPhysicianList.push({ id: item.PhysicianInfoId, name: item.PhysicianName + ' (' + item.PhysicianType + ')' });
            });
        }
    }

    ClickUnassign(mappingId) {
        this.PhysicianChildMappingId = mappingId;
        let event = new MouseEvent('click', { bubbles: true });
        this.btnUnAssign.nativeElement.dispatchEvent(event);
    }

    PhysicianChildMappingId = 0;
    fnUnassignConfirm() {
        if (this.PhysicianChildMappingId != 0)
            this.apiService.get(this.controllerName, "UnassignPhysicianChildMapping", this.PhysicianChildMappingId).then(data => this.Respone(data, "delete"));
    }

    IsShowError = false;
    Submit(form, physicianInfoIds) {
        this.submitted = true;
        if (form.valid && physicianInfoIds.length == 0)
            this.IsShowError = true;

        if (form.valid && physicianInfoIds.length > 0) {
            this.isLoading = true;
            this.objPhysicianChildMappingDTO.ChildId = this.ChildId;
            this.objPhysicianChildMappingDTO.PhysicianInfoIds = physicianInfoIds;
            let type = "save";
            this.apiService.post(this.controllerName, "SavePhysicianChildMapping", this.objPhysicianChildMappingDTO).then(data => this.Respone(data, type));
        }
    }

    private Respone(filedConfig, type) {
        this.submitted = false;
        this.isLoading = false;
        if (filedConfig.IsError == true) {
            this.pComponent.alertDanger(filedConfig.ErrorMessage)
        }
        else if (filedConfig.IsError == false) {
            if (type == "save")
            {
                this.pComponent.alertSuccess(Common.GetSaveSuccessfullMsg);
                this.objUserAuditDetailDTO.ActionId =1;
                this.objUserAuditDetailDTO.RecordNo = 0;
            }                
            else if (type == "delete")
            {
                this.pComponent.alertSuccess(Common.GetDeleteSuccessfullMsg);
                this.objUserAuditDetailDTO.ActionId =3;
                this.objUserAuditDetailDTO.RecordNo = filedConfig.SequenceNumber;
            }                

            this.ChildChange(this.objPhysicianChildMappingDTO.ChildId);
            this.arrayPhysicianList = [];
        }
    }

    fnAddNewGP() {

        let event = new MouseEvent('click', { bubbles: true });
        this.btnAddNewGP.nativeElement.dispatchEvent(event);

    }

    fnSubmitNewPhsicianInfo() {

        let event = new MouseEvent('click', { bubbles: true });
        this.btnAddNewGP.nativeElement.dispatchEvent(event);
        this.ChildChange(this.objPhysicianChildMappingDTO.ChildId);
    }
    onButtonEvent($event){
        //console.log($event);
        if($event.buttonName == 'Details')
            this.fnViewGPDetails($event.PhysicianInfoId);
        else if ($event.buttonName == 'Un-assign')
            this.ClickUnassign($event.PhysicianChildMappingId);
    }
}
