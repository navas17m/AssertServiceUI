import { Component, Input } from '@angular/core';
import { Common } from '../common';
import { APICallService } from '../services/apicallservice.service';

@Component({
    selector: 'EmailNotification',
    template: `<div [hidden]='!isVisible' widget class="card">
        <div class="card-header">Notification</div>
        <div class="card-body widget-body">
        <div class="form-group" *ngIf="arrayUserIds.length > 0">
            <label class="">Select Users to be notified : &nbsp;</label>
            <p-multiSelect class="p-0" [style]="{'width':'100%'}" placeholder="Select Users" filterPlaceHolder="Search"
             [maxSelectedLabels]="1" selectedItemsLabel="{0} users selected" [options]="arrayUserIds" optionLabel="name"
             optionValue="id" [(ngModel)]="selectedUserIds"></p-multiSelect>
            <!-- <Multiselect-Dropdown [BindValue]='arrayUserIds' [DefaultSelection]='selectedUserIds'
            (selected)="fnSetSelectedUser($event)"></Multiselect-Dropdown> -->
        </div>
        <div class="form-group">
            <label> Enter Addtional Email Addresses to be notified : <br/> (Email Addresses should be separated by commas. For example john@domain.com, pete@domain.com)</label>
         <input type="text"  class="form-control" [(ngModel)]="addEmailIds" />
        </div>
        </div>
  </div>
`,
})

export class NotificationComponent {
    isVisible: boolean = true;
    arrayUserIds = [];
    selectedUserIds = [];
    tempArr = []; addEmailIds;
    @Input()
    set FormCnfgId(value: any) {
        this.fnLoadData(value);
    }
    @Input()
    get AddtionalEmailIds() {
        return this.addEmailIds;
    }
    @Input()
    get EmailIds() {
        return this.selectedUserIds;
    }
    constructor(private apiService: APICallService) {

    }

    fnSetSelectedUser(event)
    {
        this.selectedUserIds=event;
    }

    fnLoadData(formCnfgId) {
        this.apiService.get("FormNotification", "GetEmailNotificationEmailIdByFormId", formCnfgId).then(data => {
            if (data != null) {
				if (data != '' && data != '0' && data != 0) {
					let arr = data.split(',');
					arr.forEach(item => {
						this.tempArr.push(item);
                    });

                }
                this.apiService.get("UserProfile", "GetAllForNotification", parseInt(Common.GetSession("AgencyProfileId"))).then(data => {
                    data.forEach(item => {
                        this.arrayUserIds.push({ id: item.UserProfileId, name: item.PersonalInfo.FullName + "(" + item.LoginId + ")" });
                    });

                    if (this.tempArr.length > 0) {
                        this.tempArr.forEach(it => {
                            this.selectedUserIds.push(parseInt(it));
                        });
                    }
                });
            }
            else {
                this.isVisible = false;
            }
        });
    }
}
