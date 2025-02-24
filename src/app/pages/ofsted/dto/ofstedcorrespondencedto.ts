import { BaseDTO } from '../../basedto';
import { DynamicValue } from '../../dynamic/dynamicvalue';

export class OfstedCorrespondenceDTO extends BaseDTO {
    OfstedCorrespondenceId: number;
    UniqueID: number;
    AgencyProfileId: number;
    FieldId: number;
    FieldValue: string;
    SequenceNo: number;
    CarerParentIds = [];
    DynamicValue: DynamicValue = new DynamicValue();
}