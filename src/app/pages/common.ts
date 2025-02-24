import { Base } from './services/base.service';
/// <reference path="dynamic/dynamicvalue.ts" />
/// <reference path="pages.component.ts" />
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { DynamicValue } from './dynamic/dynamicvalue';
//import { AgencyFieldMappingService} from './services/agencyfieldmapping.service'
declare var window: any;
import { HttpClient } from '@angular/common/http';
@Injectable()

export class Common {
    private static HostName = window.location.hostname;
    public static IsUserLogin = new Subject();
    public Islogedin: string;
    public static GetSession(sessionKey: string) {
        return sessionStorage.getItem(this.HostName + sessionKey);;
    }
    public static SetSession(sessionKey: string, sessionVal: string) {
        sessionStorage.setItem(this.HostName + sessionKey, sessionVal);
    }
    public static ClearSession() {
        sessionStorage.clear();
    }
    public static UploadUrl = "http://fostering.starlight.inc/starlighttestapi/api/UploadDocuments/Upload";
    public static AgencyProfileId: string = Common.GetSession("AgencyProfileId");
    public static LoginUserId: string = Common.GetSession("UserProfileId");
    public static GetSaveSuccessfullMsg = "Record Saved Successfully";
    public static GetRecordAlreadySavedfullMsg = "Record Automatically / Already Saved Successfully";
    public static GetSaveDraftSuccessfullMsg = "Draft Saved Successfully";
    public static GetChildPlacedMsg = "Child Placed Successfully";
    public static GetChildTransferdMsg = "Child Transfered Successfully";
    public static GetChildDischargedMsg = "Child Discharged Successfully";

    public static GetUpdateSuccessfullMsg = "Record Updated Successfully";
    public static GetUpdateDraftSuccessfullMsg = "Draft Updated Successfully";
    public static GetDeleteSuccessfullMsg = "Record Deleted Successfully";
    public static GetEmailSendSuccessfullMsg = "Email(s) Sent Successfully";
    public static GetDeleteConfirmMsg = 'Are you sure you want to delete this?';

    public static GetNoChangeAlert = 'There is no change in this page';
    public static GetMandatoryAlert = 'Please enter mandatory values';

    public static GetFinancePaidMsg = 'Are you sure you want to pay?';
    public static GetAdvanceInvoiceSuccessMsg = 'Advance Invoice genereted successfully..';
    public static GetSelectDocumentMsg = 'Please select a document to upload';
    public static GetUploadSuccessfullMsg = 'File(s) Uploaded Successfully';
    public static GetSaveasDraftText = 'Save as Draft';
    public static GetSaveasDraftProgressText = 'Auto save as draft in progress..';
    public static GetSubmitText = 'Submit';
    public static GetAutoSaveProgressText = 'Auto save in progress..';


    public static addUserAuditHistoryDetails(obj:UserAuditHistoryDetailDTO){

      const userOperations = sessionStorage.getItem("UserOperations");
      let operations=[];
      if(userOperations){
        operations = JSON.parse(userOperations);
        operations.push(obj);
        sessionStorage.setItem('UserOperations', JSON.stringify(operations));
      }
      else {
        operations.push(obj);
        sessionStorage.setItem('UserOperations',JSON.stringify(operations))
      }
    }

    public static GetDateTimeSaveFormat(val) {
        var re = /-/;
        if (val != '' && val != null && val.search(re) == -1) {
            // console.log("Does not contain - ");
            let dtParsed, dtFormatted, out = '';
            //let fmt = new DateFormatter();
            //dtParsed = fmt.parseDate(val, 'd/M/Y H:i');
            //dtFormatted = fmt.formatDate(dtParsed, 'Y-m-d H:i');
			 dtParsed = moment(val, 'DD/MM/YYYY HH:mm')
			dtFormatted = dtParsed.format('YYYY-MM-DD HH:mm');
            return dtFormatted;

        }
        else if (val != '' && val != null) {
            // console.log("Contains - ");
            return val;
        }
    }
    public static GetDateSaveFormat(val) {
        var re = /-/;
        if (val != '' && val != null && val.search(re) == -1) {
            // console.log("Does not contain - ");
            let dtParsed, dtFormatted, out = '';
            //let fmt = new DateFormatter();
            //dtParsed = fmt.parseDate(val, 'd/M/Y');
            //dtFormatted = fmt.formatDate(dtParsed, 'Y-m-d');
			dtParsed = moment(val, 'DD/MM/YYYY')
            dtFormatted = dtParsed.format('YYYY-MM-DD');
            return dtFormatted;
        }
        else if (val != '' && val != null) {
            // console.log("Contains - ");
            return val;
        }
    }

