import { BaseDTO } from '../../basedto';
import { DynamicValue } from '../../dynamic/dynamicvalue';

export class CarerHealthAndSafetyDTO extends BaseDTO {
    CarerHealthAndSafetyId: number;
    UniqueID: number;
    CarerParentId: number;
    FieldId: number;
    FieldValue: string;
    SequenceNo: number;
    DynamicValue: DynamicValue = new DynamicValue();
    ControlLoadFormat: string[];
}