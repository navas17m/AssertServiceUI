/// <reference path="common.ts" />
///// <reference path="../../../node_modules/php-date-formatter/js/file1.ts" />
/// <reference path="../../environments/environment.ts" />
import { DOCUMENT, Location } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, OnInit, ViewChild, ViewEncapsulation, Renderer2 } from '@angular/core';
import { FormControl, FormControlDirective, FormControlName, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';
import * as moment from 'moment';
import { SimpleTimer } from 'ng2-simple-timer';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';
import { AppState } from '../app.state';
import { Common } from './common';
import { APICallService } from './services/apicallservice.service';
import { Subject } from 'rxjs';
import { UserAuditHistoryDetailDTO } from './common';
declare var window: any;
@Component({
    selector: 'az-pages',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './pages.component.html',
    styleUrls: ['./pages.component.scss'],
   // providers: [AppState, SimpleTimer, APICallService]
})
export class PagesComponent implements OnInit {
    @ViewChild('btnSuccessModel') successModal: ElementRef;
    @ViewChild('btnInfoModel') infoModal: ElementRef;
    @ViewChild('btnWarningModel') warningModal: ElementRef;
    @ViewChild('btnDangerModel') dangerModal: ElementRef;
    @ViewChild('btnPageLoadingModel') pageLoadingModal: ElementRef;
    @ViewChild('btnPageLoadingStopModel') pageLoadingStopModal: ElementRef;
    @ViewChild('btnUserSessionModel') UserSessionModel: ElementRef;
    @ViewChild('btnlogout') btnlogoutModel: ElementRef;
	@ViewChild('btnPageHelpF1') btnPageHelpF1: ElementRef;
    public isMenuCollapsed: boolean = false;
    public static InternetConnectionStatus:Subject<any>=new Subject();
    @HostListener('window:online')
    ononline() {
        this.networkStatusChange(true);
    }

    @HostListener('window:offline')
    onoffline() {
        this.networkStatusChange(false);
    }

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if ("F1" == event.key) {
            if (window.location.href.split('#/')[1] == 'login') {
                this.fnPageHelpF1('login');
            }
            else if (window.location.href.split('#/')[1] == 'pages/dashboard') {
                this.fnPageHelpF1('dashboard');
            }
            else if (window.location.href.split('#/pages/')[1].split('/')[1])
            {
                this.fnPageHelpF1(window.location.href.split('#/pages/')[1].split('/')[1]);
            }
            return false;
        }
    }

    UserSessionCheckTime = environment.userSessionCheckTime;
    objUserAuditHistoryDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    //public data: Array<any> = MyData;
    constructor(private _state: AppState, private router: Router,
        private _location: Location, private renderer: Renderer2,
        private toastrService: ToastrService, // private toastrConfig: ToastrConfig,
        @Inject(DOCUMENT) private document: any, private st: SimpleTimer,
        private apiService: APICallService) {

        this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
            this.isMenuCollapsed = isCollapsed;
        });
        this.toastrService.clear();
        // toastrConfig.timeOut = 3000;
        // toastrConfig.progressBar = true;
        // toastrConfig.closeButton = true;
        // toastrConfig.autoDismiss = true;
        // toastrConfig.positionClass = "toast-top-right";

        let t: string[] = this.st.getTimer();
        if (t.indexOf('UserSessionCheck') == -1) {
            this.st.newTimer('UserSessionCheck', this.UserSessionCheckTime);
        }
        this.subscribeTimer2();
        //check session
        //if (Common.GetSession("IsAppAccessUser") == null || Common.GetSession("IsAppAccessUser") == "0") {
        //    let url = this.document.location.pathname + "#/login";
        //    let pageLength: number = parseInt(Common.GetSession("pagelength"));

        //    if (Common.GetSession("pagelength") != null)
        //        window.history.go(-(window.history.length - pageLength));

        //    setTimeout(function () {
        //        window.location.replace(url);
        //    }, 0);
        //}
        Common.IsUserLogin.subscribe(n => this.Respone(n));

        ///Check Internet Connecction
        window.addEventListener('load', function () {
            function updateOnlineStatus(event) {
                let condition = navigator.onLine ? "online" : "offline";
            }
            window.addEventListener('online', updateOnlineStatus);
            window.addEventListener('offline', updateOnlineStatus);
        });
        //End
    }

    networkStatusChange(isOnline: boolean) {
        this.toastrService.clear();
        if (isOnline == false) {
            PagesComponent.InternetConnectionStatus.next({status:"0"});

            this.IsShowOfflineAlertMessage = true;
            this.alertMessage = "You lost an internet connection. Please connect before proceeding.";
            this.headerMessage = "OFFLINE";
            let event = new MouseEvent('click', { bubbles: true });
            this.dangerModal.nativeElement.dispatchEvent(event);
        }
        else {
            PagesComponent.InternetConnectionStatus.next({status:"1"});
            this.OfflineAlertMessageStop();
            this.toastrService.success("You are now back to online.", 'ONLINE!');
            let temp:any= JSON.parse(Common.GetSession("OfflineServerRequests"));
            // console.log(temp);
             if(temp!=null)
             {
                 if(temp.Type=="Post")
                 {
                     this.apiService.post(temp.ControllerName,temp.FunctionName,temp.Parameter).then(data=>{
                         this.responseRestore(data);
                     })
                 }
                 else if(temp.Type=="Save")
                 {
                     this.apiService.save(temp.ControllerName,temp.Parameter,temp.FunctionName).then(data=>{
                         this.responseRestore(data);
                     })
                 }

             }
        }
    }

    responseRestore(data)
    {
       // console.log("1");
        if(data.IsError==false)
        {
          //  console.log("2");
            Common.SetSession("OfflineServerRequests",null);
        }
    }


    IsShowOfflineAlertMessage = true;
    closeDangerAlert() {
        this.IsShowOfflineAlertMessage = false;
    }

    public OfflineAlertMessageStop() {
        if (this.IsShowOfflineAlertMessage) {
            let event = new MouseEvent('click', { bubbles: true });
            this.dangerModal.nativeElement.dispatchEvent(event);
        }
    }

    insPageHelpF1;
    public fnPageHelpF1(path) {

        this.apiService.get("AgencyProfile", "GetFormHelpInfo", path).then(data => {
            this.ResponePageHelpF1(data);
        });
    }
    private ResponePageHelpF1(data) {
        if (data != null) {
            this.insPageHelpF1 = data;
            this.pageloading = true;
            let event = new MouseEvent('click', { bubbles: true });
            this.btnPageHelpF1.nativeElement.dispatchEvent(event);
        }
    }

    pageloading = true;
    alertMessage; headerMessage;
    public PageLoading() {
        this.pageloading = true;
        let event = new MouseEvent('click', { bubbles: true });
        this.pageLoadingModal.nativeElement.dispatchEvent(event);
    }

    public PageLoadingStop() {
        this.pageloading = false;
        let event = new MouseEvent('click', { bubbles: true });
        this.pageLoadingStopModal.nativeElement.dispatchEvent(event);
    }

    public alertSuccess(message, headertext?) {
        this.toastrService.success(message, 'Success!');
        // this.toastr.success(message, 'Success!', { toastLife: 8000, dismiss: 'click' });
        //this.alertMessage = message;
        //this.headerMessage = headertext;
        //let event = new MouseEvent('click', { bubbles: true });
        //this.renderer.invokeElementMethod(
        //    this.successModal.nativeElement, 'dispatchEvent', [event]);
    }
    public alertInfo(message, headertext?) {
        this.toastrService.info(message, null);
        //this.alertMessage = message;
        //this.headerMessage = headertext;
        //let event = new MouseEvent('click', { bubbles: true });
        //this.renderer.invokeElementMethod(
        //    this.infoModal.nativeElement, 'dispatchEvent', [event]);
    }
    public showInfo(message, headertext?) {
        this.toastrService.show(message, null,{timeOut:15000});
        //this.alertMessage = message;
        //this.headerMessage = headertext;
        //let event = new MouseEvent('click', { bubbles: true });
        //this.renderer.invokeElementMethod(
        //    this.infoModal.nativeElement, 'dispatchEvent', [event]);
    }
    public alertWarning(message, headertext?) {
        this.toastrService.warning(message, 'Alert!');
        //this.alertMessage = message;
        //this.headerMessage = headertext;
        //let event = new MouseEvent('click', { bubbles: true });
        //this.renderer.invokeElementMethod(
        //    this.warningModal.nativeElement, 'dispatchEvent', [event]);
    }
    public alertDanger(message, headertext?) {
        //this.alertMessage = message;
        //this.headerMessage = headertext;
        //let event = new MouseEvent('click', { bubbles: true });
        //this.renderer.invokeElementMethod(
        //    this.dangerModal.nativeElement, 'dispatchEvent', [event]);
        this.toastrService.error(message, 'Oops!');
    }
    private Respone(data) {
        ///  console.log("pages" + data)
        if (data == false) {
            this.router.navigate(['/login/1']);
        }

    }

    ngOnInit() {
        this.getCurrentPageName();
        //API return when service cal
        APICallService.invokeEvent.subscribe((value) => {
            this.resetUserSessionCheckTimer();
        });
    }

    resetUserSessionCheckTimer() {
        let t: string[] = this.st.getTimer();
        if (t.indexOf('UserSessionCheck') > -1) {
            this.st.delTimer("UserSessionCheck");
            this.st.newTimer('UserSessionCheck', this.UserSessionCheckTime);
        }
        else
            this.st.newTimer('UserSessionCheck', this.UserSessionCheckTime);
        this.isFirstTime = false;
        this.subscribeTimer2();
        Common.SetSession("TimerStart", Common.GetNewDateasFormatted());
    }

    fnTimeOut(eve) {
        this.clickCloseUserSession();
    }

    timer2Id: number;
    timer2button = 'Subscribe';
    subscribeTimer2() {
        this.st.subscribe('UserSessionCheck', () => this.timer2callback());
    }
    isFirstTime: boolean = false;
    timerCount;
    timer2callback() {

        if (this.isFirstTime) {
            this.timer2Id = window.setInterval(() => { this.fnTimeComparison() }, 1000);

            let event = new MouseEvent('click', { bubbles: true });
            this.UserSessionModel.nativeElement.dispatchEvent(event);

            let t: string[] = this.st.getTimer();
            if (t.indexOf('UserSessionCheck') > -1) {
                this.st.delTimer("UserSessionCheck");
            }
            this.runCountDown = true;
        }
        this.isFirstTime = true;
    }
    runCountDown = false;
    //set timer 2

    fnTimeComparison() {
        if (Common.GetSession("TimerStart") != null && Common.GetSession("TimerStart") != "0") {
            let startTime: any = Common.GetSession("TimerStart");
            let endTime: any = Common.GetNewDateasFormatted();
            let diffMs = (new Date(endTime).valueOf() - new Date(startTime).valueOf());
            // let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
            let diffSec = Math.floor(diffMs / 1000);
            let diffCount = this.UserSessionCheckTime + 146;
            if (diffSec > diffCount) {
                this.clickCloseUserSession();
            }
        }
    }
    //

    clickContinueUserSession() {
        clearInterval(this.timer2Id);
        let upId = Common.GetSession("UserProfileId");
        if (upId != null)
            this.apiService.get("UserProfile", "UpdateUserLastActionDate", upId).then(data => { });

        this.runCountDown = false;
        this.resetUserSessionCheckTimer();
    }
    clickCloseUserSession() {
        clearInterval(this.timer2Id);
        let upId = Common.GetSession("UserProfileId");
        this.apiService.get("UserProfile", "UpdateLastlogoutTime", upId).then(data => { });
        this.runCountDown = false;
        let event = new MouseEvent('click', { bubbles: true });
        this.UserSessionModel.nativeElement.dispatchEvent(event);

        this.runCountDown = false;
        let t: string[] = this.st.getTimer();
        if (t.indexOf('UserSessionCheck') > -1) {
            this.st.delTimer("UserSessionCheck");
        }
        this.objUserAuditHistoryDetailDTO.ActionId =14;
        this.objUserAuditHistoryDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession('UserAuditHistoryId'));
        Common.addUserAuditHistoryDetails(this.objUserAuditHistoryDetailDTO);
        const savedOperations = sessionStorage.getItem('UserOperations');
        let operations:UserAuditHistoryDetailDTO[] =[];
        if(savedOperations){
        operations = JSON.parse(savedOperations);
        }
        this.apiService.post("UserProfile", "SaveUserAuditHistoryDetail",operations).then(data => {});
        let pageLength: number = parseInt(Common.GetSession("pagelength"));
        Common.IsUserLogin.next(false);
        Common.ClearSession();
        this.router.navigate(['/login/0']);
    }

    ngOnDestroy() {
        let t: string[] = this.st.getTimer();
        if (t.indexOf('UserSessionCheck') > -1) {
            this.st.delTimer("UserSessionCheck");
        }
    }


    public getCurrentPageName(): void {
        let url = this._location.path();
        let hash = (window.location.hash) ? '#' : '';
        setTimeout(function () {
            let subMenu = jQuery('a[href="' + hash + url + '"]').closest("li").closest("ul");
            window.scrollTo(0, 0);
            subMenu.closest("li").addClass("sidebar-item-expanded");
            subMenu.slideDown(250);
        });
    }

    public hideMenu(): void {
        this._state.notifyDataChanged('menu.isCollapsed', true);
    }

    public ngAfterViewInit(): void {
        document.getElementById('preloader').style['display'] = 'none';
    }


    public GetErrorFocus(form: FormGroup, elem? ) {
        if (!form.valid) {
            let invalid = <FormControl[]>Object.keys(form.controls).map(key => form.controls[key]).filter(ctl => ctl.invalid);
            //  console.log(invalid);
            if (invalid.length > 0) {
                let invalidElem: any = invalid[0];
                if (!invalidElem.nativeElement && invalidElem.controls) {//to handle formgroup

                    let invalidField = <FormControl[]>Object.keys(invalidElem.controls).map(key => invalidElem.controls[key]).filter(ctl => ctl.invalid);
                    if (invalidField.length > 0) {
                        let invalidItem: any = invalidField[0];
                        invalidItem.nativeElement.focus();
                    }
                } else {
                    if(invalidElem.nativeElement != undefined)
                        invalidElem.nativeElement.focus();
                    else
                        elem.focus();
                }
            }
            return false;
        }

    }
    public GetContactErrorFocus(form: FormGroup, countyElem:NgSelectComponent, countryElem:NgSelectComponent ) {
        if (!form.valid) {
            let invalid = <FormControl[]>Object.keys(form.controls).map(key => form.controls[key]).filter(ctl => ctl.invalid);
            if (invalid.length > 0) {
                let invalidElem: any = invalid[0];
                if (!invalidElem.nativeElement && invalidElem.controls) {//to handle formgroup

                    let invalidField = <FormControl[]>Object.keys(invalidElem.controls).map(key => invalidElem.controls[key]).filter(ctl => ctl.invalid);
                    if (invalidField.length > 0) {
                        let invalidItem: any = invalidField[0];
                        invalidItem.nativeElement.focus();
                    }
                } else {
                    if(invalidElem.nativeElement != undefined)
                        invalidElem.nativeElement.focus();
                    else if(form.controls.CountyId.status == 'INVALID')
                        countyElem.focus();
                    else if(form.controls.CountryId.status == 'INVALID')
                        countryElem.focus();

                }
            }
            return false;
        }
    }
    public GetDateTimeSaveFormat(val) {
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

    public GetDateTimeEditFormat(val) {
        let dtParsed, dtFormatted, out = '';
        //let fmt = new DateFormatter();
        //dtParsed = fmt.parseDate(val, 'Y-m-d H:i');
        //dtFormatted = fmt.formatDate(dtParsed, 'd/m/Y H:i');
        dtParsed = moment(val, 'YYYY-MM-DD HH:mm')
        dtFormatted = dtParsed.format('DD/MM/YYYY HH:mm');
        return dtFormatted;
    }

    public GetDateSaveFormat(val) {
        if (val) {
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
        else
            return null;
    }

    public GetDateEditFormat(val) {
        if (val != null && val != '' && val != 'undefined') {
            let dtParsed, dtFormatted, out = '';
            //let fmt = new DateFormatter();
            //dtParsed = fmt.parseDate(val, 'Y-m-d');
            //dtFormatted = fmt.formatDate(dtParsed, 'd/m/Y');
            dtParsed = moment(val, 'YYYY-MM-DD')
            dtFormatted = dtParsed.format('DD/MM/YYYY');

            // add.FromDate = moment(fromdt).format("DD/MM/YYYY");

            return dtFormatted;
        }
        else return null;
    }

    insFormRoleAccessMapping = [];
    UserProfileId;
    public GetDeletAccessPermission(FormId) {

        this.insFormRoleAccessMapping = JSON.parse(Common.GetSession("FormRoleAccessMapping"));

        this.UserProfileId = Common.GetSession("UserProfileId");
        if (this.UserProfileId == 1) {
            return true;
        }
        else if (FormId != null && this.insFormRoleAccessMapping != null) {
            let check = this.insFormRoleAccessMapping.filter(data => data.FormCnfgId == FormId && data.AccessCnfgId == 4);
            if (check.length > 0) {
                return true;
            }
            else {
                return false;
            }
        }
    }

    public GetAddBtnAccessPermission(FormId) {
        this.insFormRoleAccessMapping = JSON.parse(Common.GetSession("FormRoleAccessMapping"));
        this.UserProfileId = Common.GetSession("UserProfileId");
        if (this.UserProfileId == 1) {
            return true;
        }
        else if (FormId != null && this.insFormRoleAccessMapping != null) {
            let check = this.insFormRoleAccessMapping.filter(data => data.FormCnfgId == FormId && data.AccessCnfgId == 2);
            if (check.length > 0) {
                return true;
            }
            else {
                return false;
            }
        }
    }

    public GetEditBtnAccessPermission(FormId) {
        this.insFormRoleAccessMapping = JSON.parse(Common.GetSession("FormRoleAccessMapping"));
        this.UserProfileId = Common.GetSession("UserProfileId");
        if (this.UserProfileId == 1) {
            return true;
        }
        else if (FormId != null && this.insFormRoleAccessMapping != null) {
            let check = this.insFormRoleAccessMapping.filter(data => data.FormCnfgId == FormId && data.AccessCnfgId == 3);
            if (check.length > 0) {
                return true;
            }
            else {
                return false;
            }
        }
    }

}

const originFormControlNgOnChanges = FormControlDirective.prototype.ngOnChanges;
FormControlDirective.prototype.ngOnChanges = function () {
    this.form.nativeElement = this.valueAccessor._elementRef.nativeElement;
    return originFormControlNgOnChanges.apply(this, arguments);
};

const originFormControlNameNgOnChanges = FormControlName.prototype.ngOnChanges;
FormControlName.prototype.ngOnChanges = function () {
    const result = originFormControlNameNgOnChanges.apply(this, arguments);
    this.control.nativeElement = this.valueAccessor._elementRef.nativeElement;
    return result;
};


