import {DynamicValue} from '../../dynamic/dynamicvalue'
import { BaseDTO} from '../../basedto'

export class ChildRiskAssessmentNewComboDTO extends BaseDTO {
    UniqueID: number;
    SequenceNo: number;
    ControlLoadFormat: string[];
    DynamicValue: DynamicValue[] = [];
    ChildId: number;
    LstAgencyFieldMapping = [];
    lstActionPointsList = [];
    CarerParentId: number;
}

export class CarerUnannouncedHomeVisitDTO extends BaseDTO {
    CarerUnannouncedHomeVisitId: number;
    UniqueID: number;
    CarerParentId: number;
    FieldId: number;
    FieldValue: string;
    SequenceNo: number;
    DynamicValue: DynamicValue = new DynamicValue();
    ControlLoadFormat: string[];
}

export class CarerUnannouncedHomeVisitActionPointsDTO extends BaseDTO {
    SequenceNo: number;
    ChildId: number;
    DynamicValue: DynamicValue[] = [];
    Risk: string;
    Date: Date;
    StatusId: number;
    CarerUnannouncedHomeVisitActionPointsId: number;
    FieldCnfgId: number;
    FieldName: string;
    FieldValue: string;
    FieldDataTypeName: string;
    FieldValueText: string;
    UniqueID: number;
}