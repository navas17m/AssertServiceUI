import { BaseDTO } from '../../basedto';
import { DynamicValue } from '../../dynamic/dynamicvalue';

export class CarerTrainingProfileDTO extends BaseDTO {
    CarerTrainingProfileId: number;
    UniqueID: number;
    SequenceNo: number;
    CarerId: number = null;
    CarerParentId: number;
    FieldId: number;
    FieldValue: string;       
    DynamicValue: DynamicValue = new DynamicValue();
    ControlLoadFormat: string[];
    
}