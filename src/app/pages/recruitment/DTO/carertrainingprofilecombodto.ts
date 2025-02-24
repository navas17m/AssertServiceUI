import { BaseDTO } from '../../basedto';
import { DynamicValue } from '../../dynamic/dynamicvalue';

export class CarerTrainingProfileComboDTO extends BaseDTO {
    LstCarerTrainingProfile = [];
    LstCarerTrainingCourseDate = [];
    DynamicValue: DynamicValue[] = [];
    ControlLoadFormat: string[];
    SequenceNo: number;
    CarerParentId: number;
    CarerId: number = null;
    strCarerId: number = null;
    CarerParentIds = [];
    CarerIds = [];
}