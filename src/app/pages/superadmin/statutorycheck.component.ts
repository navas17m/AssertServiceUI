import { Component, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { FormNotificationDTO } from '../systemadmin/DTO/formnotificationdto';
import { ComplianceDTO } from './DTO/compliance';
import { StatutoryCheckDTO } from './DTO/statutorycheck';

declare var $: any;

@Component({
    selector: 'StatutoryCheckViewAll',
    templateUrl: './statutorycheck.component.template.html',
})
export class StatutoryCheckComponet {
    @ViewChild('btnPrint') infoPrint: ElementRef;
    @ViewChild('btnCancel') infoCancel: ElementRef;
    subject; eAddress; submittedprint = false; _FormPrint: FormGroup;
    isLoading: boolean = false;
    objNotificationDTO: FormNotificationDTO = new FormNotificationDTO();

    objQeryVal;
    controllerName = "ComplianceCheckTypeCnfg";
    MemberTypeId: number;
    userTypeId: number;
    userId: number;
    objStatutoryCheckDTO: StatutoryCheckDTO = new StatutoryCheckDTO();
    objComplianceDTO: ComplianceDTO = new ComplianceDTO();
    insCarerDetails;
    SecondCarerHidden = true;
    apiURL = environment.api_url + "/api/GeneratePDF/";
    carerCheckVisi = false;
    childCheckVisi = false;
    empCheckVisi = false;
    loading = false;
    AgencyProfileId;
    code;
    constructor(private activatedroute: ActivatedRoute, private _router: Router, private _formBuilder: FormBuilder,
        private pComponent: PagesComponent, private apiService: APICallService,
        private renderer: Renderer2) {
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });

        this._FormPrint = _formBuilder.group({
            subject: ['', Validators.required],
            eAddress: ['', Validators.required],
            signature: ['']
        });

        //Carer
        this.objComplianceDTO.UserTypeId = 4;
        if (this.objQeryVal.mid == 13) {
            this.carerCheckVisi = true;
            this.objComplianceDTO.CarerParentId = parseInt(Common.GetSession("CarerParentId"));
            if (Common.GetSession("SelectedApplicantProfile") != "0" && Common.GetSession("SelectedApplicantProfile") != null) {
                this.insCarerDetails = JSON.parse(Common.GetSession("SelectedApplicantProfile"));
                this.code = this.insCarerDetails.CarerCode;
                if (this.insCarerDetails.SCFullName)
                    this.SecondCarerHidden = false;
            }
            this.bindStatutoryCheckAll();
        }
        else if (this.objQeryVal.mid == 3) {
            this.carerCheckVisi = true;
            this.objComplianceDTO.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            if (Common.GetSession("SelectedCarerProfile") != "0" && Common.GetSession("SelectedCarerProfile") != null) {
                this.insCarerDetails = JSON.parse(Common.GetSession("SelectedCarerProfile"));
                this.code = this.insCarerDetails.CarerCode;
                if (this.insCarerDetails.SCFullName)
                    this.SecondCarerHidden = false;
            }
            this.bindStatutoryCheckAll();
        }
        else if (this.objQeryVal.mid == 19) {
            //Child
            this.childCheckVisi = true;
            this.objComplianceDTO.UserTypeId = 5;
            this.objComplianceDTO.ChildId = parseInt(Common.GetSession("ChildId"));
            this.insCarerDetails = JSON.parse(Common.GetSession("SelectedChildProfile"));
            this.code = this.insCarerDetails.ChildCode;
            this.bindStatutoryCheckAll();
        }
        else if (this.objQeryVal.mid == 25) {
            //Employee
            this.empCheckVisi = true;
            this.objComplianceDTO.UserTypeId = 6;
            this.objComplianceDTO.EmployeeId = parseInt(Common.GetSession("EmployeeId"));
            this.insCarerDetails = JSON.parse(Common.GetSession("SelectedEmployeeProfile"));
            this.code = this.insCarerDetails.EmployeeNumber;
            this.bindStatutoryCheckAll();
        }

    }

    bindStatutoryCheckAll() {
        this.loading = true;
        this.apiService.post("StatutoryCheck", "GetStatutoryCheckAll", this.objComplianceDTO).then(data => {
            this.LoadStatutoryCheck(data);
        })
    }

    fnDonloadPDF() {
        window.location.href = this.apiURL + "GenerateStatutoryCheckPDF/" + this.AgencyProfileId + "," + this.objComplianceDTO.UserTypeId + "," + this.objComplianceDTO.CarerParentId + "," + this.objComplianceDTO.ChildId + "," + this.objComplianceDTO.EmployeeId + "," + this.code;
    }
    fnPrint() {
        this.apiService.get("GeneratePDF", "GenerateStatutoryCheckPrint", this.AgencyProfileId + "," + this.objComplianceDTO.UserTypeId + "," + this.objComplianceDTO.CarerParentId + "," + this.objComplianceDTO.ChildId + "," + this.objComplianceDTO.EmployeeId + "," + this.code).then(data => {
            // console.log(data);
            var popupWin;
            // var style = ""; var link = "";
            // var i;
            // for (i = 0; i < $("style").length; i++) {
            //     style = style + $("style")[i].outerHTML;
            // }
            // var j;
            // for (j = 0; j < $("link").length; j++) {
            //     link = link + $("link")[j].outerHTML;
            // }
            popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
            popupWin.document.open();
            popupWin.document.write(`
      <html>
        <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <title>Print tab</title>     
           
        <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
    <body onload="window.print();window.close()">${data}</body>
      </html>`);
            popupWin.document.close();
        });
    }
    fnShowEmail() {
        this.subject = "";
        this.eAddress = "";
        this.submittedprint = false;
        let event = new MouseEvent('click', { bubbles: true });
        this.infoPrint.nativeElement.dispatchEvent(event);
    }
    fnEmail(form) {
        this.submittedprint = true;
        if (form.valid) {
            this.isLoading = true;
            this.objNotificationDTO.UserIds = this.eAddress;
            this.objNotificationDTO.Subject = this.subject;
            this.objNotificationDTO.Body = this.AgencyProfileId + "," + this.objComplianceDTO.UserTypeId + "," + this.objComplianceDTO.CarerParentId + "," + this.objComplianceDTO.ChildId + "," + this.objComplianceDTO.EmployeeId + "," + this.code;
            this.apiService.post("GeneratePDF", "EmailStatutoryCheck", this.objNotificationDTO).then(data => {
                if (data == true)
                    this.pComponent.alertSuccess("Email Send Successfully..");
                else
                    this.pComponent.alertDanger("Email not Send Successfully..");
                this.fnCancelClick();
                this.isLoading = false;
            });

        }
    }
    fnCancelClick() {
        let event = new MouseEvent('click', { bubbles: true });
        this.infoCancel.nativeElement.dispatchEvent(event);
    }

    insPCCheckId = [];
    insSCCheckId = [];
    insCarerFamilyCheckId = [];
    insBackupCarerCheckId = [];
    insBackupCarerFamilyCheckId = [];
    insChildCheckId = [];
    insEmpCheckId = [];

    insPCCheckIds: ComplianceCheck[] = [];
    insSCCheckIds: ComplianceCheck[] = [];
    insCarerFamilyCheckIds: ComplianceCheck[] = [];
    insBackupCarerCheckIds: ComplianceCheck[] = [];
    insBackupCarerFamilyCheckIds: ComplianceCheck[] = [];
    insChildCheckIds: ComplianceCheck[] = [];
    insEmpCheckIds: ComplianceCheck[] = [];

    headerPrimaryCheckList = [];
    headerSecondCheckList = [];
    headerCarerFamilyCheckList = [];
    headerBackupCarerCheckList = [];
    headerBackupCarerFamilyCheckList = [];
    headerChildCheckList = [];
    headerEmpCheckList = [];
    //: StatutoryCheckList[] 
    globalPrimaryCheckList = [];
    globalSecondCheckList = [];
    globalCarerFamilyCheckList = [];
    globalBackupCarerCheckList = [];
    globalBackupCarerFamilyCheckList = [];
    globalChildCheckList = [];
    globalEmpCheckList = [];

    objStatutoryCheckList = [];
    LoadStatutoryCheck(data) {
        this.globalPrimaryCheckList = [];
        this.globalSecondCheckList = [];
        this.globalCarerFamilyCheckList = [];
        this.globalBackupCarerCheckList = [];
        this.globalBackupCarerFamilyCheckList = [];
        this.globalChildCheckList = [];
        this.globalEmpCheckList = [];

        if (data != null) {
            data.forEach(maiItem => {
                this.objStatutoryCheckList = [];
                maiItem.forEach(subItem => {
                    let add: ComplaintInfo = new ComplaintInfo();
                    add.FieldCnfgId = subItem.FieldCnfgId;
                    add.FieldName = subItem.FieldName;
                    add.FieldValue = subItem.FieldValue;
                    add.FieldDataTypeName = subItem.FieldDataTypeName;
                    add.FieldValueText = subItem.FieldValueText;
                    add.UniqueID = subItem.UniqueID;
                    add.SequenceNo = subItem.SequenceNo;
                    add.DisplayName = subItem.DisplayName;
                    add.ComplianceCheckId = subItem.ComplianceCheckId;
                    add.UserProfileId = subItem.UserProfileId;
                    add.CheckName = subItem.CheckName;
                    add.MemberTypeId = subItem.MemberTypeId;
                    add.MemberName = subItem.MemberName;
                    add.BackupCarerName = subItem.BackupCarerName;
                    this.objStatutoryCheckList.push(add);
                });

                if (this.objComplianceDTO.UserTypeId == 4) {
                    if (this.objStatutoryCheckList.length > 0 && this.objStatutoryCheckList[0].MemberTypeId == 1) {
                        //Primary Carer
                        var index = this.insPCCheckId.indexOf(this.objStatutoryCheckList[0].ComplianceCheckId);
                        if (index === -1) {
                            let add: ComplianceCheck = new ComplianceCheck();
                            add.ComplianceCheckId = this.objStatutoryCheckList[0].ComplianceCheckId;
                            add.Name = this.objStatutoryCheckList[0].CheckName;
                            this.insPCCheckIds.push(add);
                            this.insPCCheckId.push(this.objStatutoryCheckList[0].ComplianceCheckId);

                            this.headerPrimaryCheckList.push(this.objStatutoryCheckList);
                        }
                        this.globalPrimaryCheckList.push(this.objStatutoryCheckList);
                    }
                    else if (this.objStatutoryCheckList.length > 0 && this.objStatutoryCheckList[0].MemberTypeId == 2) {
                        //Secondary Carer
                        var index = this.insSCCheckId.indexOf(this.objStatutoryCheckList[0].ComplianceCheckId);
                        if (index === -1) {
                            let add: ComplianceCheck = new ComplianceCheck();
                            add.ComplianceCheckId = this.objStatutoryCheckList[0].ComplianceCheckId;
                            add.Name = this.objStatutoryCheckList[0].CheckName;
                            this.insSCCheckIds.push(add);
                            this.insSCCheckId.push(this.objStatutoryCheckList[0].ComplianceCheckId);
                            this.headerSecondCheckList.push(this.objStatutoryCheckList);
                        }

                        this.globalSecondCheckList.push(this.objStatutoryCheckList);
                    }
                    else if (this.objStatutoryCheckList.length > 0 && this.objStatutoryCheckList[0].MemberTypeId == 3) {
                        //Carer Family
                        var index = this.insCarerFamilyCheckId.indexOf(this.objStatutoryCheckList[0].ComplianceCheckId);
                        if (index === -1) {
                            let add: ComplianceCheck = new ComplianceCheck();
                            add.ComplianceCheckId = this.objStatutoryCheckList[0].ComplianceCheckId;
                            add.Name = this.objStatutoryCheckList[0].CheckName;
                            this.insCarerFamilyCheckIds.push(add);
                            this.insCarerFamilyCheckId.push(this.objStatutoryCheckList[0].ComplianceCheckId);
                            this.headerCarerFamilyCheckList.push(this.objStatutoryCheckList);
                        }
                        this.globalCarerFamilyCheckList.push(this.objStatutoryCheckList);
                    }
                    else if (this.objStatutoryCheckList.length > 0 && this.objStatutoryCheckList[0].MemberTypeId == 4) {
                        //Backup Carer
                        var index = this.insBackupCarerCheckId.indexOf(this.objStatutoryCheckList[0].ComplianceCheckId);
                        if (index === -1) {
                            let add: ComplianceCheck = new ComplianceCheck();
                            add.ComplianceCheckId = this.objStatutoryCheckList[0].ComplianceCheckId;
                            add.Name = this.objStatutoryCheckList[0].CheckName;
                            this.insBackupCarerCheckIds.push(add);
                            this.insBackupCarerCheckId.push(this.objStatutoryCheckList[0].ComplianceCheckId);
                            this.headerBackupCarerCheckList.push(this.objStatutoryCheckList);
                        }
                        this.globalBackupCarerCheckList.push(this.objStatutoryCheckList);
                    }
                    else if (this.objStatutoryCheckList.length > 0 && this.objStatutoryCheckList[0].MemberTypeId == 5) {
                        //Backup Carer Family
                        var index = this.insBackupCarerFamilyCheckId.indexOf(this.objStatutoryCheckList[0].ComplianceCheckId);
                        if (index === -1) {
                            let add: ComplianceCheck = new ComplianceCheck();
                            add.ComplianceCheckId = this.objStatutoryCheckList[0].ComplianceCheckId;
                            add.Name = this.objStatutoryCheckList[0].CheckName;
                            this.insBackupCarerFamilyCheckIds.push(add);
                            this.insBackupCarerFamilyCheckId.push(this.objStatutoryCheckList[0].ComplianceCheckId);
                            this.headerBackupCarerFamilyCheckList.push(this.objStatutoryCheckList);
                        }
                        this.globalBackupCarerFamilyCheckList.push(this.objStatutoryCheckList);
                    }
                }
                else if (this.objComplianceDTO.UserTypeId == 5 && this.objStatutoryCheckList.length > 0 && this.objStatutoryCheckList[0].MemberTypeId == 6) {
                    //Child
                    var index = this.insChildCheckId.indexOf(this.objStatutoryCheckList[0].ComplianceCheckId);
                    if (index === -1) {
                        let add: ComplianceCheck = new ComplianceCheck();
                        add.ComplianceCheckId = this.objStatutoryCheckList[0].ComplianceCheckId;
                        add.Name = this.objStatutoryCheckList[0].CheckName;
                        this.insChildCheckIds.push(add);
                        this.insChildCheckId.push(this.objStatutoryCheckList[0].ComplianceCheckId);
                        this.headerChildCheckList.push(this.objStatutoryCheckList);
                    }
                    this.globalChildCheckList.push(this.objStatutoryCheckList);
                }
                else if (this.objComplianceDTO.UserTypeId == 6 && this.objStatutoryCheckList.length > 0 && this.objStatutoryCheckList[0].MemberTypeId == 7) {
                    //Employee
                    var index = this.insEmpCheckId.indexOf(this.objStatutoryCheckList[0].ComplianceCheckId);
                    if (index === -1) {
                        let add: ComplianceCheck = new ComplianceCheck();
                        add.ComplianceCheckId = this.objStatutoryCheckList[0].ComplianceCheckId;
                        add.Name = this.objStatutoryCheckList[0].CheckName;
                        this.insEmpCheckIds.push(add);
                        this.insEmpCheckId.push(this.objStatutoryCheckList[0].ComplianceCheckId);
                        this.headerEmpCheckList.push(this.objStatutoryCheckList);
                    }
                    this.globalEmpCheckList.push(this.objStatutoryCheckList);
                }
            });
            this.loading = false;
        }
    }

}

export class ComplaintInfo {
    FieldCnfgId: number;
    FieldName: string;
    FieldValue: string;
    SequenceNo: number;
    FieldDataTypeName: string;
    FieldValueText: string;
    StatusId: number;
    UniqueID: number;
    DisplayName: string;
    ComplianceCheckId: number;
    UserProfileId: number;
    CheckName: string;
    MemberTypeId: string;
    MemberName: string;
    BackupCarerName: string;
}
export class ComplianceCheck {
    ComplianceCheckId: number;
    Name: string;
}

export class StatutoryCheckList {
    ComplianceCheckId: number;
    MemberTypeId: number;
    DataList = [];
}