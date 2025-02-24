import {DynamicValue} from '../../dynamic/dynamicvalue'
import { BaseDTO} from '../../basedto'

export class CarerSupervisoryHomeVisitDTO extends BaseDTO {
    CarerSupervisoryHomeVisitId: number;
    UniqueID: number;
    CarerParentId: number;
    FieldId: number;
    FieldValue: string;
    SequenceNo: number;
    DynamicValue: DynamicValue = new DynamicValue();
    ControlLoadFormat: string[];
    SupervisingSocialWorker: string;
    AgreementOnFile: boolean;
}