import { BaseDTO } from '../../basedto';
import { DynamicValue } from '../../dynamic/dynamicvalue';

export class ChildYoungPersonReportDTO extends BaseDTO {
    ChildYPReportId: number;
    UniqueID: number;
    ChildId: number;
    FieldCnfgId: number;
    FieldValue: string;
    SequenceNo: number;
    DynamicValue: DynamicValue = new DynamicValue();
    ControlLoadFormat: string[];
    LstChildYPReportHealth = [];
    LstChildYPReportFinance = [];
}

export class ChildYPReportHealthDTO {
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

export class ChildYPReportFinanceDTO {
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