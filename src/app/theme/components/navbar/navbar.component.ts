import { DOCUMENT, Location } from '@angular/common';
import { Component, ElementRef, Inject, ViewChild, ViewEncapsulation, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AppState } from '../../../app.state';
import { Common } from '../../../pages/common';
import { PagesComponent } from '../../../pages/pages.component';
import { APICallService } from '../../../pages/services/apicallservice.service';
import { FormNotificationDTO } from '../../../pages/systemadmin/DTO/formnotificationdto';
import { UserAuditHistoryDetailDTO } from '../../../pages/common';
import { parse } from 'path';
declare var $: any;

@Component({
    selector: 'az-navbar',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    providers: [APICallService]
})
export class NavbarComponent {

    @ViewChild('btnPrint') infoPrint: ElementRef;
    @ViewChild('btnCancel') infoCancel: ElementRef;
    public isMenuCollapsed: boolean = false;
    UserName;
    logoPath; isLoading: boolean = false;
    objNotificationDTO: FormNotificationDTO = new FormNotificationDTO();
    //srcPath = "assets/img/app/Photonotavail.png";
    srcPath = environment.photonotavail_url;
    apiURL = environment.api_url + "/api/GeneratePDF/";
    attachSignature = false; _Form: FormGroup; subject; eAddress; submitted = false;
    objUserAuditHistoryDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    constructor(private _state: AppState, private renderer: Renderer2, private modal: PagesComponent,
        private _router: Router, private apiService: APICallService, private _formBuilder: FormBuilder,
        private _location: Location, @Inject(DOCUMENT) private document: any) {

        this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
            this.isMenuCollapsed = isCollapsed;
        });
        this.UserName = Common.GetSession("UserName");
        if (Common.GetSession("UserImageId") != null && Common.GetSession("UserImageId") != "null") {
            //this.uploadServie.GetImageById(Common.GetSession("UserImageId")).then(data => {
            //    this.srcPath = "data:image/jpeg;base64," + data;
            //});
            this.apiService.get("UploadDocuments", "GetImageById", Common.GetSession("UserImageId")).then(data => {
                this.srcPath = "data:image/jpeg;base64," + data;
            });
        }
        else {
            //this.srcPath = "../../../assets/img/app/Photonotavail.png";
            this.srcPath = environment.photonotavail_url;
        }
        if (Common.GetSession("AgencyLogo") != null)
            this.logoPath = Common.GetSession("AgencyLogo");
        else
            this.logoPath = "assets/img/logo/az_logo_full.png";

        this._Form = _formBuilder.group({
            subject: ['', Validators.required],
            eAddress: ['', Validators.required],
            signature:['']
        });
    }

    public toggleMenu() {
        this.isMenuCollapsed = !this.isMenuCollapsed;
        this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
    }

    clickLogout() {
        //   this.loService.updateLastlogoutTime(Common.GetSession("UserProfileId")).then(data => { });
        this.apiService.get("UserProfile", "UpdateLastlogoutTime", Common.GetSession("UserProfileId")).then(data => { });
        let url = this.document.location.pathname + "#/login";
        let pageLength: number = parseInt(Common.GetSession("pagelength"));
        this.objUserAuditHistoryDetailDTO.ActionId =13;
        this.objUserAuditHistoryDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession('UserAuditHistoryId'));
        Common.addUserAuditHistoryDetails(this.objUserAuditHistoryDetailDTO);
        const savedOperations = sessionStorage.getItem('UserOperations');
        let operations:UserAuditHistoryDetailDTO[] =[];
        if(savedOperations){
        operations = JSON.parse(savedOperations);
        }
        this.apiService.post("UserProfile", "SaveUserAuditHistoryDetail",operations).then(data => {});
        Common.IsUserLogin.next(false);
        Common.ClearSession();

        //window.history.go(-(window.history.length - pageLength));
        //setTimeout(function () {
        //   window.location.replace(url);
        //   // window.location.reload();
        //}, 0);
      this._router.navigate(['/login']);
    }
    fnNotificationHide(printContents) {
        if ($("router-outlet").next().children().last().find("emailnotification").length > 0 &&
            $("router-outlet").next().children().last().find("emailnotification").find(".card-header").html().trim() == "Notification") {
            var iframe = $("router-outlet").next().children().last().find("emailnotification").find(".card").html();
            printContents = printContents.replace(iframe, "");
        }
        return printContents;
    }
    fnUploadDocumentHide(printContents) {

        var buttons = $("router-outlet").next().children().last().find("button");
        for (var k = 0; k < buttons.length; k++) {
            var btn = buttons[k].outerHTML;
            if (buttons[k].innerHTML.trim() == "Save as Draft") {
                printContents = printContents.replace(btn, "");
            }
            else if (buttons[k].innerHTML.trim() == "Back") {
                printContents = printContents.replace(btn, "");
            }

        }
        var btnSubmit = $("router-outlet").next().children().last().find('#btnSubmit');
        if (btnSubmit.length > 0) {
            var temp = btnSubmit[0].outerHTML;
            printContents = printContents.replace(temp, "");
        }
        var uploadli = $("router-outlet").next().children().last().find('.clearfix').find('li').find("a");
        for (var k = 0; k < uploadli.length; k++) {
            var li = uploadli[k].outerHTML;
            printContents = printContents.replace(li, "");
            //if (uploadli[k].innerHTML.trim() == "Upload Documents"
            //    || uploadli[k].innerHTML.trim() == "Upload Document"
            //    || uploadli[k].innerHTML.trim() == "Referral-2 Upload Documents") {
            //    printContents = printContents.replace(li, "");
            //}
        }

        if ($("router-outlet").next().children().last().find("upload-documents").length > 0) {
            var temp1 = $("router-outlet").next().children().last().find("upload-documents").html().trim();
            printContents = printContents.replace(temp1, "");
        }
        return printContents;
    }
    fnTextArea(printContents) {
        var textArea = $("router-outlet").next().children().last().find("textarea");
        for (var k = 0; k < textArea.length; k++) {
            var temp = textArea[k].outerHTML;
            textArea[k].innerHTML = "";
            var val = textArea[k].value;
            var txt = "<div style='border-style:solid;border-width:1px;border-color:#D9D9D9;padding:5px;'><p>" + val + "</p></div>";
            //var txt = textArea[k].outerHTML.replace("</textarea>", val + "</textarea>");
            printContents = printContents.replace(temp, txt);
        }
        return printContents;
    }
    fnTextBox(printContents) {
        var textBox = $("router-outlet").next().children().last().find("input");
        for (var k = 0; k < textBox.length; k++) {
            var temp = textBox[k].outerHTML;
            if (textBox[k].getAttribute("type") == "text" || textBox[k].getAttribute("type") == "datetime"
                || textBox[k].getAttribute("type") == "date" || textBox[k].getAttribute("type") == "time"
                || textBox[k].getAttribute("type") == "number") {
                var val = textBox[k].value;
                var txt = textBox[k].outerHTML.replace("input", "input value=\"" + val + "\"");
                printContents = printContents.replace(temp, txt);
            }
            else if (textBox[k].getAttribute("type") == "checkbox") {
                if (textBox[k].checked == true) {
                    var chk = textBox[k].outerHTML.replace("<input", "<input checked");
                    printContents = printContents.replace(temp, chk);
                }
            }
            else if (textBox[k].getAttribute("type") == "radio") {
                var radio;
                if (textBox[k].checked == true) {
                    radio = textBox[k].outerHTML.replace("<input", "<input checked");
                    printContents = printContents.replace(temp, radio);
                }
            }
        }
        return printContents;
    }
    fnListBox(printContents) {
        var lstBox = $("router-outlet").next().children().last().find("listbox").find('select');
        for (var k = 0; k < lstBox.length; k++) {
            var temp = lstBox[k].outerHTML;
            var txt="";
            for (var i = 0; i < lstBox[k].options.length; i++) {
                if (lstBox[k].options[i] != null && lstBox[k].options[i].selected == true) {
                    if(txt!="")
                        txt = txt + "," + lstBox[k].options[i].innerHTML;
                    else
                        txt = lstBox[k].options[i].innerHTML;
                }
            }
            printContents = printContents.replace(temp, "<div style='border-style:solid;border-width:1px;border-color:#D9D9D9;padding:5px;'><p>" + txt + "</p></div>");
        }
        return printContents;
    }
    fnDropDown(printContents) {
        var dropDown = $("router-outlet").next().children().last().find("select");
        for (var k = 0; k < dropDown.length; k++) {
            for (var i = 0; i < dropDown[k].length; i++) {
                if (dropDown[k][i].selected == true) {
                    var temp = dropDown[k][i].outerHTML;
                    var txt = dropDown[k][i].outerHTML.replace("<option", "<option selected");
                    printContents = printContents.replace(temp, txt);
                }
            }
        }
        return printContents;
    }
    fnIframe(printContents) {
        //var iframe = $("router-outlet").next().children().last().find("iframe").contents().find("body").html()
        var iframe = $("router-outlet").next().children().last().find("editor");
        for (var k = 0; k < iframe.length; k++) {
            var temp = iframe[k].outerHTML;
            var value = iframe.find("iframe").contents().find("body").html();
            printContents = printContents.replace(temp, "<div style='border-style:solid;border-width:1px;border-color:#D9D9D9;padding:5px;'><p>" + value + "</p></div>");
        }
        return printContents;
    }
    printContents;
    fnPrint() {

        this.apiService.get("AgencySignatureCnfg", "GetAgencySignatureMappingByFormId",Common.GetSession("formcnfgid")).then(data => {
            if (data != null)
                this.fnPrintSub(data, 1);
            else
                this.fnPrintSub(data, 0);
        });
    }
    fnPrintSub(data,value)
    {
        var popupWin;
        this.printContents = $("router-outlet").next().children().last().html();
        this.printContents = this.fnUploadDocumentHide(this.printContents);
        this.printContents = this.fnNotificationHide(this.printContents);
        this.printContents = this.fnTextArea(this.printContents);
        this.printContents = this.fnTextBox(this.printContents);
        this.printContents = this.fnListBox(this.printContents);
        this.printContents = this.fnDropDown(this.printContents);
        this.printContents = this.fnIframe(this.printContents);
        if (value == 1 && data.lstAgencySignatureCnfg != null) {
            this.printContents = this.printContents + "<div style='font-size:18px;padding:30px'>Signatures:</div>";
            data.lstAgencySignatureCnfg.forEach(T => {
                var str = "";
                if (T.Signature.trim() == "Foster Carer") {
                        str = "<div style='font-size:12px;padding:30px;'><table style='width:100%'><tr><td style='width:40%'>" + T.Signature +
                            " :</td><td> Signed...................................</td> <td>Date...................................</td></tr> </table></div> "
                        + "<div style='font-size:12px;padding:30px;'><table style='width:100%'><tr><td style='width:40%'></td><td> Signed...................................</td> <td>Date...................................</td></tr> </table></div> ";
                    }
                    else
                    {
                        str = "<div style='font-size:12px;padding:30px;'><table style='width:100%'><tr><td style='width:40%'>" + T.Signature +
                            " :</td><td> Signed...................................</td> <td>Date...................................</td></tr> </table></div> ";
                    }
                    this.printContents = this.printContents + str;
            });
        }
        var style = ""; var link = "";
        var i;
        for (i = 0; i < $("style").length; i++) {
            style = style + $("style")[i].outerHTML;
        }
        var j;
        for (j = 0; j < $("link").length; j++) {
            link = link + $("link")[j].outerHTML;
        }
        //printContents = document.getElementById('print-section').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
      <html>
        <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <title>Print tab</title>
            ${style}
            ${link}
        <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
    <body onload="window.print();window.close()">${this.printContents}</body>
      </html>`
        );
        popupWin.document.close();
        this.fnCancelClick();
    }
    fnAddSignature(printContents)
    {
        this.apiService.get("AgencySignatureCnfg", "GetAgencySignatureCnfgByFormId", 83).then(data => {
            if (data != null)
            {
                data.lstAgencySignatureMapping.forEach(T => {
                    var str = "<div>Signatures:</div> < div ><table><tr><td>" + T.Signature +
                        " :</td>< td > Signed...............</td> <td>Date.................</td> < /tr > < /table>< /div> ";
                    printContents = printContents + str;
                });
            }
        });
        return printContents;
    }

    fnShowPrint()
    {
        this.fnPrint();
    }
    fnShowEmail() {
        this.subject = "";
        this.eAddress = "";
        this.submitted = false;
        //this.printContents = $("router-outlet").next().children().last().find(".widget-body").html();
        let event = new MouseEvent('click', { bubbles: true });
        this.infoPrint.nativeElement.dispatchEvent(event);
    }
    fnPrintContentData()
    {
        var popupWin;
        this.printContents = $("router-outlet").next().children().last().html();
        this.printContents = this.fnUploadDocumentHide(this.printContents);
        this.printContents = this.fnNotificationHide(this.printContents);
        this.printContents = this.fnTextArea(this.printContents);
        this.printContents = this.fnTextBox(this.printContents);
        this.printContents = this.fnListBox(this.printContents);
        this.printContents = this.fnDropDown(this.printContents);
        this.printContents = this.fnIframe(this.printContents);
        //console.log(printContents);
        var style = ""; var link = "";
        var i;
        for (i = 0; i < $("style").length; i++) {
            style = style + $("style")[i].outerHTML;
        }
        var j;
        for (j = 0; j < $("link").length; j++) {
            link = link + $("link")[j].outerHTML;
        }
        let pdfContent = `
      <html>
        <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <title>Print tab</title>
            ${style}
            ${link}
        <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
    <body onload="window.print();window.close()">${this.printContents}</body>
      </html>`;
        return pdfContent;
    }
    fnEmail(form)
    {
        this.submitted = true;
        if (form.valid) {
            this.isLoading = true;
            this.objNotificationDTO.UserIds = this.eAddress;
            this.objNotificationDTO.Subject = this.subject;
            this.objNotificationDTO.Body = this.fnPrintContentData();
            this.apiService.post("FormNotification", "SendFormContentEmail",this.objNotificationDTO).then(data => {
                if (data == true)
                    this.modal.alertSuccess("Email Send Successfully..");
                else
                    this.modal.alertSuccess("Email not Send Successfully..");
                this.fnCancelClick();
                this.isLoading = false;
            });

        }
    }
    fnCancelClick()
    {
        let event = new MouseEvent('click', { bubbles: true });
        this.infoCancel.nativeElement.dispatchEvent(event);
    }
}
