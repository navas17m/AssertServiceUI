import { BaseDTO } from '../../basedto';
import { DynamicValue } from '../../dynamic/dynamicvalue';

export class ChildCSEDTO extends BaseDTO {

    UniqueID: number;
    ChildCSEId: number;  
    FieldCnfgId: number;
    FieldValue: string;
    ChildId: number = 0;
    ControlLoadFormat = [];
    SequenceNo: number;
    DynamicValue: DynamicValue[] = [];
}
