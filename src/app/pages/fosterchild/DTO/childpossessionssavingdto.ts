import { BaseDTO } from '../../basedto';
import { DynamicValue } from '../../dynamic/dynamicvalue';

export class ChildPossessionsSavingDTO extends BaseDTO {
    ChildPossessionsSavingId: number;
    UniqueID: number;
    ChildId: number;
    FieldCnfgId: number;
    FieldValue: string;
    SequenceNo: number;
    ControlLoadFormat: string[];
    DynamicValue: DynamicValue = new DynamicValue();
    LstChildPossessionsSavingDetails = [];
}

export class ChildPossessionsSavingDetailsDTO {
    FieldCnfgId: number;
    FieldName: string;
    FieldValue: string;
    SequenceNo: number;
    FieldDataTypeName: string;
    FieldValueText: string;
    StatusId: number;
    UniqueID: number;
    DisplayName: string;
    ChildId: number;
}