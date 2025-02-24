import {DynamicValue} from '../../dynamic/dynamicvalue'
import { BaseDTO} from '../../basedto'

export class CarerHolidayDetailsDTO extends BaseDTO {
    CarerHolidayDetailsId: number;
    UniqueID: number;
    CarerParentId: number;
    FieldId: number;
    FieldValue: string;
    SequenceNo: number;
    DynamicValue: DynamicValue = new DynamicValue();
}