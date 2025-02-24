import { filter } from 'rxjs/operators';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { CarerTrainingCourseStatusDTO } from './DTO/carertrainingcoursestatusdto';
//import {CarerTrainingProfileService } from '../services/carertrainingprofile.service'
import { CarerTrainingProfileComboDTO } from './DTO/carertrainingprofilecombodto';
import { CarerTrainingProfileDTO } from './DTO/carertrainingprofiledto';
import { ConfigTableNamesDTO } from '../superadmin/DTO/configtablename';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component
    ({
        selector: 'carertrainingprofilelist',
        templateUrl: './carertrainingprofilelist.component.template.html'
    })

export class CarerTrainingProfileListComponent {
    public searchText: string = "";
    searchTextTraing:any="";
    loading = false;
    controllerName = "CarerTrainingProfile";
    objCarerTrainingProfileComboDTO: CarerTrainingProfileComboDTO = new CarerTrainingProfileComboDTO();
    objCarerTrainingCourseStatusDTO: CarerTrainingCourseStatusDTO = new CarerTrainingCourseStatusDTO();
    objCarerTrainingProfileDTO: CarerTrainingProfileDTO = new CarerTrainingProfileDTO();
    submitted = false;
    dynamicformcontrol;
    _Form: FormGroup; objQeryVal;
    returnVal;
    ResponseCarerCourseStatusControl;
    CarerParentId: number;
    isLoading: boolean = false;
    FormCnfgId;
    AgencyProfileId;
    lstCourseStatus=[];
    objConfigTableNamesDTO: ConfigTableNamesDTO = new ConfigTableNamesDTO();
    insActivePage:number;
    limitPerPage:number = 10;
    limitPerPagePPDP:number = 10;
    carerTrainingProfileList=[];
    carerTrainingProfileListPPDP=[];
    footerMessage={
      'emptyMessage':'',
      'totalMessage': ' - Records'
    };
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    constructor(private _formBuilder: FormBuilder,
        private _router: Router, private activatedroute: ActivatedRoute, private module: PagesComponent, private apiService: APICallService) {
            this.insActivePage=1;
         this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        if (this.objQeryVal.mid == 3 && (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0")) {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 9]);
        }
        else if (this.objQeryVal.mid == 13 && (Common.GetSession("CarerParentId") == null || Common.GetSession("CarerParentId") == "0")) {
            this._router.navigate(['/pages/recruitment/applicantlist', 13, 9]);
        }
        else if (this.objQeryVal.mid == 3) {
            this.FormCnfgId = 48;
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            this.fnBindCourseAttendedStatus();
            this.bindCarerTrainingProfile();
        }
        else if (this.objQeryVal.mid == 13) {
            this.FormCnfgId = 28;
            this.CarerParentId = parseInt(Common.GetSession("CarerParentId"));
            this.fnBindCourseAttendedStatus();
            this.bindCarerTrainingProfile();
        }
        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);

        this._Form = _formBuilder.group({});
    }

