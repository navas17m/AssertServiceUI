import { BaseDTO } from '../../basedto';
import { DynamicValue } from '../../dynamic/dynamicvalue';

export class ChildOfstedNotificationDTO extends BaseDTO {

    UniqueID: number;
    ChildOfstedNotificationId: number;  
    FieldCnfgId: number;
    FieldValue: string;
    ChildId: number = 0;
    ControlLoadFormat = [];
    SequenceNo: number;
    DynamicValue: DynamicValue[] = [];
}
