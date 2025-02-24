import { BaseDTO } from '../../basedto';
import { DynamicValue } from '../../dynamic/dynamicvalue';

export class CarerTrainingCourseStatusDTO extends BaseDTO {
    CarerTrainingCourseStatusInfoId: number;
    CarerParentId: number;
    FieldId: number;
    FieldValue: string;
    DynamicValue: DynamicValue = new DynamicValue();
    ControlLoadFormat: string[];
}