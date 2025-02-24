import { BaseDTO } from '../../basedto';
import { DynamicValue } from '../../dynamic/dynamicvalue';

export class ChildCarePlanDTO extends BaseDTO {
    ChildCarePlanId: number;
    UniqueID: number;
    ChildId: number;
    FieldCnfgId: number;
    FieldValue: string;
    SequenceNo: number;
    DynamicValue: DynamicValue = new DynamicValue();
}