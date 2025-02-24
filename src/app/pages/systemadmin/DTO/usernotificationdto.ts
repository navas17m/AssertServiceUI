import { BaseDTO } from '../../basedto';
export class UserNotificationDTO extends BaseDTO {
    UserNotificationId: number;
    UserIds: string;
    Status: boolean;
    Subject: string; 
    Body: string;
    TypeId:number;
}