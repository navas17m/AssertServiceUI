import {Component, ViewEncapsulation} from '@angular/core';

import {MessagesService} from './messages.service';
import { APICallService } from '../../../pages/services/apicallservice.service';
import {Router} from '@angular/router';
@Component({
    selector: 'az-messages',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./messages.component.scss'],
    templateUrl: './messages.component.html',
    providers: [MessagesService]
})

export class MessagesComponent{     
    public messages:Array<Object>;
    public notifications:Array<Object>;
    public tasks:Array<Object>;
    lstNotification = [];lstFirstFiveNotification = [];
    constructor (private _messagesService:MessagesService,private apiService: APICallService, private _router: Router){
        // this.messages = _messagesService.getMessages();
        // this.notifications = _messagesService.getNotifications();
        // this.tasks = _messagesService.getTasks();

        this.apiService.get("SchedulerNotification", "GetUserNotificationInfoByUserId",0).then(data => { this.lstNotification = data;
            this.lstFirstFiveNotification=this.lstNotification.slice(0, 5);
            });
    }

    fnShowAll() {	 
        this._router.navigate(['/pages/systemadmin/usernotification']);
    }

}