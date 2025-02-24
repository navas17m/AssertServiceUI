import { BaseDTO } from '../../basedto';
import { DynamicValue } from '../../dynamic/dynamicvalue';

export class ChildMissingPlacementDTO extends BaseDTO {

    UniqueID: number;
    ChildMissingPlacementId: number;
    FieldCnfgId: number;
    FieldValue: string;
    ChildId: number = 0;    
    SequenceNo: number;
    DynamicValue: DynamicValue[] = [];
}
