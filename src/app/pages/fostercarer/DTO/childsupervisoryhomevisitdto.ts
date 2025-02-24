import {DynamicValue} from '../../dynamic/dynamicvalue'
import { BaseDTO} from '../../basedto'

export class ChildSupervisoryHomeVisitDTO extends BaseDTO {
    ChildSupervisoryHomeVisitId: number;
    CarerSHVSequenceNo: number;
    SequenceNo: number;
    ChildId: number;
    FieldId: number;
    FieldValue: string;
    UniqueID: number;
    DynamicValue: DynamicValue = new DynamicValue();
    ControlLoadFormat: string[];
    ChildName: string;
    DateOfVisit: Date;
}