    public static GetNewDateasFormatted() {

        let date = new Date();
        let d = date.getDate();
        let m = date.getMonth() + 1;
        let y = date.getFullYear();
        let h = date.getHours();
        let min = date.getMinutes();
        let sec = date.getSeconds();
        let day = "" + d;
        if (d < 10)
            day = "0" + d;
        let month = "" + m;
        if (m < 10)
            month = "0" + m;
        let minute = "" + min;
        if (min < 10)
            minute = "0" + min;
        let dateNew = y + "-" + month + "-" + day + " " + h + ":" + minute + ":" + sec;
        return dateNew;
    }

	public static GetYear() {
       let objUnique: StaticValueDTO[] = [];
		var i;
		let year: number;
		var date = new Date();
		year = date.getFullYear();
        let addValue: StaticValueDTO = new StaticValueDTO();
        addValue.key = "0";
        addValue.value = "Select";
        objUnique.push(addValue);
		for (i = year; i > 2000; i--) {
		  let addValue: StaticValueDTO = new StaticValueDTO();
            addValue.key = i;
            addValue.value = i;
            objUnique.push(addValue);
		}
		return objUnique;
    }
	public static GetMonth() {
         let objUnique: StaticValueDTO[] = [];
		 let month: StaticValueDTO = new StaticValueDTO();
         month.key = "0";
         month.value = "Select";
     objUnique.push(month);
     month= new StaticValueDTO();
		  month.key = "1";
            month.value = "January";
		objUnique.push(month);
		month= new StaticValueDTO();
		  month.key = "2";
            month.value = "February";
		objUnique.push(month);
		month= new StaticValueDTO();
		  month.key = "3";
            month.value = "March";
		objUnique.push(month);
		month= new StaticValueDTO();
		  month.key = "4";
            month.value = "April";
		objUnique.push(month);
		month= new StaticValueDTO();
		  month.key = "5";
            month.value = "May";
		objUnique.push(month);
		month= new StaticValueDTO();
		  month.key = "6";
            month.value = "June";
		objUnique.push(month);
		month= new StaticValueDTO();
		  month.key = "7";
            month.value = "July";
		objUnique.push(month);
		month= new StaticValueDTO();
		  month.key = "8";
            month.value = "August";
		objUnique.push(month);
		month= new StaticValueDTO();
		  month.key = "9";
            month.value = "September";
		objUnique.push(month);
		month= new StaticValueDTO();
		  month.key = "10";
            month.value = "October";
		objUnique.push(month);
		month= new StaticValueDTO();
		  month.key = "11";
            month.value = "November";
		objUnique.push(month);
		month= new StaticValueDTO();
		  month.key = "12";
            month.value = "December";
		objUnique.push(month);
		return objUnique;
    }
}

export const deepCopy = <Tp>(tgt: Tp): Tp => {
    return JSON.parse(JSON.stringify(tgt));
};

export const Compare = (ChangeVal: any, OrginalVal: any) => {
    let valOG = getReturnValue(OrginalVal);
    valOG = valOG.filter(x => x.FieldName != 'IsActive' && x.FieldName != 'CreatedDate' && x.FieldName != 'UpdatedDate' && x.FieldName != 'CreatedUserId' && x.FieldName != 'UpdatedUserId' && x.FieldName != 'SaveAsDraftStatus' && x.FieldName != 'IsLocked');
    let valChange = ChangeVal.filter(x => x.FieldName != 'IsActive' && x.FieldName != 'CreatedDate' && x.FieldName != 'UpdatedDate' && x.FieldName != 'CreatedUserId' && x.FieldName != 'UpdatedUserId' && x.FieldName != 'SaveAsDraftStatus' && x.FieldName != 'IsLocked');
    //console.log("Dynamic-----------------");
    //console.log("og");
    //console.log(valOG);
    //console.log("valChange");
    //console.log(valChange);
    //console.log("Dynamic-----------------");
    return JSON.stringify(valChange) === JSON.stringify(valOG);
};

