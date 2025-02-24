import {DynamicValue} from '../../dynamic/dynamicvalue'
import { BaseDTO} from '../../basedto'

export class CarerImmunisationHistoryDTO extends BaseDTO {
    CarerImmunisationHistoryId: number;
    CarerParentId: number;
    FieldId: number;
    FieldValue: string;
    DynamicValue: DynamicValue = new DynamicValue();
    ControlLoadFormat: string[];
}