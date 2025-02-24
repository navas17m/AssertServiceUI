import { BaseDTO } from '../../basedto';
import { DynamicValue } from '../../dynamic/dynamicvalue';

export class ChildSaferCarePolicyDTO extends BaseDTO {

    UniqueID: number;
    CarerSafeCarePolicyId: number;
    CarerParentId: number;
    CarerName: string;
    FieldId: number;
    FieldValue: string;
    ChildId: number = 0;
    ControlLoadFormat = [];
    SequenceNo: number;
    ChildIds = [];
    DynamicValue: DynamicValue[] = [];
    CarerParentIds = [];
}
