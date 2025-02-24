import {DynamicValue} from '../../dynamic/dynamicvalue'
import { BaseDTO} from '../../basedto'

export class CarerSchedule6Info extends BaseDTO {
    UniqueID: number;
    CarerParentId: number;
    FieldId: number;
    FieldValue: string;
    SequenceNo: number;
    EventDate: Date;
    DynamicValue: DynamicValue = new DynamicValue();
}
