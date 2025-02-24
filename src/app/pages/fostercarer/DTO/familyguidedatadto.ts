import {DynamicValue} from '../../dynamic/dynamicvalue'
import { BaseDTO} from '../../basedto'

export class CarerFamilyGuideDTO extends BaseDTO {
    CarerFamilyGuideId: number;
    UniqueID: number;
    CarerParentId: number;
    FieldId: number;
    FieldValue: string;
    DynamicValue: DynamicValue = new DynamicValue();
}