    fnBindCourseAttendedStatus()
    {
        this.objConfigTableNamesDTO.AgencyProfileId = this.AgencyProfileId;
        this.objConfigTableNamesDTO.Name = "Course Attended Status"
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => {
            this.lstCourseStatus = data;
        });
    }

    fnGetCourseStatusValue(id)
    {
        let temp=this.lstCourseStatus.filter(x=>x.CofigTableValuesId==id);
        if(temp.length>0)
        {
            return temp[0].Value;
        }
    }

    IsAgencyHasPPDPField=false;
    private bindCarerTrainingProfile() {
        if (this.CarerParentId != null) {
            this.objCarerTrainingProfileComboDTO.CarerParentId = this.CarerParentId;
            this.objCarerTrainingProfileComboDTO.FormCnfgId = 28;
            this.objCarerTrainingProfileComboDTO.SequenceNo=0;
            this.apiService.post(this.controllerName, "GetDynamicControls", this.objCarerTrainingProfileComboDTO).then(data =>
            {
                let tem= data.filter(x=>x.FieldCnfg.FieldName=="PPDPCompleted");
                if(tem.length>0)
                    this.IsAgencyHasPPDPField=true;
                else
                  this.IsAgencyHasPPDPField=false;
            });
            this.objCarerTrainingCourseStatusDTO.CarerParentId = this.CarerParentId;
            this.objCarerTrainingCourseStatusDTO.ControlLoadFormat = ["List"];
            this.apiService.post(this.controllerName, "GetDynamicControlsvalueAndList", this.objCarerTrainingCourseStatusDTO).then(data => { this.ResponseCarerCourseStatusControl = data; });
            this.loading = true;
            this.apiService.post(this.controllerName, "GetListByCarerParentId", this.objCarerTrainingProfileComboDTO).then(data => {
                this.carerTrainingProfileList=data.filter(x => x.PPDPCompleted!=1);
                this.carerTrainingProfileListPPDP = data.filter(x => x.PPDPCompleted==1);
                this.loading=false;
            });
     }
    }

    public onPageChange() {
        let tem = document.querySelector('.pagination .page-item.active a');
        this.insActivePage=parseInt(tem.innerHTML);
    }
    submitcoursestatus(value, form) {
        if (form.valid) {
            this.isLoading = true;
            this.objCarerTrainingCourseStatusDTO.DynamicValue = value;
            this.objCarerTrainingCourseStatusDTO.CarerParentId = this.CarerParentId;
            this.apiService.post("CarerTrainingProfile", "ListSave", this.objCarerTrainingCourseStatusDTO).then(data => this.ResponeCourseStatus(data));
        }
    }

    fnAddData() {
        if (this.objQeryVal.mid == 13)
            this._router.navigate(['/pages/recruitment/carertrainingprofiledata/0/13/1']);
        else
            this._router.navigate(['/pages/fostercarer/carertrainingprofiledata/0/3/1']);
    }

    fnPPDPAddData()
    {
        if (this.objQeryVal.mid == 13)
            this._router.navigate(['/pages/recruitment/carertrainingprofiledata/0/13/1/1']);
        else
            this._router.navigate(['/pages/fostercarer/carertrainingprofiledata/0/3/1/1']);
    }

    editCarerTrainingProfile(CarerTrainingProfilId) {
        if (this.objQeryVal.mid == 13)
            this._router.navigate(['/pages/recruitment/carertrainingprofiledata', CarerTrainingProfilId, this.objQeryVal.mid,this.insActivePage]);
        else
            this._router.navigate(['/pages/fostercarer/carertrainingprofiledata', CarerTrainingProfilId, this.objQeryVal.mid,this.insActivePage]);
    }

    editCarerTrainingProfilePPDP(CarerTrainingProfilId) {
        if (this.objQeryVal.mid == 13)
            this._router.navigate(['/pages/recruitment/carertrainingprofiledata', CarerTrainingProfilId, this.objQeryVal.mid,this.insActivePage,1]);
        else
            this._router.navigate(['/pages/fostercarer/carertrainingprofiledata', CarerTrainingProfilId, this.objQeryVal.mid,this.insActivePage,1]);
    }

    deleteCarerTrainingProfile(SequenceNo) {
        this.objCarerTrainingProfileDTO.SequenceNo = SequenceNo;
        //this.objCarerTrainingProfileDTO.UniqueID = UniqueID;
        //this.tpServics.post(this.objCarerTrainingProfileDTO, "delete").then(data => this.Respone(data));
        this.apiService.delete(this.controllerName, this.objCarerTrainingProfileDTO).then(data => this.Respone(data));
    }

    private ResponeCourseStatus(data) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.module.alertSuccess(Common.GetUpdateSuccessfullMsg);
        }
    }

    private ResponeDyanmic(data) {
        if (data != null) {
            this.objCarerTrainingProfileComboDTO = data;
        }
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.module.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindCarerTrainingProfile();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objCarerTrainingProfileDTO.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
    setPageSize(pageSize:string)
    {
      this.limitPerPage = parseInt(pageSize);
    }
    setPageSizePPDP(pageSize:string)
    {
      this.limitPerPagePPDP = parseInt(pageSize);
    }
}
