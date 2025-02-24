
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { DynamicValue } from './dynamicvalue';
import { ValChangeDTO } from './ValChangeDTO';

@Component({
    selector: 'Dynamic-Form',
    templateUrl: './dynamicform.component.template.html',
    // styles: [`[required]  {
    //     border-left: 5px solid blue;
    // }

    // .ng-valid[required], .ng-valid.required  {
    //         border-left: 5px solid #42A948; /* green */
    // }
    // .ng-invalid:not(form)  {
    //     border-left: 5px solid #a94442; /* red */
    // }`]
})

export class DynamicFormComponet {
    @ViewChild('txtDate') txtDateCtrl;
    @Output() OnValChange: EventEmitter<any> = new EventEmitter();
    gridRowCount = 0;
    submit;
    dynamicformcontrol: any;
    dynamicformcontrolDisplay=[];
    isValidinput = true;
    $calendar: any;
    public config: any;
    //------dynamicformcontrols input
    @Input()
    set dynamicformcontrols(dc: any) {
        this.dynamicformcontrol = dc;
      //  this.dynamicformcontrolDisplay = dc;
        //this.dynamicformcontrolDisplay = this.dynamicformcontrolDisplay.filter(item => item.FieldCnfg.FieldName != 'IsActive' && item.FieldCnfg.FieldName != 'CreatedDate'
        //    && item.FieldCnfg.FieldName != 'CreatedUserId'
        //    && item.FieldCnfg.FieldName != 'UpdatedDate'
        //    && item.FieldCnfg.FieldName != 'UpdatedUserId'
        //    && item.FieldCnfg.FieldName != 'SiblingParentSno'
        //    && item.FieldCnfg.FieldName != 'CarerChildSNo'
        //    && item.FieldCnfg.FieldName != 'SaveAsDraftStatus'
        //    && item.FieldCnfg.FieldName != 'SocialWorkerId'
        //    && item.FieldCnfg.FieldName != 'CarerParentId'
        //    && item.FieldCnfg.FieldName != 'IsLocked');
        this.getFormGroup(this.dynamicformcontrol);
        this.ChangeEventEmitterValue(this.dynamicformcontrol);
        // this.setDate(this.dynamicformcontrol);

    }
    rtnval;
    get dynamicformcontrols(): any {

        if (this.dynamicformcontrol != null) {
            this.rtnval = this.getReturnValue(this.dynamicformcontrol);
            return this.rtnval;
        }
    }

    //------formbuilder input
    @Input()
    set formbuilder(formbuilder: any) {
        this.formbuilders = formbuilder;
    }
    get formbuilder(): any {
        return this.formbuilders;
    }

    //submitted
    @Input() submitted;

    //------GridValues
    gridValues;
    @Input()
    set GridValues(value: any) {
        this.gridValues = value;
    }
    get GridValues(): any {
        return true;
    }

    //------------
    insControlLoadFormat;
    @Input()
    set ControlLoadFormat(value: any) {
        this.insControlLoadFormat = value;
    }
    get ControlLoadFormat(): any {
        return true;
    }


    ////--------------------------------
    formbuilders: FormGroup;
    currentDate; ckeditorContent;
    constructor(private _formBuilder: FormBuilder, private pComponent: PagesComponent) {
        this.ckeditorContent = `<p>My HTML</p>`;
        this.config = {
            uiColor: '#F0F3F4',
            height: '350',
            extraPlugins: 'divarea'
        };

        this.currentDate = new Date().toISOString().split("T")[0];
        this.$calendar = jQuery('#txtDate');
        //  console.log(this.$calendar);
        // this.txtDateCtrl.fnShowImage(item.PersonalInfo.ImageId);
    }

    targetControlonput;
    @Input()
    set targetControl(value: string) {

        this.targetControlonput = value;
    }

    fnDateChange(value) {
        //    console.log(value);
        //  item.FieldValue = value;

    }

    //GetSignatureSrcPath() {

    //    return "data:image/jpeg;base64," + this.apiService.get("UploadDocuments", "GetImageById", 1).then(this.handleResponse);

    //    // return "data:image/jpeg;base64," + ;
    //}


    setDate(dynamiccontrol) {
        //Set Date time when Edit the record only
        //Convert yyyy-MM-dd hh:mm to dd/MM/yyyy hh:mm
        if (dynamiccontrol != null && dynamiccontrol.length > 0) {
            let data = dynamiccontrol.filter(x => (x.FieldCnfg.FieldDataTypeCnfg.Name == 'datetime' || x.FieldCnfg.FieldDataTypeCnfg.Name == 'date') && x.FieldCnfg.FieldName != 'CreatedDate' && x.FieldCnfg.FieldName != 'UpdatedDate');
            if (data.length > 0 && data[0].UniqueID != 0) {
                data.forEach(item => {
                    if (item.FieldValue != null && item.FieldValue != '' && item.FieldCnfg.FieldDataTypeCnfg.Name == 'datetime') {
                        //console.log(item.FieldValue);
                        //let dt = new Date(item.FieldValue);
                        item.FieldValue = moment(item.FieldValue).format("DD/MM/YYYY HH:mm");
                    }
                    //else if (item.FieldValue != null && item.FieldValue != '' && item.FieldCnfg.FieldDataTypeCnfg.Name == 'date') {
                    //    item.FieldValue = moment(item.FieldValue).format("DD/MM/YYYY");
                    //}
                });
            }
        }
    }

