
import { BaseDTO } from '../../basedto';
import { DynamicValue } from '../../dynamic/dynamicvalue';

export class IndependenceplanComboDTO extends BaseDTO {
    UniqueID: number;
    SequenceNo: number;
    ControlLoadFormat: string[];
    DynamicValue: DynamicValue[] = [];
    ChildId: number;
    LstAgencyFieldMapping = [];
}