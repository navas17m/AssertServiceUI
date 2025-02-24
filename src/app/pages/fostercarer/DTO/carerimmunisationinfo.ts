import {DynamicValue} from '../../dynamic/dynamicvalue'
import { BaseDTO} from '../../basedto'

export class CarerImmunisationInfo extends BaseDTO {
    CarerImmunisationInfoId: number;
    UniqueID: number;
    CarerParentId: number;
    CarerId: number;
    FieldCnfgId: number;
    FieldValue: string;
    SequenceNo: number;
    DynamicValue: DynamicValue = new DynamicValue();
    ControlLoadFormat: string[];
    CarerIds = [];
}