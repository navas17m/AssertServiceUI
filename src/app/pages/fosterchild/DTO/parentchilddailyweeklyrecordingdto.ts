import { BaseDTO } from '../../basedto';
import { DynamicValue } from '../../dynamic/dynamicvalue';

export class ParentChildDailyWeeklyRecordingDTO extends BaseDTO {

    UniqueID: number;
    ParentChildDailyWeeklyRecordingId: number;
    ChildName: string;
    CarerName: string;
    FieldCnfgId: number;
    FieldValue: string;
    ChildId: number = 0;
    ControlLoadFormat = [];
    SequenceNo: number;  
    DynamicValue: DynamicValue[] = [];
}
