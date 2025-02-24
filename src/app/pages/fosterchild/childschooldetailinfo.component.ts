import { Component, Pipe,EventEmitter,Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Common}  from  '../common'
import { Location} from '@angular/common';
import { ChildSchoolDetailInfo} from './DTO/childschooldetailinfo'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { ConfigTableValuesDTO } from '../superadmin/DTO/configtablevalues'
//.@Pipe({ name: 'groupBy' })
@Component({
        selector: 'childschooldetailinfo',
        templateUrl: './childschooldetailinfo.component.template.html',
})

export class ChildSchoolDetailInfoComponent{
    @Output() SuccessSave: EventEmitter<any> = new EventEmitter();
    objChildSchoolDetailInfo: ChildSchoolDetailInfo = new ChildSchoolDetailInfo();
    submitted = false;
    dynamicformcontrol = [];
    _Form: FormGroup;
    isVisibleMandatortMsg;
    SequenceNo;
    objQeryVal;
    ChildID: number;
    AgencyProfileId: number;
    isLoading: boolean = false;
    controllerName = "ChildSchoolInfo"; 
    constructor(private apiService: APICallService,private location: Location, private _formBuilder: FormBuilder,
        private route: ActivatedRoute, private _router: Router, private modal: PagesComponent) {

        this.route.params.subscribe(data => this.objQeryVal = data);
        if (Common.GetSession("ChildId") != null)
            this.ChildID = parseInt(Common.GetSession("ChildId"));
        
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objChildSchoolDetailInfo.AgencyProfileId = this.AgencyProfileId;
        this.objChildSchoolDetailInfo.ChildId = this.ChildID;
        this.SequenceNo = this.objQeryVal.Id;
        if (this.SequenceNo != 0 && this.SequenceNo != null) {
            this.objChildSchoolDetailInfo.SequenceNo = this.SequenceNo;
        } else
        {
            this.objChildSchoolDetailInfo.SequenceNo = 0;
        }

        apiService.post(this.controllerName,"GetDynamicControls",this.objChildSchoolDetailInfo).then(data => {
             this.dynamicformcontrol = data; 
             
            });
        this._Form = _formBuilder.group({});
    }

    clicksubmit(mainFormBuilder, dynamicForm, subformbuilder) {
        this.submitted = true;

        if (!mainFormBuilder.valid) {
            this.modal.GetErrorFocus(mainFormBuilder);
        }
        else if (!subformbuilder.valid) {
            this.modal.GetErrorFocus(subformbuilder);
        }

        if (mainFormBuilder.valid && subformbuilder.valid && dynamicForm != '') {
            this.isLoading = true;
            let type = "save";
            
            // if (this.SequenceNo > 0)
            //     type = "update";            
            this.objChildSchoolDetailInfo.DynamicValue = dynamicForm;
            this.objChildSchoolDetailInfo.ChildId = this.ChildID;
            this.objChildSchoolDetailInfo.AgencyProfileId = this.AgencyProfileId;
            this.apiService.save(this.controllerName,this.objChildSchoolDetailInfo, type).then(data => this.Respone(data, type));
        }
    }

    private Respone(data, type) {   
        this.isLoading = false;   
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (type == "save") {
                this.modal.alertSuccess(Common.GetSaveSuccessfullMsg);
            }
            else {
                this.modal.alertSuccess(Common.GetUpdateSuccessfullMsg);
            }

            let addNew=new ConfigTableValuesDTO();
            addNew.CofigTableValuesId=data.SequenceNumber;
            addNew.Value=data.Format;
            this.SuccessSave.emit(addNew);
            //this._router.navigate(['/pages/child/childschooldetailinfolist/18']);
        }
    }
}