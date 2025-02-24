import { BaseDTO } from '../../basedto';
import { DynamicValue } from '../../dynamic/dynamicvalue';

export class CarerFireEscapePlanDTO extends BaseDTO {
    CarerFireEscapePlanId: number;
    UniqueID: number;
    CarerParentId: number;
    FieldId: number;
    FieldValue: string;
    SequenceNo: number;
    CarerParentIds = [];
    DynamicValue: DynamicValue = new DynamicValue();
}