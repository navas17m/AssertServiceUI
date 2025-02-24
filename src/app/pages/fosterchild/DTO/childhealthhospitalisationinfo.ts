import { BaseDTO } from '../../basedto';
import { DynamicValue } from '../../dynamic/dynamicvalue';

export class ChildHealthHospitalisationInfo extends BaseDTO {
    ChildHealthHospitalisationInfoId: number;
    UniqueID: number;
    ChildId: number;
    FieldCnfgId: number;
    FieldValue: string;
    SequenceNo: number;
    DynamicValue: DynamicValue = new DynamicValue();
}