import { BaseDTO } from '../../basedto';
import { DynamicValue } from '../../dynamic/dynamicvalue';

export class ChildMonthlyProgressReportDTO extends BaseDTO {
    ChildMonthlyProgressReportId: number;
    UniqueID: number;
    ChildId: number;
    FieldCnfgId: number;
    FieldValue: string;
    SequenceNo: number;
    DynamicValue: DynamicValue = new DynamicValue();
    ControlLoadFormat = [];

    claSequenceNo;
    dentalSequenceNo;
    opticianSequenceNo;

}