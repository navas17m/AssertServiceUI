import { BaseDTO } from '../../basedto';
import { DynamicValue } from '../../dynamic/dynamicvalue';

export class ChildPersonalGoalComboDTO extends BaseDTO {
    lstChildPersonalGoalSubInfoDTO = [];
    DynamicValue: DynamicValue[] = [];
    ControlLoadFormat: string[];
    SequenceNo: number;
    ChildId: number = null;
    UniqueID: number;
}



export class ChildPersonalGoalDTO extends BaseDTO {
    DynamicValue: DynamicValue[] = [];
    ControlLoadFormat: string[];
    SequenceNo: number;
    ChildId: number = null;
}

export class PersonalGoalStatusDTO {
    FieldCnfgId: number;
    FieldName: string;
    FieldValue: string;
    SequenceNo: number;
    FieldDataTypeName: string;
    FieldValueText: string;
    StatusId: number;
    UniqueID: number;
    CoursesAttended: string;
    CarerName: string;

    DisplayName: string;
    ChildId: number;
}