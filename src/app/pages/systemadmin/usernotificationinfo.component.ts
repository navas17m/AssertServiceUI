import { Component, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserNotificationDTO } from './DTO/usernotificationdto';

@Component({
        selector: 'usernotificationinfo',
        templateUrl: './usernotificationinfo.component.template.html',
})

export class UserNotificationInfo {
    public searchText: string = "";
    @ViewChild('btnShowNotificationDetails') infoShowNotificationDetails: ElementRef;
   // @ViewChild('ddFormNotification') ddFormNotification;
    lstNotification=[]; arrFormNotification = [];
    isLoading: boolean = false;
    limitPerPage:number=10;
    controllerName = "SchedulerNotification";currentStatus;
    footerMessage={
      'emptyMessage': `<div align=center><strong>No records found.</strong></div>`,
      'totalMessage': ' - Records'
    };
    constructor(private apiService: APICallService, private pComponent: PagesComponent,private renderer: Renderer2,private _router: Router) {
    this.fnShowByStatus(0);
    }
	fnShowByStatus(value)
	{
		this.currentStatus=value;
		this.apiService.get(this.controllerName, "GetUserNotificationInfoByUserId",value).then(data => { this.lstNotification = data;});
	}
    fnSaveChanges()
    {
        this.isLoading = true;
        for (let item of this.lstNotification) {
            var _insFN = new UserNotificationDTO();
            _insFN.UserNotificationId = item.UserNotificationId;
            _insFN.Status = item.Status;
            _insFN.TypeId = item.TypeId;
			_insFN.UpdatedUserId =  parseInt(Common.GetSession("UserProfileId"));
            this.arrFormNotification.push(_insFN);
        }
        this.apiService.post(this.controllerName, "UpdateUserNotificationInfo", this.arrFormNotification).then(data =>{ this.Respone(data);
		this.fnShowByStatus(this.currentStatus);
		});
    }
	fnBack()
	{
		 this._router.navigate(['/pages/dashboard']);
	}
	 private Respone(data) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.pComponent.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            this.pComponent.alertSuccess(Common.GetUpdateSuccessfullMsg);
            this.arrFormNotification = [];
        }
    }
	objNotification;
	fnShowDetails(Id, TypeId) {

		this.objNotification=this.lstNotification.filter(T=>T.UserNotificationId==Id && T.TypeId==TypeId);
        let event = new MouseEvent('click', { bubbles: true });
        this.infoShowNotificationDetails.nativeElement.dispatchEvent(event);
    }
    setPageSize(pageSize:string)
    {
      this.limitPerPage = parseInt(pageSize);
    }
}
