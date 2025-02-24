import { BaseDTO } from '../../basedto';
export class SchedulerCategoryDTO extends BaseDTO {
    SchedulerCategoryCnfgId: number;
    SchedulerCategory: string;
    SchedulerTypeCnfgId: number;
    FrequencyCnfgId: number;
    FrequencyValue: number; 
    NotificationFrequencyCnfgId: number; 
    NotificationFrequencyValue: number;
    IsSocialWorkerNotified: boolean;
    IsCarerNotified: boolean;
    UserIds: string;
    ComplianceCheckTypeId: number;
    SchedulerQuery: string
    arrUserId = [];
    ActiveFlag: boolean;   
    AdditionalEmailIds: string;
    OriginalActiveFlag: boolean;
    OriginalFrequencyCnfgId: number;
    OriginalFrequencyValue: number;
    OriginalNotificationFrequencyCnfgId: number; 
    OriginalNotificationFrequencyValue: number;
    OriginalIsSocialWorkerNotified: boolean;
    OriginalIsCarerNotified: boolean;
    OriginalarrUserId = [];
}