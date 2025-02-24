import { BaseDTO } from '../../basedto';
import { DynamicValue } from '../../dynamic/dynamicvalue';

export class SaferCarePolicyDTO extends BaseDTO {

    UniqueID: number;
    CarerSafeCarePolicyId: number;
    CarerParentId: number;
    FieldId: number;
    FieldValue: string;
    ChildId: number;
    ControlLoadFormat = [];
    SequenceNo: number;
    ChildListId = [];
    CarerListIds = [];
    DynamicValue: DynamicValue[] = [];
    ChildNames: string;
    IsChildinPlacement:boolean;
}
