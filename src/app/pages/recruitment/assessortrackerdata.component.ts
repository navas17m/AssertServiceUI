import { APICallService } from '../services/apicallservice.service';
import { Component, Pipe, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Common}  from  '../common'
import { PagesComponent } from '../pages.component'
import { CarerAssessorTrackDTO } from './DTO/assessortrackerdto'
import { ContactValidator } from '../validator/contact.validator';
@Component({
    selector: 'CarerAssessorTrackData',
    templateUrl: './assessortrackerdata.component.template.html',
})

export class AssessorTrackDataComponent {
    controllerName = "CarerAssessorTrack";
    objCarerAssessorTrackDTO: CarerAssessorTrackDTO = new CarerAssessorTrackDTO();
    submitted = false;
    _Form: FormGroup;
    objQeryVal;
    CarerParentId: number;
    isLoading: boolean = false;
    insd3InfoActive = "active";
    insDocumentActive = "";
    //Doc
    FormCnfgId;
    formId;
    tblPrimaryKey;
    TypeId;
    submittedUpload = false;
    @ViewChild('uploads') uploadCtrl;
    constructor(private _formBuilder: FormBuilder,
        private route: ActivatedRoute, private _router: Router,
        private module: PagesComponent, private apiService: APICallService) {
        this.route.params.subscribe(data => this.objQeryVal = data);

        if (this.objQeryVal.mid == 3) {
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
        }
        else if (this.objQeryVal.mid == 13) { 
            this.CarerParentId = parseInt(Common.GetSession("CarerParentId"));
        }
        this.FormCnfgId = 303;

        if (this.objQeryVal.id != 0) {
            this.apiService.get(this.controllerName, "GetById", this.objQeryVal.id).then(data => {
                this.objCarerAssessorTrackDTO = data;
                this.setDate(data);
            });
        }
        this._Form = _formBuilder.group({
            AssessorName: [Validators.required],
            AssessmentAllocatedDate: [Validators.required],
            Fee:[],
            AssessorDateSent:[],
            AssessorDateReceived:[],
            TransferDateSent:[],
            FormFDateSent:[],
            CompletionDate:[],
            PanelDate:[],
            EmailId:[''],
            Telephone:['',[Validators.minLength(10), Validators.maxLength(20)]],
        });
        //Doc
        this.formId = 303;
        this.TypeId = this.CarerParentId;
        this.tblPrimaryKey = this.objQeryVal.id;
    }

    fnD3InfoActive() {
        this.insd3InfoActive = "active";
        this.insDocumentActive = "";

    }
    fnDocumentActive() {
        this.insd3InfoActive = "";
        this.insDocumentActive = "active";

    }

    setDate(data) {
        this.objCarerAssessorTrackDTO.AssessmentAllocatedDate = this.module.GetDateEditFormat(data.AssessmentAllocatedDate);
        this.objCarerAssessorTrackDTO.AssessorDateSent = this.module.GetDateEditFormat(data.AssessorDateSent);
        this.objCarerAssessorTrackDTO.AssessorDateReceived = this.module.GetDateEditFormat(data.AssessorDateReceived);
        this.objCarerAssessorTrackDTO.TransferDateSent = this.module.GetDateEditFormat(data.TransferDateSent);
        this.objCarerAssessorTrackDTO.FormFDateSent = this.module.GetDateEditFormat(data.FormFDateSent);
        this.objCarerAssessorTrackDTO.CompletionDate = this.module.GetDateEditFormat(data.CompletionDate);
        this.objCarerAssessorTrackDTO.PanelDate = this.module.GetDateEditFormat(data.PanelDate);
    }
    DocOk = true;
    clicksubmit(_Form, UploadDocIds,IsUpload, uploadFormBuilder) {
        this.submitted = true;

        if (!this._Form.valid) {
            this.module.GetErrorFocus(this._Form);
            this.insd3InfoActive = "active";
            this.insDocumentActive = "";
        }
        this.DocOk = true;
        if (IsUpload) {
            this.submittedUpload = true;
            if (uploadFormBuilder.valid) {
                this.DocOk = true;
            }
            else
            {
                this.DocOk = false;
                this.insd3InfoActive = "";
                this.insDocumentActive = "active";
        
            }
        }

        if (this._Form.valid && this.DocOk) {
            this.objCarerAssessorTrackDTO.AssessmentAllocatedDate = this.module.GetDateSaveFormat(this.objCarerAssessorTrackDTO.AssessmentAllocatedDate);
            this.objCarerAssessorTrackDTO.AssessorDateSent = this.module.GetDateSaveFormat(this.objCarerAssessorTrackDTO.AssessorDateSent);
            this.objCarerAssessorTrackDTO.AssessorDateReceived = this.module.GetDateSaveFormat(this.objCarerAssessorTrackDTO.AssessorDateReceived);
            this.objCarerAssessorTrackDTO.TransferDateSent = this.module.GetDateSaveFormat(this.objCarerAssessorTrackDTO.TransferDateSent);
            this.objCarerAssessorTrackDTO.FormFDateSent = this.module.GetDateSaveFormat(this.objCarerAssessorTrackDTO.FormFDateSent);
            this.objCarerAssessorTrackDTO.CompletionDate = this.module.GetDateSaveFormat(this.objCarerAssessorTrackDTO.CompletionDate);
            this.objCarerAssessorTrackDTO.PanelDate = this.module.GetDateSaveFormat(this.objCarerAssessorTrackDTO.PanelDate);

            this.objCarerAssessorTrackDTO.CarerParentId = this.CarerParentId;
            this.isLoading = true;
            let type = "save";
            if (this.objQeryVal.id > 0)
                type = "update";
            this.apiService.save(this.controllerName, this.objCarerAssessorTrackDTO, type).then(data => this.Respone(data, type, IsUpload));
        }
    }

    private Respone(data, type, IsUpload) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (type == "save") {
                this.module.alertSuccess(Common.GetSaveSuccessfullMsg);
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(data.SequenceNumber);
                }
            }
            else {
                this.module.alertSuccess(Common.GetUpdateSuccessfullMsg);
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.tblPrimaryKey);
                }
            }
            this._router.navigate(['/pages/recruitment/assessortrackerlist/13']);
        }
    }
}