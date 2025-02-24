import { BaseDTO } from '../../basedto';
export class FormNotificationDTO extends BaseDTO {
    EmailNotificationInfoId: number;
    FormDisplayName: string;
    IsSocialWorkerNotified: boolean;    
    IsCarerNotified: boolean;
    UserIds: string; 
    arrUserId = [];
    DisplayOrder: number;
    OriginalIsActive: boolean;
    ActiveFlag: boolean;
    OriginalActiveFlag: boolean;
    IsShowSocialWorkerNCarer: boolean;
    Subject: string;
    Body: string;
    AdditionalEmailIds: string;
}