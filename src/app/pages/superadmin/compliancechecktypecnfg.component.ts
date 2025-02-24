
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Pipe, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent as observableFromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, mergeMap } from 'rxjs/operators';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { Base } from '../services/base.service';
import { ComplianceCheckTypeCnfgDTO } from './DTO/compliancechecktypecnfg';
declare var $: any;
//.@Pipe({ name: 'filter' })
@Component({
    selector: 'ComplianceCheckTypeCnfg',
    templateUrl: './compliancechecktypecnfg.component.template.html',
})

export class ComplianceCheckTypeCnfgComponent implements AfterViewInit {
    submitted = false;
    objCCTC: ComplianceCheckTypeCnfgDTO = new ComplianceCheckTypeCnfgDTO();
    compliancechecktypeList;
    agencyProfileId;
    _Form: FormGroup;
    objQeryVal;
    membertype;
    agencyList;
    selected = [];
    selectedList = [];
    checkAll;
    IsAvailCheckName = false;
    checknameavailrtnValue;
    IsErrorVisible = false;
    isLoading: boolean = false;
    controllerName = "ComplianceCheckTypeCnfg";

    lstSourceTargetFields = [];
    lstSourceTargetField: SourceTargetField[] = [];
    constructor(_formBuilder: FormBuilder, private apiService: APICallService,
        private activatedroute: ActivatedRoute, private _router: Router, private _http: HttpClient,
        private pComponent: PagesComponent) {
        this.agencyProfileId = Common.GetSession("AgencyProfileId");

        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });

        this.apiService.get(this.controllerName, "GetById", this.objQeryVal.id).then(data => {
            this.ResponeCheckList(data);
        });
        //cctcServices.GetById(this.objQeryVal.id).then(data => {
        //    this.ResponeCheckList(data);
        //});

        this._Form = _formBuilder.group({
            AgencyProfileId: ['0', Validators.required],
            MemberTypeId: ['0', Validators.required],
            CheckName: ['', Validators.required],
            chcekAll: [''],
            IsAnnualReview: [''],
            SourceFieldName: ['0'],
            TargetFieldName: ['0'],
            RenewalDaysDifferent: [],
        });
    }

    exists(id, item) {
        if (this.selectedList.indexOf(id) > -1) {
            item.IsActive = true;
        }


        return this.selectedList.indexOf(id) > -1;
    }

    private ResponeCheckList(data) {
        if (data != null) {
            this.compliancechecktypeList = data.ConfigTableValues;
            this.membertype = data.ComplianceMemberTypeCnfg;
            this.agencyList = data.AgencyProfile;

            if (data.ComplianceCheckTypeCnfg != null) {
                this.objCCTC = data.ComplianceCheckTypeCnfg;
                this.selectedList = data.ComplianceCheckTypeCnfg.FieldIdCSV;
                this.selected = data.ComplianceCheckTypeCnfg.FieldIdCSV.split(',');

                this.compliancechecktypeList.forEach(item => {

                    if (this.selectedList.indexOf(item.CofigTableValuesId) > -1) {

                        if (item.FieldType == "date" || item.FieldType == "datetime") {
                            this.lstSourceTargetFields.push(item.FieldName);
                            let add: SourceTargetField = new SourceTargetField();
                            add.FieldName = item.FieldName;
                            add.DisplayName = item.Value;
                            this.lstSourceTargetField.push(add);
                        }
                    }

                });

            }
        }
    }

    changeOrderBy(value, item) {
        item.ComplianceCheckFieldOrderMapping.OrderBy = value;
    }

    changeGridOrderBy(value, item) {
        item.ComplianceCheckFieldOrderMapping.GridOrderBy = value;
    }

    updateChecked(event, item) {
        if (event.srcElement.checked)
            item.IsActive = true;
        else
            item.IsActive = false;

        var index = this.selected.indexOf(event.target.value);
        if (index === -1) {
            this.selected.push(event.target.value);
        } else {
            this.selected.splice(index, 1);
        }

        if (event.srcElement.checked) {
            var index = this.lstSourceTargetFields.indexOf(item.FieldName);
            if (index === -1) {
                if (item.FieldType == "date" || item.FieldType == "datetime") {
                    this.lstSourceTargetFields.push(item.FieldName);
                    let add: SourceTargetField = new SourceTargetField();
                    add.FieldName = item.FieldName;
                    add.DisplayName = item.Value;
                    this.lstSourceTargetField.push(add);
                }
            }
        }
        else {
            var index = this.lstSourceTargetFields.indexOf(item.FieldName);
            this.lstSourceTargetFields.splice(index, 1);
            var index1 = this.lstSourceTargetField.filter(x => x.FieldName == item.FieldName).indexOf(item.FieldName);
            this.lstSourceTargetField.splice(index1, 1);
        }
    }

    compliancechecktypecnfgSubmit(form): void {
        let fieldID = "";
        this.submitted = true;

        if (this.selected.length > 0)
            this.IsErrorVisible = false;
        else
            this.IsErrorVisible = true;

        if (!form.valid) {
            this.pComponent.GetErrorFocus(form);
        }

        if (form.valid && !this.IsErrorVisible && !this.IsAvailCheckName) {
            this.isLoading = true;

            this.selected.forEach(item => {
                fieldID += item + ",";
            });
            fieldID = fieldID.substring(0, fieldID.length - 1);
            this.objCCTC.FieldIdCSV = fieldID;
            this.objCCTC.ConfigTableValues = this.compliancechecktypeList;

            let type = "update";
            if (this.objCCTC.CheckTypeId == 0 || this.objCCTC.CheckTypeId == null) {
                type = "save";
            }

            this.apiService.save(this.controllerName, this.objCCTC, type).then(data => this.Respone(data, type));
            //this.cctcServices.post(this.objCCTC, type).then(data => this.Respone(data, type));
        }
    }

    private Respone(data, type) {
        this.isLoading = false;

        if (data.IsError == true) {
            this.pComponent.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {

            if (type == "save") {
                this.pComponent.alertSuccess(Common.GetSaveSuccessfullMsg);
            }
            else {
                this.pComponent.alertSuccess(Common.GetUpdateSuccessfullMsg);
            }

            this._router.navigate(['/pages/superadmin/compliancechecktypelist/1']);
        }
    }


    @ViewChild('CheckName') cName: ElementRef;

    ngAfterViewInit() {

        var $input = $('#CheckName');

        this.checknameavailrtnValue = observableFromEvent<KeyboardEvent>($input, 'keyup').pipe(
            map(e => { return e.currentTarget["value"]; }),
            filter(text => text.length >= 3),
            debounceTime(500),
            distinctUntilChanged(),
            mergeMap(text => {
                this.objCCTC.CheckName = text;
                // this.objCCTC.MemberTypeId=
                return this._http.post(Base.GetUrl() + '/api/ComplianceCheckTypeCnfg/CheckNameAvailable', JSON.stringify(this.objCCTC), Base.GetHeader()).pipe(
                    //map(resp => resp.json()));
                    map(resp => resp));
            }
            ),);
        this.checknameavailrtnValue.subscribe(data => { this.IsAvailCheckName = data; });
    }
}

export class SourceTargetField {
    FieldName: string;
    DisplayName: string;
}