export const CompareValue = (ChangeVal: any, OrginalVal: any) => {
    //console.log(ChangeVal);
    //console.log(OrginalVal);
    return JSON.stringify(ChangeVal) === JSON.stringify(OrginalVal);
};

export const CompareStaticValue = (ChangeVal: any, OrginalVal: any) => {

    // let valOG = OrginalVal.filter(x => x.FieldName != 'IsActive' && x.FieldName != 'CreatedDate' && x.FieldName != 'UpdatedDate' && x.FieldName != 'CreatedUserId' && x.FieldName != 'UpdatedUserId' && x.FieldName != 'SaveAsDraftStatus');
    // let valChange = ChangeVal.filter(x => x.FieldName != 'IsActive' && x.FieldName != 'CreatedDate' && x.FieldName != 'UpdatedDate' && x.FieldName != 'CreatedUserId' && x.FieldName != 'UpdatedUserId' && x.FieldName != 'SaveAsDraftStatus');
    //console.log(ChangeVal);
    //console.log(OrginalVal);
    //console.log("11111111111111111111111111111111111111111");
    let valChange = iterate(ChangeVal);
    let valOG = iterate(OrginalVal);
    //console.log("Change");
    //console.log(valChange);
    //console.log("og");
    //console.log(valOG);
    return JSON.stringify(valChange) === JSON.stringify(valOG);
};

export const CompareSaveasDraft = (ChangeVal: any, OrginalVal: any) => {
    //console.log("og");
    //console.log(OrginalVal);
    //console.log("valChange");
    //console.log(ChangeVal);
    let valOG = getReturnValueSaveasDraft(OrginalVal);
    let valChange = getReturnValueSaveasDraft(ChangeVal);

    valOG = valOG.filter(x => x.FieldName != 'IsActive' && x.FieldName != 'CreatedDate' && x.FieldName != 'UpdatedDate' && x.FieldName != 'CreatedUserId' && x.FieldName != 'UpdatedUserId' && x.FieldName != 'SaveAsDraftStatus');
    valChange = valChange.filter(x => x.FieldName != 'IsActive' && x.FieldName != 'CreatedDate' && x.FieldName != 'UpdatedDate' && x.FieldName != 'CreatedUserId' && x.FieldName != 'UpdatedUserId' && x.FieldName != 'SaveAsDraftStatus');
    //console.log("og");
    //console.log(valOG);
    //console.log("valChange");
    //console.log(valChange);
    return JSON.stringify(valChange) === JSON.stringify(valOG);
};

export const getReturnValue = (value: any) => {
    let objUnique: DynamicValueDTO[] = [];
    value = value.filter(x => x.FieldCnfg.FieldName != 'IsActive' && x.FieldCnfg.FieldName != 'CreatedDate' && x.FieldCnfg.FieldName != 'UpdatedDate' && x.FieldCnfg.FieldName != 'CreatedUserId' && x.FieldCnfg.FieldName != 'UpdatedUserId');
    value.forEach(item => {

        let addValue: DynamicValueDTO = new DynamicValueDTO();
        addValue.UniqueId = item.UniqueID;
        addValue.FieldCnfgId = item.FieldCnfg.FieldCnfgId;
        ////only for bit
        if ((item.FieldCnfg.FieldDataTypeCnfg.Name == 'bit' || item.FieldCnfg.FieldDataTypeCnfg.Name == 'radio') && item.FieldValue != null) {
            if (item.FieldValue == true)
                addValue.FieldValue = "1";//(addValue.FieldValue) ? "1" : "0";
            else if (item.FieldValue == false)
                addValue.FieldValue = "0";

        }
        else
            addValue.FieldValue = item.FieldValue;
        addValue.FieldName = item.FieldCnfg.FieldName;
        addValue.FieldValueText = item.GridDisplayField;
        addValue.FieldDataTypeName = item.FieldCnfg.FieldDataTypeCnfg.Name;
        addValue.DisplayName = item.DisplayName;

        objUnique.push(addValue);
    });
    return objUnique;
}

