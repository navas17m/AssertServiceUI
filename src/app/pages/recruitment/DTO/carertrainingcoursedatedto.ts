import { BaseDTO } from '../../basedto';
import { DynamicValue } from '../../dynamic/dynamicvalue';

export class CarerTrainingCourseDateDTO extends BaseDTO {
    CarerTrainingCourseDateInfoId: number;
    SequenceNo: number;
    TrainingProfileSequenceNo: number;
    CarerParentId: number;
    FieldId: number;
    FieldValue: string;
    FieldName: string; 
    DynamicValue: DynamicValue = new DynamicValue();
}