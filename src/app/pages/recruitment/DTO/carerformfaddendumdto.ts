
import { BaseDTO } from '../../basedto';
import { DynamicValue } from '../../dynamic/dynamicvalue';

export class CarerFormFAddendumDTO extends BaseDTO {
    CarerFormFAddendumId: number;
    CarerParentId: number;
    FieldId: number;
    FieldValue: string;
    ControlLoadFormat = [];
    DynamicValue: DynamicValue = new DynamicValue();
}