    changeEve(agecyFilefMapping, currentVal) {
        if (agecyFilefMapping.ConfigTableValues != null && currentVal != '') {
            agecyFilefMapping.GridDisplayField = agecyFilefMapping.ConfigTableValues.find((item: any) => item.CofigTableValuesId == currentVal).Value;
        }

        let objValChangeDTO: ValChangeDTO = new ValChangeDTO();
        objValChangeDTO.currnet = agecyFilefMapping;
        objValChangeDTO.all = this.dynamicformcontrol;
        //objValChangeDTO.oldValue = '';
        if (currentVal != '')
            objValChangeDTO.newValue = currentVal;
        this.OnValChange.emit(objValChangeDTO);
    }

    expandMessage(item) {
        item.ImageVisible = !item.ImageVisible;

    }

    fnTextChange(eve, item) {
        item.FieldValue = eve;
    }

    ChangeEventEmitterValue(dynamiccontrol) {
        if (dynamiccontrol != null) {
            dynamiccontrol.forEach(item => {
                let objValChangeDTO: ValChangeDTO = new ValChangeDTO();
                objValChangeDTO.currnet = item;
                objValChangeDTO.all = this.dynamicformcontrol;
                objValChangeDTO.newValue = item.FieldValue;
                this.OnValChange.emit(objValChangeDTO);
            });
        }
    }


    getReturnValue(value: any) {
        this.isValidinput = true;
        let objUnique: DynamicValue[] = [];
        let loginId = Common.GetSession("UserProfileId");
        value.forEach(item => {
            let addValue: DynamicValue = new DynamicValue();
            addValue.UniqueId = item.UniqueID;
            addValue.FieldCnfgId = item.FieldCnfg.FieldCnfgId;
            addValue.FieldValue = item.FieldValue;
            addValue.FieldName = item.FieldCnfg.FieldName;
            addValue.FieldValueText = item.GridDisplayField;
            addValue.FieldDataTypeName = item.FieldCnfg.FieldDataTypeCnfg.Name;
            addValue.DisplayName = item.DisplayName;
            //only for bit
            if (item.FieldCnfg.FieldDataTypeCnfg.Name == 'bit' || item.FieldCnfg.FieldDataTypeCnfg.Name == 'radio' && item.FieldValue != null) {
                addValue.FieldValue = (addValue.FieldValue) ? "1" : "0";
            }

            if (item.FieldCnfg.FieldName == 'IsActive') {
                addValue.FieldValue = "1";
            }

            //if (item.FieldCnfg.FieldDataTypeCnfg.Name == 'Dropdownlist' && item.FieldValue == '0') {
            //    item.FieldValue = null;
            //}

            if (item.FieldCnfg.FieldDataTypeCnfg.Name == 'date' && item.FieldValue != null && item.FieldValue != '' && item.FieldCnfg.FieldName != 'CreatedDate' && item.FieldCnfg.FieldName != 'UpdatedDate') {
                //let dt = item.FieldValue.split(/\/|\s/);
                //let date: Date = new Date(dt.slice(0, 3).reverse().join('/'));
                //let d = date.getDate();
                //let m = date.getMonth() + 1;
                //let y = date.getFullYear();
                //let day = "" + d;
                //if (d < 10)
                //    day = "0" + d;

                //let month = "" + m;
                //if (m < 10)
                //    month = "0" + m;

                //let dateNew = y + "-" + month + "-" + day;
                //addValue.FieldValue = dateNew;
                addValue.FieldValue = this.pComponent.GetDateSaveFormat(item.FieldValue);
            }

            if (item.FieldCnfg.FieldDataTypeCnfg.Name == 'datetime' && item.FieldValue != null && item.FieldValue != '' && item.FieldCnfg.FieldName != 'CreatedDate' && item.FieldCnfg.FieldName != 'UpdatedDate') {
                addValue.FieldValue = this.pComponent.GetDateTimeSaveFormat(item.FieldValue);

                //let dt = item.FieldValue.split(/\/|\s/)
                //let date: Date = new Date(dt.slice(0, 3).reverse().join('/') + ' ' + dt[3])
                ////addValue.FieldValue = moment(insDate).format('YYYY-MM-DD HH:mm:ss.sss');
                //let d = date.getDate();
                //let m = date.getMonth() + 1;
                //let y = date.getFullYear();
                //let h = date.getHours();
                //let min = date.getMinutes();
                //let day = "" + d;
                //if (d < 10)
                //    day = "0" + d;

                //let month = "" + m;
                //if (m < 10)
                //    month = "0" + m;

                //let minute = "" + min;
                //if (min < 10) {
                //    minute = "0" + min;
                //}
                //let dateNew = y + "-" + month + "-" + day + " " + h + ":" + minute;
                //addValue.FieldValue = dateNew;
            }

            if (item.FieldCnfg.FieldName == 'CreatedDate' && (item.UniqueID == null || item.UniqueID == '')) {
                let date = new Date();
                let d = date.getDate();
                let m = date.getMonth() + 1;
                let y = date.getFullYear();
                let h = date.getHours();
                let min = date.getMinutes();
                let day = "" + d;
                if (d < 10)
                    day = "0" + d;
                let month = "" + m;
                if (m < 10)
                    month = "0" + m;
                let minute = "" + min;
                if (min < 10)
                    minute = "0" + min;
                let dateNew = y + "-" + month + "-" + day + " " + h + ":" + minute;
                addValue.FieldValue = dateNew;

            }
            else if (item.FieldCnfg.FieldName == 'CreatedUserId' && (item.UniqueID == null || item.UniqueID == '')) {
                addValue.FieldValue = loginId;
            }
            else if (item.FieldCnfg.FieldName == 'UpdatedDate') {
                let date = new Date();
                let d = date.getDate();
                let m = date.getMonth() + 1;
                let y = date.getFullYear();
                let h = date.getHours();
                let min = date.getMinutes();
                let day = "" + d;
                if (d < 10)
                    day = "0" + d;
                let month = "" + m;
                if (m < 10)
                    month = "0" + m;
                let minute = "" + min;
                if (min < 10)
                    minute = "0" + min;
                let dateNew = y + "-" + month + "-" + day + " " + h + ":" + minute;
                addValue.FieldValue = dateNew;
            }
            else if (item.FieldCnfg.FieldName == 'UpdatedUserId') {
                addValue.FieldValue = loginId;
            }
            objUnique.push(addValue);
        });

        return objUnique;
    }

