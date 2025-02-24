import { BaseDTO } from '../../basedto';
import { DynamicValue } from '../../dynamic/dynamicvalue';

export class ChildPathwayplanInfo extends BaseDTO {
    ChildPathwayplanInfoId: number;
    UniqueID: number;
    ChildId: number;
    FieldCnfgId: number;
    FieldValue: string;
    SequenceNo: number;
    DynamicValue: DynamicValue = new DynamicValue();
}