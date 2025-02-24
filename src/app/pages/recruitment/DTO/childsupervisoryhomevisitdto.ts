import { BaseDTO } from '../../basedto';
import { DynamicValue } from '../../dynamic/dynamicvalue';

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
}