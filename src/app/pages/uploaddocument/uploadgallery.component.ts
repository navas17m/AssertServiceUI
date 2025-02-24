import { AfterViewInit, Component, Input,EventEmitter,Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../environments/environment';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { EventsGalleryDTO } from './DTO/uploaddocumentsdto';
import { ConfigTableNamesDTO } from '../superadmin/DTO/configtablename';
@Component({
    selector: 'Upload-Gallery',
    templateUrl: './uploadgallery.component.template.html',
    // styles: [`[required]  {
    //     border-left: 5px solid blue;
    // }
    // .ng-valid[required], .ng-valid.required  {
    //         border-left: 5px solid #42A948; /* green */
    // }
    // .ng-invalid:not(form)  {
    //     border-left: 5px solid #a94442; /* red */
    // }`],
})

export class UploadGalleryComponet implements AfterViewInit {
    @Output() SuccessUpload: EventEmitter<any> = new EventEmitter();
    controllerName = "EventsGallery";
    insChildId;
    objQeryVal;
    moduleId; loading = false;
    lstUploadedFiles = [];
    arrUploadedFiles = [];
    saveText = "Upload"; IsSaveMode = true;
    addParameter;
    btnAccessFormCnfgId;

    NextLinkId;
    objConfigTableNamesDTO: ConfigTableNamesDTO = new ConfigTableNamesDTO();
    objEventsGalleryDTO: EventsGalleryDTO = new EventsGalleryDTO();
    lstCategory=[];
    public uploader: FileUploader;
    public hasBaseDropZoneOver: boolean = false;
    public hasAnotherDropZoneOver: boolean = false;
    public fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }

    public fileOverAnother(e: any): void {
        this.hasAnotherDropZoneOver = e;
    }

    @Input()
    set BtnAccessFormCnfgId(formId: any) {
        this.btnAccessFormCnfgId = formId;
        this.CheckFormAccess(formId);
    }


    @Input()
    set ChildId(Id: any) {
        this.insChildId = Id;
    }

    @Input()
    get IsUpload(): boolean {
        return this.uploader.queue.length > 0 ? true : false;
    }
    //------formbuilder input
    @Input()
    get formbuilder(): any {
        return this._uploadForm;
    }
    @Input() submittedUpload;
    _uploadForm: FormGroup;
    constructor(private _formBuilder: FormBuilder, private apiService: APICallService,
        private modal: PagesComponent,
        private activatedroute: ActivatedRoute) {

        this.objEventsGalleryDTO.CategoryId = null;
        this.objEventsGalleryDTO.EventDate = null;
        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });

        this.fnLoadDropDowns();
        this.uploader = new FileUploader({
            url: environment.api_uploadeventsgalleryurl,
        });

        this.apiService.get(this.controllerName,"GetNextLinkId").then(data=>{
         this.NextLinkId=data;
        });
    }
    ngAfterViewInit() {

    }

    fnClearQueue() {
        this.uploader = new FileUploader({
            url: environment.api_uploadeventsgalleryurl,
        });
    }


    fnLoadDropDowns() {

        this.objConfigTableNamesDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objConfigTableNamesDTO.Name = "Events Gallery Category"
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.lstCategory = data; });

        this._uploadForm = this._formBuilder.group({
            CategoryId: ['0'],
            EventDate: ["", Validators.required],
            Title: ["", Validators.required],
            Details:[]
        });
    }
    fnBindUploadDocs() {
        this.loading = true;

        this.objEventsGalleryDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.apiService.post(this.controllerName, "GetAll", this.objEventsGalleryDTO).then(data => {
            this.loading = false;
            this.lstUploadedFiles = data;
        });
    }

     fnDelete(Id: number) {
        if (confirm("Are you sure you want to delete this?")) {

                this.apiService.delete(this.controllerName, Id).then(data => this.Respone(data));

        }
    }

    fnDownload(Id, FileName) {
        let agencyId = Common.GetSession("AgencyProfileId");
        window.location.href = environment.api_downloadurl + Id + "," + agencyId;
    }

    output;
    public fnSave(uploadForm) {

        this.submittedUpload = true;
        if (uploadForm.valid) {


            if (this.uploader.queue.length > 0) {
                this.objEventsGalleryDTO.EventDate = this.modal.GetDateSaveFormat(this.objEventsGalleryDTO.EventDate);
                if(!this.objEventsGalleryDTO.Details)
                 this.objEventsGalleryDTO.Details="";

                    this.objEventsGalleryDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
                    this.objEventsGalleryDTO.CreatedUserId = parseInt(Common.GetSession("UserProfileId"));
                    this.uploader.options.additionalParameter = {
                        "addPar": this.objEventsGalleryDTO.AgencyProfileId + "^"
                        + this.insChildId + "^"
                        + this.objEventsGalleryDTO.Title + "^" + this.objEventsGalleryDTO.EventDate + "^"
                        + this.objEventsGalleryDTO.CategoryId + "^" + this.objEventsGalleryDTO.Details + "^"
                        + this.NextLinkId + "^"
                        + this.objEventsGalleryDTO.CreatedUserId
                    };
                    this.uploader.uploadAll();
                    this.objEventsGalleryDTO.EventDate = null;
                    this.modal.alertSuccess(Common.GetUploadSuccessfullMsg);
                    this.SuccessUpload.emit(null);
                    this.fnClear();
                    this.objEventsGalleryDTO.EventDate = null;
            }
            else
                this.modal.alertDanger(Common.GetSelectDocumentMsg);


            this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
                this.uploader.removeFromQueue(item);
            };


        }
    }
    fnClear() {

        this.submittedUpload = false;
        this.objEventsGalleryDTO.EventDate = null;
        this.objEventsGalleryDTO.Title = "";
        this.objEventsGalleryDTO.CategoryId = null;
        this.objEventsGalleryDTO.Details="";
        this.IsSaveMode = true;
        this.saveText = "Upload";
    }
    private Respone(data) {
        if (data.IsError == true) {
            alert(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.objEventsGalleryDTO.EventDate = null;
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);
        }
    }


    insFormRoleAccessMapping = [];
    UserProfileId;
    insVisible = false;
    CheckFormAccess(FormId) {
        this.insFormRoleAccessMapping = JSON.parse(Common.GetSession("FormRoleAccessMapping"));
        this.UserProfileId = Common.GetSession("UserProfileId");
        if (this.UserProfileId == 1) {
            this.insVisible = true;
        }
        else if (FormId != null && this.insFormRoleAccessMapping != null) {
            let check = this.insFormRoleAccessMapping.filter(data => data.FormCnfgId == FormId && data.AccessCnfgId == 4);
            if (check.length > 0) {
                this.insVisible = true;
            }
            else {
                this.insVisible = false;
            }
        }
    }
}