export const ConvertDateAndDateTimeSaveFormat = (dControl: any) => {
    if (dControl != null && dControl.length > 0) {
        var re = /-/;
        let data = dControl.filter(x => (x.FieldCnfg.FieldDataTypeCnfg.Name == 'datetime' || x.FieldCnfg.FieldDataTypeCnfg.Name == 'date') && x.FieldCnfg.FieldName != 'CreatedDate' && x.FieldCnfg.FieldName != 'UpdatedDate');
        if (data.length > 0 && data[0].UniqueID != 0) {
            data.forEach(item => {
                if (item.FieldValue != '' && item.FieldValue != null && item.FieldValue.search(re) == -1) {
                    // console.log("Does not contain -");
                    if (item.FieldCnfg.FieldDataTypeCnfg.Name == 'date') {
                        item.FieldValue = Common.GetDateSaveFormat(item.FieldValue);
                    }
                    else if (item.FieldCnfg.FieldDataTypeCnfg.Name == 'datetime') {
                        item.FieldValue = Common.GetDateTimeSaveFormat(item.FieldValue);
                    }
                }
            });
        }
    }
    return dControl;

}

const iterate = (obj) => {

    let objUnique: StaticValueDTO[] = [];
    Object.keys(obj).forEach(key => {
        if (key != "AgencyProfileId"
            && key != "IsActive" && key != "UpdatedDate" && key != "CreatedDate" && key != "CreatedUserId" && key != "UpdatedUserId") {
            // console.log('key: ' + key + ', value: ' + obj[key]);
            if (typeof obj[key] == 'string' && obj[key].includes("-", "T") && key != "lastName" && key !="FirstName" && key !="MiddleName" ) {
                if (obj[key].split("T")[1] == "00:00:00")
                    obj[key] = obj[key].split("T")[0];
                else
                    obj[key] = obj[key].replace("T", " ");
            }
            let addValue: StaticValueDTO = new StaticValueDTO();
            addValue.key = key;
            addValue.value = obj[key] == undefined ? null : obj[key];
            objUnique.push(addValue);
            //  console.log("key " + key);

            if (typeof obj[key] === 'object' && obj[key] != null) {
                //   console.log("------------object");
                iterate(obj[key])
            }
        }
    });
    //  console.log(objUnique);
    return objUnique;
}
export const getReturnValueSaveasDraft = (value: any) => {
    //this.isValidinput = true;
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

        if (item.FieldCnfg.FieldDataTypeCnfg.Name == 'date' && item.FieldValue != null && item.FieldValue != '' && item.FieldCnfg.FieldName != 'CreatedDate' && item.FieldCnfg.FieldName != 'UpdatedDate') {
            addValue.FieldValue = Common.GetDateSaveFormat(item.FieldValue);
        }

        if (item.FieldCnfg.FieldDataTypeCnfg.Name == 'datetime' && item.FieldValue != null && item.FieldValue != '' && item.FieldCnfg.FieldName != 'CreatedDate' && item.FieldCnfg.FieldName != 'UpdatedDate') {
            addValue.FieldValue = Common.GetDateTimeSaveFormat(item.FieldValue);
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

export class DynamicValueDTO {
    UniqueId: number;
    FieldCnfgId: number;
    FieldValue: string;
    FieldName: string;
    FieldValueText: string;
    FieldDataTypeName: string;
    DisplayName: string;
}

export class StaticValueDTO {
    key: string;
    value: string;
}

export  class UserAuditHistoryDetailDTO{
  UserAuditHistoryId:number=0;
  FormCnfgId:number=0;
  ActionId:number=0;
  RecordNo:number=0
  ChildCarerEmpType:number=0;
  ChildCarerEmpId:number=0;
  ActionDateTime:string;
}

export class UserAuditHistoryDTO {
  UserProfileId: number=0;
  AgencyProfileId: number=0;
  IsUserLoggedOut: number=1;
}
