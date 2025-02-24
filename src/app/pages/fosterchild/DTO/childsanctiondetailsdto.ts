import { BaseDTO } from '../../basedto';
import { DynamicValue } from '../../dynamic/dynamicvalue';

export class ChildSanctionDetailsDTO extends BaseDTO {

    UniqueID: number;
    ChildSanctionDetailsId: number;
    FieldCnfgId: number;
    FieldValue: string;
    ChildId: number = 0;
    ControlLoadFormat = [];
    SequenceNo: number;
    DynamicValue: DynamicValue[] = [];
}