    listValue = "";
    getListBoxSelectVal(item, val) {
        //  console.log(val);
        this.listValue = "";
        val.forEach(data => {
            this.listValue += data + ",";
        });
        item.FieldValue = this.listValue.substring(0, this.listValue.length - 1);
        // item.FieldValue = val;
        // console.log(item);
    }

    signChange(item, val) {

        let value = val.split('base64,')[1];
        // console.log(value);
        item.FieldValue = value;
    }

    getMultiselectDDLSelectVal(item, val) {
        item.FieldValue = val;
    }

    getCheckboxlistSelectVal(item, val) {
        this.listValue = "";
        val.forEach(data => {
            this.listValue += data + ",";
        });
        item.FieldValue = this.listValue.substring(0, this.listValue.length - 1);
    }

    getradiolistSelectVal(item, val) {
        //  console.log(item)
          // this.listValue = "";
          // val.forEach(data => {
          //     this.listValue += data + ",";
          // });
          item.FieldValue = val.FieldValue;
      }

    getFormGroup(dynamiccontrol) {
        let group: any = {};
        if (dynamiccontrol != null) {
            dynamiccontrol.forEach(item => {
                if (item.FieldCnfg.FieldDataTypeCnfg.Name == 'bit' || item.FieldCnfg.FieldDataTypeCnfg.Name == 'radio' && item.FieldValue) {
                    item.FieldValue = (item.FieldValue == "1");
                }

                if (item.FieldCnfg.FieldName != 'IsActive' && item.FieldCnfg.FieldName != 'CreatedDate' && item.FieldCnfg.FieldName != 'CreatedUserId'
                    && item.FieldCnfg.FieldName != 'UpdatedDate' && item.FieldCnfg.FieldName != 'UpdatedUserId' && item.FieldCnfg.FieldDataTypeCnfg.Name != 'label') {

                    if (item.FieldCnfg.FieldDataTypeCnfg.Name == 'Dropdown' || item.FieldCnfg.FieldDataTypeCnfg.Name == 'Dropdownlist' || item.FieldCnfg.FieldDataTypeCnfg.Name == 'ColorDropdown') {
                        group[item.FieldCnfg.FieldCnfgId] = item.IsMandatory ? new FormControl('0', Validators.required) :
                            new FormControl('0');
                    }
                    else if (item.FieldCnfg.FieldDataTypeCnfg.Name != 'Checkboxlist' && item.FieldCnfg.FieldDataTypeCnfg.Name != 'ListBox') {
                        group[item.FieldCnfg.FieldCnfgId] = item.IsMandatory ? new FormControl('', Validators.required) :
                            new FormControl('');
                    }
                }
            });
        }
        this.formbuilders = new FormGroup(group);
    }


    existsRadiolist(CofigTableValuesId: number, FieldValue: number) {
        if (CofigTableValuesId == FieldValue)
            return true;
        else
            return false;
    }
}
