import {DynamicValue} from '../../dynamic/dynamicvalue'
import { BaseDTO} from '../../basedto'

export class CarerIncidentInfoDTO extends BaseDTO {
    UniqueID: number;
    CarerParentId: number;
    FieldId: number;
    FieldValue: string;
    SequenceNo: number;
    AllegationDate: Date;
    DynamicValue: DynamicValue = new DynamicValue();
}