

import { BaseDTO } from '../../basedto';
import { DynamicValue } from '../../dynamic/dynamicvalue';

export class CarerstatusCnfg {
    CarerStatusId: number;
    CarerParentStatusId: number;
    CarerStatus: string;
    Description: string;
}

export class CarerStatusChange extends BaseDTO {
    CarerStatusChangeId: number;
    StatusId: number = null;
    CarerId: number;
    CarerParentId: number;
    ChangeDate: Date = null;
    Comments: string;
    ReasonId: number = null;
    ReasonName: string;
    ReasonOther: string;
    OnHoldReminderDate: Date = null;
    StatusName: string;
    AssessorName: string;
    AssessorEmail: string;
    DateofCompletion: Date = null;
    MidPointReviewDate: Date = null;
    AssessorSupervisor: String;
    ControlLoadFormat: string[];
    StatusEndDate: Date = null;
    TypeId: number;
    SId: number;
    DynamicValue: DynamicValue = new DynamicValue();
    DynamicValueInter: DynamicValue = new DynamicValue();
}


export class CarerCheckList {
    StatusId: number;
    CarerId: number;
    UniqueID: number;
    CarerParentId: number;
    FieldId: number;
    FieldValue: string;
    SequenceNo: number;
    DynamicValue: DynamicValue = new DynamicValue();
    ControlLoadFormat: string[];
}