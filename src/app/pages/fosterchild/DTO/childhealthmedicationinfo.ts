import { BaseDTO } from '../../basedto';
import { DynamicValue } from '../../dynamic/dynamicvalue';

export class ChildHealthMedicationInfo extends BaseDTO {
    ChildHealthMedicationInfoId: number;
    UniqueID: number;
    ChildId: number;
    FieldCnfgId: number;
    FieldValue: string;
    SequenceNo: number;
    DynamicValue: DynamicValue = new DynamicValue();
    ChildHealthMedicationInfoDetail = [];
}

export class ChildHealthMedicationInfoDetailDTO extends BaseDTO {
    FieldCnfgId: number;
    FieldName: string;
    FieldValue: string;
    SequenceNo: number;
    FieldDataTypeName: string;
    FieldValueText: string;
    StatusId: number;
    UniqueID: number;
    ChildHealthMedicationInfoDetailId: number;
    ChildHealthMedicationSno: number;
    ChildId: number;
}