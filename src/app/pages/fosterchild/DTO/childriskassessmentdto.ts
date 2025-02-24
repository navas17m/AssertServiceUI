import { BaseDTO } from '../../basedto';
import { DynamicValue } from '../../dynamic/dynamicvalue';

export class ChildRiskAssessmentDTO extends BaseDTO {

    UniqueID: number;
    ChildRiskAssessmentId: number;
    CarerParentId: number;
    ChildName: string;
    CarerName: string;
    FieldCnfgId: number;
    FieldValue: string;
    ChildId: number = 0;
    ControlLoadFormat = [];
    SequenceNo: number;  
    DynamicValue: DynamicValue[] = [];
}
