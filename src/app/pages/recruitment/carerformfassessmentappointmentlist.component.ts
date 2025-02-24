import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { CarerFormFAssessmentAppointmentDTO } from './DTO/carerformfassessmentappointmentdto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component
    ({
        selector: 'assessmentappointmentlist',
        templateUrl: './carerformfassessmentappointmentlist.component.template.html',

    })

export class CarerFormFAssessmentAppointmentListComponent {
    public searchText: string = "";
    controllerName = "CarerFormFAssessmentAppointment";
    lstCarerFormFAssessmentAppointment = [];
    objQeryVal;
    objCarerFormFAssessmentAppointmentDTO: CarerFormFAssessmentAppointmentDTO = new CarerFormFAssessmentAppointmentDTO();
    returnVal;
    CarerParentId: number;
    FormCnfgId;
    loading=false;
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'Appointment Date',prop:'AppointmentDate',sortable:true,width:'200',date:'Y'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
        {name:'View',prop:'View',sortable:false,width:'60'},
        {name:'Delete',prop:'Delete',sortable:false,width:'60'},
        ];
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    constructor( private activatedroute: ActivatedRoute,
        private _router: Router, private module: PagesComponent, private apiService: APICallService) {

        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        if (this.objQeryVal.mid == 36 && (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0")) {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 36, 25]);
        }
        else if (this.objQeryVal.mid == 37 && (Common.GetSession("CarerParentId") == null || Common.GetSession("CarerParentId") == "0")) {
            this._router.navigate(['/pages/recruitment/applicantlist', 37, 25]);
        }
        else if (this.objQeryVal.mid == 36) {
            this.FormCnfgId = 68;
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            this.bindCarerFormFAssessmentAppointment();
        }
        else if (this.objQeryVal.mid == 37) {
            this.FormCnfgId = 40;
            this.CarerParentId = parseInt(Common.GetSession("CarerParentId"));
            this.bindCarerFormFAssessmentAppointment();
        }
        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);

    }

    private bindCarerFormFAssessmentAppointment() {
        this.loading=true;
        if (this.CarerParentId != null) {
            this.objCarerFormFAssessmentAppointmentDTO.CarerParentId = this.CarerParentId;
            this.objCarerFormFAssessmentAppointmentDTO.FormCnfgId = 40;
            //   this.cfaaServics.getAssessmentAppointmentList(this.objCarerFormFAssessmentAppointmentDTO).then(data => this.lstCarerFormFAssessmentAppointment = data);
            this.apiService.post(this.controllerName, "GetListByCarerParentId", this.objCarerFormFAssessmentAppointmentDTO).then(data =>
                {this.lstCarerFormFAssessmentAppointment = data;
                this.loading=false;});
        }
    }

    fnAddData() {
        if (this.objQeryVal.mid == 36)
            this._router.navigate(['/pages/fostercarer/assessmentappointmentdata/0/36']);
        else
            this._router.navigate(['/pages/recruitment/assessmentappointmentdata/0/37']);
    }

    editCarerFormFAssessmentAppointment(CarerFormFAssessmentId) {
        this._router.navigate(['/pages/recruitment/assessmentappointmentdata', CarerFormFAssessmentId, this.objQeryVal.mid]);
    }

    deleteCarerFormFAssessmentAppointment(SequenceNo) {

        this.objCarerFormFAssessmentAppointmentDTO.SequenceNo = SequenceNo;
        //this.objCarerFormFAssessmentAppointmentDTO.UniqueID = UniqueID;
       // this.cfaaServics.post(this.objCarerFormFAssessmentAppointmentDTO, "delete").then(data => this.Respone(data));
        this.apiService.delete(this.controllerName, this.objCarerFormFAssessmentAppointmentDTO).then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.module.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindCarerFormFAssessmentAppointment();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objCarerFormFAssessmentAppointmentDTO.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
    onEdit(item){
        this.editCarerFormFAssessmentAppointment(item.SequenceNo);
    }
    onDelete(item){
        this.deleteCarerFormFAssessmentAppointment(item.SequenceNo);
    }
}
