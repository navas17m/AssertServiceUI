import { BaseDTO } from '../../basedto';
import { DynamicValue } from '../../dynamic/dynamicvalue';

export class ChildCLADocumentationDynamicDTO extends BaseDTO {

    UniqueID: number;
    ChildCLADocumentationDynamicId: number;  
    FieldCnfgId: number;
    FieldValue: string;
    ChildId: number = 0;
    ControlLoadFormat = [];
    SequenceNo: number;
    DynamicValue: DynamicValue[] = [];
}
