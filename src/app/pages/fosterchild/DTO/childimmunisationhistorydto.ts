import { BaseDTO } from '../../basedto';
import { DynamicValue } from '../../dynamic/dynamicvalue';

export class childImmunisationHistoryDTO extends BaseDTO {
    ChildHealthImmunisationHistoryId: number;
    ChildId: number;
    FieldId: number;
    FieldValue: string;
    DynamicValue: DynamicValue = new DynamicValue();
    ControlLoadFormat: string[];
}